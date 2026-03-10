#!/usr/bin/env node
import { Command } from 'commander'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import { readFile } from 'fs/promises'
import { createInstallCommand } from './commands/install.js'
import { createAddCommand } from './commands/add.js'
import { createListCommand } from './commands/list.js'
import { createRemoveCommand } from './commands/remove.js'
import { createDoctorCommand } from './commands/doctor.js'
import { createUpdateCommand } from './commands/update.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

async function getVersion(): Promise<string> {
  try {
    const pkgPath = join(__dirname, '../../package.json')
    const pkg = JSON.parse(await readFile(pkgPath, 'utf-8'))
    return pkg.version as string
  } catch {
    return '0.1.0'
  }
}

async function main() {
  const version = await getVersion()

  const program = new Command()
    .name('oh-my-cursor')
    .description('Multi-agent orchestration rules for Cursor IDE')
    .version(version)
    .addCommand(createInstallCommand())
    .addCommand(createAddCommand())
    .addCommand(createListCommand())
    .addCommand(createRemoveCommand())
    .addCommand(createDoctorCommand())
    .addCommand(createUpdateCommand())

  await program.parseAsync(process.argv)
}

main().catch(err => {
  console.error('Fatal error:', err)
  process.exit(1)
})
