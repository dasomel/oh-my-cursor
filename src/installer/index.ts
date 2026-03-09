import { join } from 'path'
import { appendFile } from 'fs/promises'
import { installRules, type RuleInstallResult } from './rules-installer.js'
import { mergeCursorRules } from './cursorrules-merger.js'
import { getProjectRoot } from '../utils/git.js'
import { exists } from '../utils/fs.js'

const VERSION = '0.1.0'

export interface InstallOptions {
  projectRoot?: string
  rulesOnly?: boolean
  cursorrulesOnly?: boolean
  force?: boolean
  dryRun?: boolean
  ruleNames?: string[]
}

export interface InstallResult {
  projectRoot: string
  rules: RuleInstallResult
  cursorrules: { created: boolean; updated: boolean; backupPath: string | null } | null
  gitignoreUpdated: boolean
}

/**
 * Main installer orchestrator
 */
export async function install(options?: InstallOptions): Promise<InstallResult> {
  const projectRoot = options?.projectRoot ?? (await getProjectRoot())
  const version = VERSION

  let rules: RuleInstallResult = {
    installed: [],
    updated: [],
    skipped: [],
    errors: [],
  }

  let cursorrules = null
  let gitignoreUpdated = false

  if (!options?.cursorrulesOnly) {
    rules = await installRules(projectRoot, options?.ruleNames, {
      force: options?.force,
      dryRun: options?.dryRun,
    })
  }

  if (!options?.rulesOnly) {
    cursorrules = await mergeCursorRules(projectRoot, version, {
      force: options?.force,
      dryRun: options?.dryRun,
    })
  }

  // Add .omc-cursor to .gitignore
  if (!options?.dryRun) {
    gitignoreUpdated = await updateGitignore(projectRoot)
  }

  return { projectRoot, rules, cursorrules, gitignoreUpdated }
}

async function updateGitignore(projectRoot: string): Promise<boolean> {
  const gitignorePath = join(projectRoot, '.gitignore')
  const entry = '.omc-cursor/'

  if (await exists(gitignorePath)) {
    const { readFile } = await import('fs/promises')
    const content = await readFile(gitignorePath, 'utf-8')
    if (content.includes(entry)) return false
    await appendFile(gitignorePath, `\n${entry}\n`)
    return true
  }

  return false
}
