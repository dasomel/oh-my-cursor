import { join } from 'path'
import { homedir } from 'os'

// Project-level paths
export const CURSOR_DIR = '.cursor'
export const RULES_DIR = join(CURSOR_DIR, 'rules')
export const MCP_CONFIG_PATH = join(CURSOR_DIR, 'mcp.json')
export const CURSORRULES_FILE = '.cursorrules'

// OMC state directory (project-level)
export const OMC_STATE_DIR = '.omc-cursor'
export const STATE_FILE = join(OMC_STATE_DIR, 'state.json')
export const NOTEPAD_FILE = join(OMC_STATE_DIR, 'notepad.md')
export const PLANS_DIR = join(OMC_STATE_DIR, 'plans')

// Global config
export const GLOBAL_CONFIG_DIR = join(homedir(), '.omc-cursor')
export const GLOBAL_CONFIG_FILE = join(GLOBAL_CONFIG_DIR, 'config.json')

// Rule file prefix
export const RULE_PREFIX = 'omc-'
