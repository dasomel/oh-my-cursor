import { join } from 'path'
import { readFile, writeFile, mkdir } from 'fs/promises'
import { listAvailableRules, getRuleByName, type RuleInfo } from '../rules/index.js'
import { backupFile } from './backup.js'
import { exists, ensureDir } from '../utils/fs.js'
import { RULES_DIR, RULE_PREFIX } from '../config/paths.js'

export interface RuleInstallResult {
  installed: string[]
  updated: string[]
  skipped: string[]
  errors: Array<{ rule: string; error: string }>
}

/**
 * Install cursor rules to .cursor/rules/
 */
export async function installRules(
  projectRoot: string,
  ruleNames?: string[],
  options?: { force?: boolean; dryRun?: boolean }
): Promise<RuleInstallResult> {
  const result: RuleInstallResult = {
    installed: [],
    updated: [],
    skipped: [],
    errors: [],
  }

  const targetDir = join(projectRoot, RULES_DIR)

  if (!options?.dryRun) {
    await ensureDir(targetDir)
  }

  let rules: RuleInfo[]
  if (ruleNames && ruleNames.length > 0) {
    const resolved = await Promise.all(
      ruleNames.map(name => getRuleByName(name))
    )
    rules = resolved.filter((r): r is RuleInfo => r !== null)

    const missing = ruleNames.filter((_, i) => !resolved[i])
    for (const m of missing) {
      result.errors.push({ rule: m, error: 'Rule not found' })
    }
  } else {
    rules = await listAvailableRules()
  }

  for (const rule of rules) {
    const targetPath = join(targetDir, rule.filename)
    const alreadyExists = await exists(targetPath)

    if (alreadyExists && !options?.force) {
      result.skipped.push(rule.name)
      continue
    }

    if (options?.dryRun) {
      if (alreadyExists) {
        result.updated.push(rule.name)
      } else {
        result.installed.push(rule.name)
      }
      continue
    }

    try {
      if (alreadyExists) {
        await backupFile(targetPath)
      }

      const content = await readFile(rule.sourcePath, 'utf-8')
      await writeFile(targetPath, content, 'utf-8')

      if (alreadyExists) {
        result.updated.push(rule.name)
      } else {
        result.installed.push(rule.name)
      }
    } catch (err) {
      result.errors.push({
        rule: rule.name,
        error: err instanceof Error ? err.message : String(err),
      })
    }
  }

  return result
}
