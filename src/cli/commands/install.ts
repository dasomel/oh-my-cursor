import { Command } from 'commander'
import { install } from '../../installer/index.js'
import { logger } from '../utils/logger.js'

export function createInstallCommand(): Command {
  return new Command('install')
    .description('Install oh-my-cursor rules into your project')
    .option('--rules-only', 'Only install .cursor/rules/ files')
    .option('--cursorrules-only', 'Only update .cursorrules file')
    .option('--force', 'Overwrite existing files')
    .option('--dry-run', 'Preview changes without applying them')
    .option('--no-backup', 'Skip backup creation')
    .action(async (options) => {
      logger.title('\n🖱️  oh-my-cursor installer\n')

      if (options.dryRun) {
        logger.warn('Dry run mode — no files will be written\n')
      }

      try {
        const result = await install({
          rulesOnly: options.rulesOnly,
          cursorrulesOnly: options.cursorrulesOnly,
          force: options.force,
          dryRun: options.dryRun,
        })

        logger.info(`Project root: ${result.projectRoot}`)
        logger.blank()

        // Rules report
        const r = result.rules
        if (r.installed.length > 0) {
          logger.success(`Installed ${r.installed.length} rules:`)
          r.installed.forEach(name => logger.dim(`  + ${name}`))
        }
        if (r.updated.length > 0) {
          logger.success(`Updated ${r.updated.length} rules:`)
          r.updated.forEach(name => logger.dim(`  ~ ${name}`))
        }
        if (r.skipped.length > 0) {
          logger.dim(`Skipped ${r.skipped.length} existing rules (use --force to overwrite)`)
        }
        if (r.errors.length > 0) {
          r.errors.forEach(e => logger.error(`Failed: ${e.rule} — ${e.error}`))
        }

        // .cursorrules report
        if (result.cursorrules) {
          const cr = result.cursorrules
          if (cr.created) logger.success('Created .cursorrules with OMC section')
          else if (cr.updated) logger.success('Updated .cursorrules OMC section')
          if (cr.backupPath) logger.dim(`  Backup: ${cr.backupPath}`)
        }

        if (result.gitignoreUpdated) {
          logger.success('Added .omc-cursor/ to .gitignore')
        }

        logger.blank()
        if (!options.dryRun) {
          logger.success('Installation complete!')
          logger.dim('Open Cursor and start using @omc-orchestrator in your conversations.')
        } else {
          logger.info('Dry run complete. Run without --dry-run to apply changes.')
        }
      } catch (err) {
        logger.error(err instanceof Error ? err.message : String(err))
        process.exit(1)
      }
    })
}
