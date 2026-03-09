import { Command } from 'commander'
import { listAvailableRules } from '../../rules/index.js'
import { getProjectRoot } from '../../utils/git.js'
import { exists } from '../../utils/fs.js'
import { join } from 'path'
import { RULES_DIR, RULE_PREFIX } from '../../config/paths.js'
import { logger } from '../utils/logger.js'
import chalk from 'chalk'

export function createListCommand(): Command {
  return new Command('list')
    .description('List available and installed rules')
    .option('--available', 'Show all available rules')
    .option('--installed', 'Show only installed rules')
    .action(async (options) => {
      try {
        const projectRoot = await getProjectRoot()
        const allRules = await listAvailableRules()

        // Check installation status for each rule
        const rulesWithStatus = await Promise.all(
          allRules.map(async rule => {
            const targetPath = join(projectRoot, RULES_DIR, rule.filename)
            const installed = await exists(targetPath)
            return { ...rule, installed }
          })
        )

        const toShow = options.installed
          ? rulesWithStatus.filter(r => r.installed)
          : rulesWithStatus

        // Group by category
        const byCategory = new Map<string, typeof rulesWithStatus>()
        for (const rule of toShow) {
          const list = byCategory.get(rule.category) ?? []
          list.push(rule)
          byCategory.set(rule.category, list)
        }

        logger.title('\noh-my-cursor rules\n')

        const categoryOrder = ['global', 'agents', 'workflows', 'practices']
        const sortedCategories = [
          ...categoryOrder.filter(c => byCategory.has(c)),
          ...[...byCategory.keys()].filter(c => !categoryOrder.includes(c)),
        ]

        for (const category of sortedCategories) {
          const rules = byCategory.get(category)!
          console.log(chalk.bold(`  ${category}/`))
          for (const rule of rules) {
            const status = rule.installed
              ? chalk.green('✓ installed')
              : chalk.dim('✗ not installed')
            console.log(`    ${chalk.white(rule.basename.padEnd(20))} ${status}`)
          }
          logger.blank()
        }

        const installed = rulesWithStatus.filter(r => r.installed).length
        logger.dim(`${installed}/${allRules.length} rules installed`)

        if (!options.installed && installed < allRules.length) {
          logger.dim('\nRun `oh-my-cursor install` to install all rules.')
        }
      } catch (err) {
        logger.error(err instanceof Error ? err.message : String(err))
        process.exit(1)
      }
    })
}
