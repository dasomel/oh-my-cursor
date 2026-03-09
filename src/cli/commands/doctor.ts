import { Command } from 'commander'
import { getProjectRoot } from '../../utils/git.js'
import { exists, readFileSafe } from '../../utils/fs.js'
import { listAvailableRules } from '../../rules/index.js'
import { parseMdc } from '../../rules/parser.js'
import { hasOmcMarkers } from '../../merger/index.js'
import { join } from 'path'
import { CURSOR_DIR, RULES_DIR, CURSORRULES_FILE } from '../../config/paths.js'
import { logger } from '../utils/logger.js'
import chalk from 'chalk'
import { execFile } from 'child_process'
import { promisify } from 'util'

const execFileAsync = promisify(execFile)

interface CheckResult {
  passed: boolean
  warning?: boolean
  message: string
}

async function check(label: string, fn: () => Promise<CheckResult>): Promise<CheckResult> {
  const result = await fn()
  const icon = result.passed
    ? chalk.green('✓')
    : result.warning
      ? chalk.yellow('⚠')
      : chalk.red('✗')
  console.log(`  ${icon} ${result.message}`)
  return result
}

export function createDoctorCommand(): Command {
  return new Command('doctor')
    .description('Diagnose oh-my-cursor installation')
    .action(async () => {
      logger.title('\n🩺 oh-my-cursor doctor\n')

      const projectRoot = await getProjectRoot()
      const results: CheckResult[] = []

      results.push(
        await check('cursor-dir', async () => {
          const ok = await exists(join(projectRoot, CURSOR_DIR))
          return {
            passed: ok,
            message: ok
              ? '.cursor/ directory exists'
              : '.cursor/ directory missing — run `oh-my-cursor install`',
          }
        })
      )

      results.push(
        await check('rules-dir', async () => {
          const ok = await exists(join(projectRoot, RULES_DIR))
          return {
            passed: ok,
            message: ok
              ? '.cursor/rules/ directory exists'
              : '.cursor/rules/ missing — run `oh-my-cursor install`',
          }
        })
      )

      const allRules = await listAvailableRules()
      let validCount = 0
      for (const rule of allRules) {
        const targetPath = join(projectRoot, RULES_DIR, rule.filename)
        if (await exists(targetPath)) {
          const content = await readFileSafe(targetPath)
          if (content) {
            try {
              parseMdc(content)
              validCount++
            } catch {
              // invalid
            }
          }
        }
      }

      results.push(
        await check('rules-valid', async () => ({
          passed: validCount > 0,
          message: validCount > 0
            ? `${validCount} rules installed and valid`
            : 'No rules installed — run `oh-my-cursor install`',
        }))
      )

      results.push(
        await check('cursorrules', async () => {
          const path = join(projectRoot, CURSORRULES_FILE)
          if (!(await exists(path))) {
            return { passed: false, message: '.cursorrules missing — run `oh-my-cursor install`' }
          }
          const content = await readFileSafe(path)
          const hasMarkers = content ? hasOmcMarkers(content) : false
          return {
            passed: hasMarkers,
            message: hasMarkers
              ? '.cursorrules OMC markers intact'
              : '.cursorrules exists but missing OMC markers',
          }
        })
      )

      results.push(
        await check('node-version', async () => {
          const version = process.versions.node
          const [major] = version.split('.').map(Number)
          const ok = major >= 20
          return {
            passed: ok,
            message: ok
              ? `Node.js v${version} (≥ 20.0.0)`
              : `Node.js v${version} — requires ≥ 20.0.0`,
          }
        })
      )

      results.push(
        await check('gitignore', async () => {
          const path = join(projectRoot, '.gitignore')
          if (!(await exists(path))) {
            return { passed: true, warning: true, message: '.gitignore not found (optional)' }
          }
          const content = await readFileSafe(path) ?? ''
          const hasEntry = content.includes('.omc-cursor')
          return {
            passed: hasEntry,
            warning: !hasEntry,
            message: hasEntry
              ? '.gitignore includes .omc-cursor/'
              : '.gitignore missing .omc-cursor/ entry',
          }
        })
      )

      logger.blank()
      const errors = results.filter(r => !r.passed && !r.warning).length
      const warnings = results.filter(r => r.warning && !r.passed).length
      const passed = results.filter(r => r.passed).length

      if (errors === 0 && warnings === 0) {
        logger.success(`All checks passed (${passed}/${results.length})`)
      } else {
        logger.dim(`${errors} error(s), ${warnings} warning(s), ${passed} passed`)
        if (errors > 0) {
          logger.blank()
          logger.info('Run `oh-my-cursor install` to fix issues.')
        }
      }
    })
}
