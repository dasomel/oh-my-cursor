import { Command } from 'commander'
import { readFile, writeFile } from 'fs/promises'
import { join } from 'path'
import { getProjectRoot } from '../../utils/git.js'
import { exists } from '../../utils/fs.js'
import { listAvailableRules, readRuleContent } from '../../rules/index.js'
import { RULES_DIR } from '../../config/paths.js'
import { backupFile } from '../../installer/backup.js'
import { logger } from '../utils/logger.js'

export function createUpdateCommand(): Command {
  return new Command('update')
    .description('Update installed rules to the latest version')
    .option('--dry-run', 'Preview changes without applying them')
    .option('--force', 'Update all rules, even if unchanged')
    .action(async (options) => {
      logger.title('\n  oh-my-cursor updater\n')

      if (options.dryRun) {
        logger.warn('Dry run mode — no files will be written\n')
      }

      try {
        const projectRoot = await getProjectRoot()
        const targetDir = join(projectRoot, RULES_DIR)

        if (!(await exists(targetDir))) {
          logger.error('No rules installed. Run `oh-my-cursor install` first.')
          process.exit(1)
        }

        const allRules = await listAvailableRules()
        let updated = 0
        let skipped = 0
        let notInstalled = 0

        for (const rule of allRules) {
          const targetPath = join(targetDir, rule.filename)

          if (!(await exists(targetPath))) {
            notInstalled++
            continue
          }

          const currentContent = await readFile(targetPath, 'utf-8')
          const latestContent = await readRuleContent(rule)

          if (currentContent === latestContent && !options.force) {
            skipped++
            continue
          }

          if (options.dryRun) {
            logger.dim(`  ~ ${rule.filename} (would update)`)
            updated++
            continue
          }

          await backupFile(targetPath)
          await writeFile(targetPath, latestContent, 'utf-8')
          logger.dim(`  ~ ${rule.filename}`)
          updated++
        }

        logger.blank()
        if (updated > 0) {
          logger.success(`Updated ${updated} rule(s)`)
        }
        if (skipped > 0) {
          logger.dim(`${skipped} rule(s) already up to date`)
        }
        if (notInstalled > 0) {
          logger.dim(`${notInstalled} rule(s) not installed (use \`oh-my-cursor install\` to add)`)
        }

        if (updated === 0) {
          logger.success('All installed rules are up to date!')
        }
      } catch (err) {
        logger.error(err instanceof Error ? err.message : String(err))
        process.exit(1)
      }
    })
}
