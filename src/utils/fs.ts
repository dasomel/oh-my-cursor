import { mkdir, access, readFile, writeFile, copyFile } from 'fs/promises'
import { dirname } from 'path'
import { constants } from 'fs'

/**
 * Ensures a directory exists (creates if not)
 */
export async function ensureDir(dirPath: string): Promise<void> {
  await mkdir(dirPath, { recursive: true })
}

/**
 * Checks if a file/directory exists
 */
export async function exists(path: string): Promise<boolean> {
  try {
    await access(path, constants.F_OK)
    return true
  } catch {
    return false
  }
}

/**
 * Reads a file, returns null if not found
 */
export async function readFileSafe(path: string): Promise<string | null> {
  try {
    return await readFile(path, 'utf-8')
  } catch {
    return null
  }
}

/**
 * Writes a file, creating parent directories as needed
 */
export async function writeFileSafe(path: string, content: string): Promise<void> {
  await ensureDir(dirname(path))
  await writeFile(path, content, 'utf-8')
}
