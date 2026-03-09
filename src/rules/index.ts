import { fileURLToPath } from 'url'
import { dirname, join, relative } from 'path'
import { readdir, readFile, stat } from 'fs/promises'
import { DEFAULTS } from '../config/defaults.js'
import { RULE_PREFIX } from '../config/paths.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const RULES_SOURCE_DIR = join(__dirname, '../../rules')

export interface RuleInfo {
  name: string        // e.g. "agents/executor"
  filename: string    // e.g. "omc-executor.mdc"
  sourcePath: string  // absolute path to source .mdc file
  category: string    // e.g. "agents"
  basename: string    // e.g. "executor"
}

/**
 * Lists all available rules from the package
 */
export async function listAvailableRules(): Promise<RuleInfo[]> {
  const rules: RuleInfo[] = []

  async function walk(dir: string) {
    const entries = await readdir(dir, { withFileTypes: true })
    for (const entry of entries) {
      const fullPath = join(dir, entry.name)
      if (entry.isDirectory()) {
        await walk(fullPath)
      } else if (entry.name.endsWith('.mdc')) {
        const relPath = relative(RULES_SOURCE_DIR, fullPath)
        const parts = relPath.replace('.mdc', '').split('/')
        const category = parts.length > 1 ? parts[0] : 'misc'
        const basename = parts[parts.length - 1]
        const name = relPath.replace('.mdc', '')

        rules.push({
          name,
          filename: `${RULE_PREFIX}${basename}.mdc`,
          sourcePath: fullPath,
          category,
          basename,
        })
      }
    }
  }

  await walk(RULES_SOURCE_DIR)
  return rules
}

/**
 * Get a specific rule by name (e.g. "agents/executor" or "executor")
 */
export async function getRuleByName(name: string): Promise<RuleInfo | null> {
  const rules = await listAvailableRules()
  return rules.find(r => r.name === name || r.basename === name) ?? null
}

/**
 * Read rule source content
 */
export async function readRuleContent(rule: RuleInfo): Promise<string> {
  return readFile(rule.sourcePath, 'utf-8')
}

/**
 * Get rules for a preset
 */
export function getRulesForPreset(preset: 'minimal' | 'standard' | 'full'): string[] {
  if (preset === 'full') return DEFAULTS.allRules as unknown as string[]
  return DEFAULTS.presets[preset] as unknown as string[]
}
