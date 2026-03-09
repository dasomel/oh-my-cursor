import { Command } from 'commander'
import { getRuleByName } from '../../rules/index.js'
import { installRules } from '../../installer/rules-installer.js'
import { getProjectRoot } from '../../utils/git.js'
import { logger } from '../utils/logger.js'

export function createAddCommand(): Command {
  return new Command('add')
    .description('Add a specific rule to your project')
    .argument('<rule>', 'Rule name (e.g. executor, agents/planner, workflows/tdd)')
    .option('--force', 'Overwrite existing rule')
    .action(async (ruleName: string, options) => {
      try {
        const rule = await getRuleByName(ruleName)
        if (!rule) {
          logger.error(`Rule not found: ${ruleName}`)
          logger.dim('Run `oh-my-cursor list --available` to see available rules.')
          process.exit(1)
        }

        const projectRoot = await getProjectRoot()
        const result = await installRules(projectRoot, [ruleName], {
          force: options.force,
        })

        if (result.installed.length > 0) {
          logger.success(`Installed: .cursor/rules/${rule.filename}`)
        } else if (result.updated.length > 0) {
          logger.success(`Updated: .cursor/rules/${rule.filename}`)
        } else if (result.skipped.length > 0) {
          logger.warn(`Already installed: ${rule.filename}`)
          logger.dim('Use --force to overwrite.')
        }

        if (result.errors.length > 0) {
          result.errors.forEach(e => logger.error(e.error))
          process.exit(1)
        }
      } catch (err) {
        logger.error(err instanceof Error ? err.message : String(err))
        process.exit(1)
      }
    })
}
