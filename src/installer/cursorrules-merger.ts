import { join } from 'path'
import { readFile, writeFile } from 'fs/promises'
import { mergeContent } from '../merger/index.js'
import { backupFile } from './backup.js'
import { exists } from '../utils/fs.js'
import { CURSORRULES_FILE } from '../config/paths.js'

const CURSORRULES_TEMPLATE = `
## oh-my-cursor Orchestration

You are running with oh-my-cursor, a multi-agent orchestration system for Cursor IDE.

### Agent Roles
Adopt the appropriate role based on the task:
- **Planner**: For tasks requiring 3+ steps. Create a plan before coding.
- **Executor**: For well-defined implementation tasks. Minimal diff.
- **Reviewer**: For code quality review. Cite file:line references.
- **Debugger**: For bug investigation. Root cause first, fix second.
- **Architect**: For system design analysis. Read-only, no code changes.
- **Test Engineer**: TDD workflows. RED-GREEN-REFACTOR.
- **Security Reviewer**: Vulnerability scanning and trust boundary analysis.

### Workflow Patterns
- **Plan-Execute** (default for non-trivial work): Adopt Planner → present plan → get approval → switch to Executor
- **Autopilot** (trigger: "autopilot", "build me"): Expand → Plan → Implement → QA → Review
- **TDD** (trigger: "tdd", "test first"): RED → GREEN → REFACTOR

### State Management
- Plans: \`.omc-cursor/plans/*.md\`
- Session notes: \`.omc-cursor/notepad.md\`
- State: \`.omc-cursor/state.json\`

### Verification Protocol
Before claiming completion:
1. Run tests (show actual output)
2. Run build (show actual output)
Never say "should work" — prove it works with evidence.
`.trim()

/**
 * Install/update the OMC section in .cursorrules
 */
export async function mergeCursorRules(
  projectRoot: string,
  version: string,
  options?: { force?: boolean; dryRun?: boolean }
): Promise<{ created: boolean; updated: boolean; backupPath: string | null }> {
  const targetPath = join(projectRoot, CURSORRULES_FILE)
  const existing = await exists(targetPath)

  let currentContent = ''
  if (existing) {
    currentContent = await readFile(targetPath, 'utf-8')
  }

  const merged = mergeContent(currentContent, CURSORRULES_TEMPLATE, version)

  if (merged === currentContent) {
    return { created: false, updated: false, backupPath: null }
  }

  if (options?.dryRun) {
    return { created: !existing, updated: existing, backupPath: null }
  }

  let backupPath: string | null = null
  if (existing && !options?.force) {
    backupPath = await backupFile(targetPath)
  }

  await writeFile(targetPath, merged, 'utf-8')
  return { created: !existing, updated: existing, backupPath }
}
