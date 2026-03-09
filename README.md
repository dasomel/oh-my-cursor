# oh-my-cursor

Multi-agent orchestration for [Cursor IDE](https://cursor.sh), inspired by [oh-my-claudecode](https://github.com/Yeachan-Heo/oh-my-claudecode).

Cursor doesn't have Claude Code's `Task` sub-agent spawning — so oh-my-cursor brings the same multi-agent *patterns* to Cursor through a curated library of Cursor Rules (`.mdc` files) and a CLI installer.

## Features

- **16 Cursor Rules** — agent roles, workflow patterns, and coding practices
- **CLI installer** — `oh-my-cursor install` sets everything up in seconds
- **`.cursorrules` injection** — marker-based merge preserves your existing content
- **MCP-compatible** — works alongside Cursor's MCP server integrations
- **Zero dependencies at runtime** — just `.mdc` files in your project

## Quick Start

```bash
# Install globally
npm install -g oh-my-cursor

# Set up your project
cd your-project
oh-my-cursor install
```

Open Cursor and start using role-based prompts in your conversations.

## Agent Roles

| Rule | Role | When AI uses it |
|------|------|----------------|
| `omc-orchestrator` | System | Always — defines the orchestration system |
| `omc-planner` | Planner | Complex tasks requiring 3+ steps |
| `omc-executor` | Executor | Focused implementation with minimal diff |
| `omc-reviewer` | Reviewer | Code quality review with severity ratings |
| `omc-debugger` | Debugger | Root cause analysis for bugs |
| `omc-architect` | Architect | System design and trade-off analysis |
| `omc-test-engineer` | Test Engineer | TDD workflows and test strategy |
| `omc-security-reviewer` | Security Reviewer | Vulnerability and trust boundary analysis |

## Workflow Patterns

### Autopilot
```
"autopilot: build a REST API for user authentication"
```
AI runs: Expand → Plan → Implement → QA → Self-review

### Plan-Execute (Default)
```
"plan then implement rate limiting middleware"
```
AI creates a plan, awaits your approval, then executes.

### TDD
```
"tdd: add input validation to the signup form"
```
AI follows RED → GREEN → REFACTOR cycle strictly.

### Ralph Loop
```
"ralph: keep going until all tests pass"
```
AI loops through PRD → Implement → Verify until done.

## CLI Commands

```bash
oh-my-cursor install          # Install all rules + update .cursorrules
oh-my-cursor install --dry-run # Preview without applying
oh-my-cursor add executor      # Add a single rule
oh-my-cursor add workflows/tdd # Add by category/name
oh-my-cursor remove executor   # Remove a rule
oh-my-cursor list              # Show installation status
oh-my-cursor list --available  # Show all available rules
oh-my-cursor doctor            # Diagnose installation
```

## How It Works

### Rule Types

Cursor Rules come in three types:

| Type | Behavior | oh-my-cursor usage |
|------|---------|-------------------|
| **Always** | Injected into every conversation | `omc-orchestrator`, `omc-security` |
| **Auto Attached** | Injected when matching files are open | `omc-coding-style`, `omc-testing` |
| **Agent Requested** | AI decides when to fetch | Agent roles, workflow patterns |

### Marker-Based Merge

`oh-my-cursor install` injects an OMC section into your `.cursorrules` using markers:

```
<!-- OMC-CURSOR:START -->
<!-- OMC-CURSOR:VERSION:0.1.0 -->
[oh-my-cursor orchestration content]
<!-- OMC-CURSOR:END -->

[Your existing content is preserved here]
```

### State Management

oh-my-cursor uses file-based state in `.omc-cursor/` (gitignored):

```
.omc-cursor/
  plans/       ← Implementation plans created by Planner role
  notepad.md   ← Session notes (survives context compression)
  spec.md      ← Requirements from Autopilot workflow
  state.json   ← Workflow state
  backups/     ← Backups of modified files
```

## Installed Files

After `oh-my-cursor install`, your project gets:

```
.cursor/
  rules/
    omc-orchestrator.mdc       ← Always applied
    omc-planner.mdc
    omc-executor.mdc
    omc-reviewer.mdc
    omc-debugger.mdc
    omc-architect.mdc
    omc-test-engineer.mdc
    omc-security-reviewer.mdc
    omc-autopilot.mdc
    omc-tdd.mdc
    omc-plan-execute.mdc
    omc-coding-style.mdc
    omc-testing.mdc
    omc-security.mdc           ← Always applied
    omc-git-workflow.mdc
    omc-performance.mdc
.cursorrules                   ← Updated with OMC section
.omc-cursor/                   ← State (gitignored)
```

## Requirements

- Node.js >= 20.0.0
- [Cursor IDE](https://cursor.sh)

## Credits

Inspired by [oh-my-claudecode](https://github.com/Yeachan-Heo/oh-my-claudecode) by Yeachan Heo — multi-agent orchestration for Claude Code CLI.

## License

MIT © 2025 dasomel
