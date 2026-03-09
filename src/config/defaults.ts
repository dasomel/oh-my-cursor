export const DEFAULTS = {
  version: '0.1.0',
  rulesVersion: '0.1.0',
  backupEnabled: true,
  allRules: [
    // Global
    'global/orchestrator',
    // Agents
    'agents/planner',
    'agents/executor',
    'agents/reviewer',
    'agents/debugger',
    'agents/architect',
    'agents/test-engineer',
    'agents/security-reviewer',
    // Workflows
    'workflows/autopilot',
    'workflows/tdd',
    'workflows/plan-execute',
    // Practices
    'practices/coding-style',
    'practices/testing',
    'practices/security',
    'practices/git-workflow',
    'practices/performance',
  ],
  presets: {
    minimal: [
      'global/orchestrator',
      'agents/executor',
      'practices/coding-style',
      'practices/security',
    ],
    standard: [
      'global/orchestrator',
      'agents/planner',
      'agents/executor',
      'agents/reviewer',
      'agents/debugger',
      'workflows/autopilot',
      'practices/coding-style',
      'practices/testing',
      'practices/security',
    ],
    full: null, // all rules
  },
} as const
