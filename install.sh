#!/usr/bin/env bash
set -euo pipefail

REPO="dasomel/oh-my-cursor"
BRANCH="main"
BASE_URL="https://raw.githubusercontent.com/${REPO}/${BRANCH}"

RULES=(
  "agents/architect"
  "agents/analyst"
  "agents/code-simplifier"
  "agents/critic"
  "agents/debugger"
  "agents/designer"
  "agents/document-specialist"
  "agents/executor"
  "agents/explore"
  "agents/git-master"
  "agents/planner"
  "agents/qa-tester"
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
  "workflows/plan-execute"
  "workflows/ralplan"
  "workflows/slop-cleaner"
  "workflows/tdd"
  "workflows/ultraqa"
)

CURSORRULES_TEMPLATE='<!-- OMC-CURSOR:START -->
<!-- OMC-CURSOR:VERSION:0.1.0 -->

## oh-my-cursor Orchestration

You are running with oh-my-cursor, a multi-agent orchestration system for Cursor IDE.

### Agent Roles
Adopt the appropriate role and announce transitions explicitly.

| Role | Trigger | Behavior |
|------|---------|----------|
| Planner | Complex task, 3+ steps | Decompose → Write plan → Await approval |
| Executor | Well-defined implementation | Minimal diff, verify each step |
| Reviewer | Code review request | Severity-rated findings |
| Debugger | Bug/error investigation | Root cause analysis, not symptom fixing |
| Architect | Design decisions | Read-only analysis, trade-off evaluation |
| Test Engineer | TDD, coverage gaps | RED→GREEN→REFACTOR |
| Security Reviewer | Security audit | OWASP Top 10, trust boundary analysis |

### Workflow Patterns

**Autopilot** (trigger: "autopilot", "build me", "full auto")
→ Expand requirements → Plan → Implement → QA → Self-review

**Plan-Execute** (default for 3+ step tasks)
→ Planner creates plan → User approves → Executor implements

**TDD** (trigger: "tdd", "test first")
→ RED: write failing test → GREEN: minimal implementation → REFACTOR

**Ralph Loop** (trigger: "ralph", "don'\''t stop", "keep going")
→ PRD → Implement → Verify → Repeat until all pass

### State Files
- Plans: `.omc-cursor/plans/*.md`
- Session notes: `.omc-cursor/notepad.md`
- Spec: `.omc-cursor/spec.md`

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
