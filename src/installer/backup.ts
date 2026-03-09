import { copyFile, mkdir } from 'fs/promises'
import { join, basename } from 'path'
import { exists } from '../utils/fs.js'

/**
 * Creates a backup of a file before modification
 */
export async function backupFile(filePath: string): Promise<string | null> {
  if (!(await exists(filePath))) return null

  const backupDir = join('.omc-cursor', 'backups')
  await mkdir(backupDir, { recursive: true })

  const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
  const backupPath = join(backupDir, `${basename(filePath)}.${timestamp}.bak`)
  await copyFile(filePath, backupPath)
  return backupPath
}
