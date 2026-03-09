import { Command } from 'commander'
import { getRuleByName } from '../../rules/index.js'
import { getProjectRoot } from '../../utils/git.js'
import { exists } from '../../utils/fs.js'
import { join } from 'path'
import { RULES_DIR } from '../../config/paths.js'
import { unlink } from 'fs/promises'
import { logger } from '../utils/logger.js'

export function createRemoveCommand(): Command {
  return new Command('remove')
    .description('Remove an installed rule')
    .argument('<rule>', 'Rule name to remove')
    .action(async (ruleName: string) => {
      try {
        const rule = await getRuleByName(ruleName)
        if (!rule) {
          logger.error(`Unknown rule: ${ruleName}`)
          process.exit(1)
        }

        const projectRoot = await getProjectRoot()
        const targetPath = join(projectRoot, RULES_DIR, rule.filename)

        if (!(await exists(targetPath))) {
          logger.warn(`Rule not installed: ${rule.filename}`)
          return
        }

        await unlink(targetPath)
        logger.success(`Removed: .cursor/rules/${rule.filename}`)
      } catch (err) {
        logger.error(err instanceof Error ? err.message : String(err))
        process.exit(1)
      }
    })
}
