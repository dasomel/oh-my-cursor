import { parse as parseYaml, stringify as stringifyYaml } from 'yaml'

export interface MdcFrontmatter {
  description: string
  globs?: string | string[]
  alwaysApply?: boolean
}

export interface MdcRule {
  frontmatter: MdcFrontmatter
  content: string
}

const FRONTMATTER_REGEX = /^---\n([\s\S]*?)\n---\n([\s\S]*)$/

/**
 * Parses a .mdc file content into structured MdcRule
 */
export function parseMdc(raw: string): MdcRule {
  const match = raw.match(FRONTMATTER_REGEX)
  if (!match) {
    throw new Error('Invalid .mdc file: missing frontmatter')
  }

  const frontmatter = parseYaml(match[1]) as MdcFrontmatter
  const content = match[2].trim()

  return { frontmatter, content }
}

/**
 * Serializes a MdcRule back to .mdc file content
 */
export function serializeMdc(rule: MdcRule): string {
  const frontmatterStr = stringifyYaml(rule.frontmatter).trim()
  return `---\n${frontmatterStr}\n---\n\n${rule.content}\n`
}

/**
 * Validates frontmatter fields
 */
export function validateMdcFrontmatter(fm: unknown): fm is MdcFrontmatter {
  if (!fm || typeof fm !== 'object') return false
  const obj = fm as Record<string, unknown>
  if (typeof obj.description !== 'string' || !obj.description) return false
  if (obj.globs !== undefined) {
    if (typeof obj.globs !== 'string' && !Array.isArray(obj.globs)) return false
  }
  if (obj.alwaysApply !== undefined && typeof obj.alwaysApply !== 'boolean') {
    return false
  }
  return true
}
