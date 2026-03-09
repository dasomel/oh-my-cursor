import { execFile } from 'child_process'
import { promisify } from 'util'
import { resolve } from 'path'

const execFileAsync = promisify(execFile)

/**
 * Find git repository root from current directory
 */
export async function findGitRoot(startDir?: string): Promise<string | null> {
  try {
    const cwd = startDir ?? process.cwd()
    const { stdout } = await execFileAsync(
      'git',
      ['rev-parse', '--show-toplevel'],
      { cwd }
    )
    return resolve(stdout.trim())
  } catch {
    return null
  }
}

/**
 * Get project root: git root or current directory
 */
export async function getProjectRoot(startDir?: string): Promise<string> {
  const gitRoot = await findGitRoot(startDir)
  return gitRoot ?? (startDir ?? process.cwd())
}
