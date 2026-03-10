#!/usr/bin/env bash
set -euo pipefail

REPO="dasomel/oh-my-cursor"
BRANCH="main"
BASE_URL="https://raw.githubusercontent.com/${REPO}/${BRANCH}"

RULES=(
  "agents/analyst"
  "agents/architect"
  "agents/build-fixer"
  "agents/code-simplifier"
  "agents/critic"
  "agents/debugger"
  "agents/deep-executor"
  "agents/designer"
  "agents/document-specialist"
  "agents/executor"
  "agents/explore"
  "agents/git-master"
  "agents/harsh-critic"
  "agents/planner"
  "agents/qa-tester"
  "agents/quality-reviewer"
  "agents/reviewer"
  "agents/scientist"
  "agents/security-reviewer"
  "agents/test-engineer"
  "agents/verifier"
  "agents/writer"
  "global/orchestrator"
  "practices/coding-style"
  "practices/git-workflow"
  "practices/karpathy-guidelines"
  "practices/performance"
  "practices/security"
  "practices/testing"
  "workflows/autopilot"
  "workflows/deep-interview"
  "workflows/learner"
  "workflows/plan-execute"
  "workflows/ralph"
  "workflows/ralplan"
  "workflows/release"
  "workflows/slop-cleaner"
  "workflows/tdd"
  "workflows/ultraqa"
)

CURSORRULES_TEMPLATE='<!-- OMC-CURSOR:START -->
<!-- OMC-CURSOR:VERSION:0.1.0 -->

## oh-my-cursor Orchestration

You are running with oh-my-cursor, a multi-agent orchestration system for Cursor IDE.

### Agent Roles (22)
Adopt the appropriate role and announce transitions explicitly.
Show status badge at start of every response: [icon Role | workflow:phase]

| Role | Trigger | Behavior |
|------|---------|----------|
| Planner | Complex task, 3+ steps | Decompose → Write plan → Await approval |
| Executor | Well-defined implementation | Minimal diff, verify each step |
| Deep Executor | Complex autonomous task | Self-directed multi-phase implementation |
| Reviewer | Code review request | Severity-rated findings |
| Quality Reviewer | Quality/design review | SOLID, anti-patterns, logic analysis |
| Debugger | Bug/error investigation | Root cause analysis, not symptom fixing |
| Architect | Design decisions | Read-only analysis, trade-off evaluation |
| Test Engineer | TDD, coverage gaps | RED→GREEN→REFACTOR |
| Security Reviewer | Security audit | OWASP Top 10, trust boundary analysis |
| Build Fixer | Build/type errors | Minimal diff compilation fixes |
| Explorer | Unfamiliar codebase | File/symbol mapping, read-only |
| Analyst | Unclear requirements | Acceptance criteria definition |
| Verifier | Completion check | Evidence-based claim validation |
| Critic | Plan critique | Constructive challenge |
| Harsh Critic | High-stakes review | Structured gap analysis, strong rejection |
| Designer | UI/UX decisions | Component design, accessibility |
| Writer | Documentation | README, API docs, migration notes |
| Git Master | Git operations | Commit history, branch management |
| Code Simplifier | Cleanup request | Dead code removal, flatten complexity |
| Scientist | Data analysis | Benchmarking, metrics interpretation |
| QA Tester | Runtime testing | Edge case exploration, regression testing |
| Document Specialist | Doc lookup | External documentation reference |

### Pre-Execution Gate
Vague requests (no file paths, no function names) → Planner role first.
Never start coding on ambiguous requests without planning.

### Workflow Patterns

**Autopilot** (trigger: "autopilot", "build me", "full auto")
→ Expand requirements → Plan → Implement → QA → Self-review

**Plan-Execute** (default for 3+ step tasks)
→ Planner creates plan → User approves → Executor implements

**TDD** (trigger: "tdd", "test first")
→ RED: write failing test → GREEN: minimal implementation → REFACTOR

**Ralph Loop** (trigger: "ralph", "don'\''t stop", "keep going")
→ PRD → Implement → Verify → Repeat until all pass

**Ralplan** (trigger: "ralplan", "consensus plan")
→ Planner → Architect → Critic → consensus (max 3 rounds)

**UltraQA** (trigger: "ultraqa", "qa loop")
→ Test → Diagnose → Fix → Verify → Repeat (max 5 cycles)

**Learner** (trigger: "learn this", "save pattern")
→ Extract pattern → Create .mdc rule file

**Release** (trigger: "release", "changelog")
→ Analyze commits → Version bump → Changelog → Tag

### State Files
- Plans: `.omc-cursor/plans/*.md`
- Session notes: `.omc-cursor/notepad.md`
- PRD: `.omc-cursor/prd.json`
- Spec: `.omc-cursor/spec.md`
- Handoffs: `.omc-cursor/handoffs/*.md`

### Context Persistence
Write critical context to `.omc-cursor/notepad.md` to survive context compression.
After compression, always read notepad first.

### Verification Protocol
Prove completion with actual command output — never say "should work."
<!-- OMC-CURSOR:END -->'

echo ""
echo "  oh-my-cursor installer"
echo ""

# Detect project root (git root or current directory)
PROJECT_ROOT=$(git rev-parse --show-toplevel 2>/dev/null || pwd)
echo "  Project root: ${PROJECT_ROOT}"

TARGET_DIR="${PROJECT_ROOT}/.cursor/rules"
mkdir -p "${TARGET_DIR}"

# Download rules
installed=0
failed=0
for rule in "${RULES[@]}"; do
  basename=$(echo "$rule" | sed 's|.*/||')
  filename="omc-${basename}.mdc"
  target="${TARGET_DIR}/${filename}"

  if curl -fsSL "${BASE_URL}/rules/${rule}.mdc" -o "${target}" 2>/dev/null; then
    echo "  + ${filename}"
    installed=$((installed + 1))
  else
    echo "  ! Failed: ${filename}"
    failed=$((failed + 1))
  fi
done

# Update .cursorrules
CURSORRULES_PATH="${PROJECT_ROOT}/.cursorrules"
if [ -f "${CURSORRULES_PATH}" ]; then
  if grep -q "OMC-CURSOR:START" "${CURSORRULES_PATH}"; then
    # Replace existing OMC section
    BEFORE=$(awk '/<!-- OMC-CURSOR:START -->/{exit} {print}' "${CURSORRULES_PATH}")
    AFTER=$(awk 'p; /<!-- OMC-CURSOR:END -->/{p=1}' "${CURSORRULES_PATH}")
    {
      [ -n "$BEFORE" ] && printf '%s\n' "$BEFORE"
      printf '%s\n' "$CURSORRULES_TEMPLATE"
      [ -n "$AFTER" ] && printf '%s\n' "$AFTER"
    } > "${CURSORRULES_PATH}.tmp"
    mv "${CURSORRULES_PATH}.tmp" "${CURSORRULES_PATH}"
    echo "  ~ Updated .cursorrules (OMC section replaced)"
  else
    # Append OMC section
    {
      cat "${CURSORRULES_PATH}"
      echo ""
      printf '%s\n' "$CURSORRULES_TEMPLATE"
    } > "${CURSORRULES_PATH}.tmp"
    mv "${CURSORRULES_PATH}.tmp" "${CURSORRULES_PATH}"
    echo "  + Updated .cursorrules (OMC section appended)"
  fi
else
  printf '%s\n' "$CURSORRULES_TEMPLATE" > "${CURSORRULES_PATH}"
  echo "  + Created .cursorrules"
fi

# Add .omc-cursor/ to .gitignore
GITIGNORE="${PROJECT_ROOT}/.gitignore"
if [ -f "${GITIGNORE}" ]; then
  if ! grep -q ".omc-cursor" "${GITIGNORE}"; then
    echo ".omc-cursor/" >> "${GITIGNORE}"
    echo "  + Added .omc-cursor/ to .gitignore"
  fi
fi

# Create state directory
mkdir -p "${PROJECT_ROOT}/.omc-cursor"

echo ""
echo "  Installed ${installed} rules (${failed} failed)"
echo ""
echo "  Open Cursor and start using role-based prompts."
echo ""
