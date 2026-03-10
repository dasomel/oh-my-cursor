# oh-my-cursor 사용자 가이드

**English** | [한국어](./GUIDE.ko.md)

This guide walks you through oh-my-cursor with practical examples. You don't need to memorize anything — just use natural language and the AI will activate the right roles and workflows automatically.

---

## Table of Contents

1. [How It Works](#how-it-works)
2. [Basic Usage — Agent Roles](#basic-usage--agent-roles)
3. [Workflow Patterns](#workflow-patterns)
4. [State Management](#state-management)
5. [Status Display](#status-display)
6. [Advanced Features](#advanced-features)
7. [FAQ](#faq)

---

## How It Works

oh-my-cursor teaches your Cursor AI to **switch between specialized roles** depending on what you ask. Think of it like having a team of experts in one conversation.

```
You: "Fix this login bug"
AI: [🐛 Debugger]
    Switching to Debugger role.
    Let me trace the root cause...

You: "Now add unit tests for it"
AI: [🧪 Test Engineer]
    Switching to Test Engineer role.
    Starting TDD workflow...
```

### Key Concept: Roles, Not Sub-Agents

Unlike Claude Code which spawns separate agents, Cursor works within a single conversation. oh-my-cursor makes the AI **adopt specialized behaviors** by switching roles — each with its own rules, priorities, and output format.

---

## Basic Usage — Agent Roles

### Just Ask Naturally

You don't need special commands. Just describe what you want:

| What you say | Role activated | What happens |
|-------------|---------------|-------------|
| "Fix the TypeError in auth.ts" | 🐛 Debugger | Root cause analysis, then fix |
| "Implement the payment API" | 🟢 Executor | Focused implementation with minimal changes |
| "Review this code" | 🔍 Reviewer | Severity-rated code quality findings |
| "Is this architecture right?" | 🏗️ Architect | Read-only design analysis |
| "Add tests for the user service" | 🧪 Test Engineer | TDD: RED → GREEN → REFACTOR |
| "Check for security issues" | 🔒 Security Reviewer | OWASP Top 10, trust boundary scan |
| "Where is the auth logic?" | 🧭 Explorer | Codebase discovery, file mapping |
| "What should the requirements be?" | 📊 Analyst | Acceptance criteria definition |
| "Is this feature complete?" | ✅ Verifier | Evidence-based completion check |
| "Build errors after merge" | 🔧 Build Fixer | Minimal diff compilation fixes |
| "Simplify this function" | ✂️ Code Simplifier | Reduce complexity, remove dead code |
| "Critique this plan" | 🎭 Critic | Constructive challenge |
| "Be harsh — tear this apart" | 💀 Harsh Critic | Structured gap analysis, strong rejection |

### Example: Bug Fix Flow

```
You: "Users can't log in after the last deploy"

AI: [🐛 Debugger]
    Switching to Debugger role.

    1. Reading auth middleware... found the issue.
    2. Root cause: session token validation changed in commit abc123
       but the cookie format wasn't updated.

    Switching to Executor role.

AI: [🟢 Executor]
    Fix applied:
    - Modified: src/auth/session.ts (line 42)
    - Changed: cookie parser to handle new token format

    Running tests... ✅ 23/23 passed
    Running build... ✅ Success
```

---

## Workflow Patterns

Workflows are **multi-role sequences** activated by keywords or task complexity.

### 1. Plan-Execute (Default for complex tasks)

**Trigger:** Any task with 3+ steps, or say "plan this"

```
You: "Add a notification system with email and push support"

AI: [📋 Planner]
    This requires multiple steps. Creating a plan...

    ## Implementation Plan
    1. Define notification interface and types
    2. Implement email provider adapter
    3. Implement push notification adapter
    4. Create notification service with routing logic
    5. Add API endpoints
    6. Write tests

    Saved to: .omc-cursor/plans/notification-system.md

    Proceed with this plan? (yes/no)

You: "yes"

AI: [🟢 Executor | plan-execute:step-1/6]
    Step 1: Defining notification interface...
    ...
AI: [🟢 Executor | plan-execute:step-2/6]
    Step 2: Implementing email adapter...
    ...
```

### 2. Autopilot

**Trigger:** "autopilot", "build me", "full auto"

The AI handles everything end-to-end: requirements → plan → implement → QA → review.

```
You: "autopilot: build a REST API for user authentication"

AI: [📊 Analyst | autopilot:phase-0]
    Phase 0: Expanding requirements...
    - User registration with email/password
    - Login with JWT tokens
    - Password reset flow
    - Rate limiting
    Saved to: .omc-cursor/spec.md

AI: [📋 Planner | autopilot:phase-1]
    Phase 1: Creating implementation plan...
    (8 steps identified)

AI: [🟢 Executor | autopilot:phase-2]
    Phase 2: Implementing...
    (creates files, writes code)

AI: [🧪 QA Tester | autopilot:phase-3]
    Phase 3: QA loop...
    Running tests... 2 failures found
    Fixing... retrying... ✅ All pass

AI: [🔍 Reviewer | autopilot:phase-4]
    Phase 4: Self-review...
    No critical issues found. Security review passed.
```

### 3. TDD (Test-Driven Development)

**Trigger:** "tdd", "test first", "red green"

```
You: "tdd: add input validation to the signup form"

AI: [🧪 Test Engineer | tdd:red]
    RED: Writing failing test first...

    test("rejects email without @ symbol", () => {
      expect(validateEmail("invalid")).toBe(false);
    });

    Running test... ❌ FAIL (function doesn't exist yet)

AI: [🟢 Executor | tdd:green]
    GREEN: Minimal implementation...

    function validateEmail(email: string): boolean {
      return email.includes("@");
    }

    Running test... ✅ PASS

AI: [✂️ Code Simplifier | tdd:refactor]
    REFACTOR: Improving without breaking tests...

    function validateEmail(email: string): boolean {
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    Running test... ✅ PASS
```

### 4. Ralph (Persistence Loop)

**Trigger:** "ralph", "don't stop", "keep going until done"

Ralph tracks work via a PRD and iterates until every story passes.

```
You: "ralph: implement the complete checkout flow"

AI: [📋 Planner | ralph:prd]
    Creating PRD...
    S1: Cart summary component
    S2: Shipping address form
    S3: Payment integration
    S4: Order confirmation
    S5: Email receipt
    Saved to: .omc-cursor/prd.json

AI: [🟢 Executor | ralph:S1]
    Implementing S1: Cart summary...

AI: [✅ Verifier | ralph:verify]
    Verifying S1... ✅ All criteria met

    Ralph Progress: [==--------] 1/5 stories
      S1: passed  S2: next  S3: pending  S4: pending  S5: pending

AI: [🟢 Executor | ralph:S2]
    Implementing S2: Shipping address form...
    ...continues until all stories pass...

AI: [🏗️ Architect | ralph:signoff]
    Final sign-off: All 5 stories pass. No integration issues.
```

### 5. Ralplan (Consensus Planning)

**Trigger:** "ralplan", "consensus plan"

Multiple perspectives refine a plan until consensus:

```
You: "ralplan: design the new API for our microservice"

AI: [📋 Planner | ralplan:round-1]
    Round 1 — Planner proposes:
    - REST API with versioning
    - JWT auth, rate limiting
    - PostgreSQL with Prisma ORM

AI: [🏗️ Architect | ralplan:round-1]
    Architect evaluates:
    - ✅ REST + versioning is appropriate
    - ⚠️ Consider GraphQL for mobile clients
    - ⚠️ Prisma may be slow for complex queries

AI: [🎭 Critic | ralplan:round-1]
    Critic challenges:
    - Why not gRPC for service-to-service?
    - Rate limiting needs per-tenant strategy
    - Missing: circuit breaker for downstream services

AI: [📋 Planner | ralplan:round-2]
    Round 2 — Revised plan:
    - REST for public API, gRPC for internal
    - Per-tenant rate limiting with Redis
    - Circuit breaker with exponential backoff
    ...

    ✅ Consensus reached after 2 rounds.
```

### 6. Swarm (Micro-Task Decomposition)

**Trigger:** "swarm", "decompose", "break this down"

```
You: "swarm: add error handling to all 8 API endpoints"

AI: [📋 Planner | swarm:decompose]
    Decomposing into 8 micro-tasks:

    T1: Add error handling to GET /users
    T2: Add error handling to POST /users
    T3: Add error handling to GET /users/:id
    T4: Add error handling to PUT /users/:id
    T5: Add error handling to DELETE /users/:id
    T6: Add error handling to POST /auth/login
    T7: Add error handling to POST /auth/refresh
    T8: Add error handling to POST /auth/logout

AI: [🟢 Executor | swarm:T1]
    T1: GET /users — done ✅

AI: [🟢 Executor | swarm:T2]
    T2: POST /users — done ✅
    ...

    Swarm Progress: [==========] 8/8 tasks
    All tasks complete. Running verification...
```

### 7. Deep Interview

**Trigger:** "deep interview", "interview me", "understand before coding"

```
You: "deep interview: I want to refactor our auth system"

AI: [📊 Analyst | deep-interview]
    Before I start, let me understand the requirements:

    1. What specific problems are you facing with the current auth?
    2. Which auth methods do you support (password, OAuth, SSO)?
    3. Are there performance issues or security concerns?
    4. What's the expected user scale (100? 10K? 1M)?

You: "OAuth is broken, we need SSO for enterprise, scale to 100K users"

AI: [📊 Analyst | deep-interview]
    Follow-up questions:
    5. Which SSO providers (Okta, Azure AD, Google Workspace)?
    6. Do you need backward compatibility with existing sessions?
    7. Is there a deadline or can we do incremental migration?

    ...after several rounds...

    Requirements spec created: .omc-cursor/spec.md
    Recommended workflow: Plan-Execute with Security Reviewer
```

### 8. UltraQA

**Trigger:** "ultraqa", "qa loop", "keep testing until everything passes"

```
You: "ultraqa: make sure the payment flow has zero bugs"

AI: [🧪 QA Tester | ultraqa:cycle-1]
    Cycle 1: Running all payment tests...
    ❌ 3 failures found

AI: [🐛 Debugger | ultraqa:cycle-1]
    Diagnosing failures:
    - Test 7: race condition in concurrent payments
    - Test 12: missing null check on discount code
    - Test 15: timezone issue in receipt date

AI: [🟢 Executor | ultraqa:cycle-1]
    Fixing all 3 issues...

AI: [✅ Verifier | ultraqa:cycle-1]
    Verifying fixes... Test 7 ✅, Test 12 ✅, Test 15 ✅
    New test run: ❌ 1 regression found

AI: [🐛 Debugger | ultraqa:cycle-2]
    Cycle 2: Diagnosing regression...
    ...continues until all pass (max 5 cycles)...
```

### 9. Slop Cleaner

**Trigger:** "deslop", "clean slop", "clean up AI-generated code"

```
You: "deslop: clean up the AI-generated user service"

AI: [🧪 Test Engineer | deslop:baseline]
    Running test baseline... 15/15 pass

AI: [✂️ Code Simplifier | deslop:identify]
    Slop patterns found:
    - 23 unnecessary comments ("// Set the user name")
    - 5 empty error handlers
    - 3 unused imports
    - 2 over-abstracted utility functions
    - 1 dead code block

AI: [🟢 Executor | deslop:delete]
    Deleting aggressively...
    - Removed 47 lines of slop
    - Inlined 2 unnecessary abstractions

    Running tests... 15/15 still pass ✅
    Behavior preserved. Code is cleaner.
```

### 10. Learner

**Trigger:** "learn this", "save pattern", "remember this"

```
You: "learn this: in our project, always use zod for API validation"

AI: [📝 Learner]
    Learned Pattern:
    - Pattern: Use zod schemas for all API input validation
    - Saved to: .cursor/rules/project-api-validation.mdc
    - Scope: Auto-attached when editing **/*.ts API files
    - Conflicts: none

    This rule will now be applied automatically when relevant files are open.
```

### 11. Release

**Trigger:** "release", "bump version", "changelog"

```
You: "release: create a new version"

AI: [🧭 Explorer | release:analyze]
    Commits since v0.1.0:
    - 5 feat commits
    - 2 fix commits
    - 3 docs commits
    Recommended bump: minor (0.1.0 → 0.2.0)

AI: [✏️ Writer | release:changelog]
    Updated CHANGELOG.md:
    ## [0.2.0] - 2025-03-10
    ### Added
    - Swarm workflow for micro-task decomposition
    - Refactoring patterns practice rule
    ...

AI: [🟢 Executor | release:version]
    Updated version in package.json
    Build passes ✅

AI: [🌿 Git Master | release:tag]
    Ready to commit and tag:
    - Commit: "chore: release v0.2.0"
    - Tag: v0.2.0

    Push to remote? (waiting for your approval)
```

---

## State Management

oh-my-cursor saves important state to survive long conversations:

```
.omc-cursor/
  plans/           ← Implementation plans
  notepad.md       ← Critical context (survives compression)
  prd.json         ← Ralph story tracking
  spec.md          ← Autopilot requirements
  handoffs/        ← Role transition documents
  research/        ← Research notes
  backups/         ← File backups before modifications
```

### Context Persistence Example

```
You: (after a long conversation, context gets compressed)

AI: [🎯 Orchestrator]
    Context was compressed. Reading notepad...

    Restored context from .omc-cursor/notepad.md:
    - Goal: Implement checkout flow
    - Current step: 3/6 (payment integration)
    - Decisions: Using Stripe API, webhook-based confirmation
    - Files modified: src/checkout/cart.ts, src/checkout/shipping.ts

    Continuing from step 3...
```

---

## Status Display

Every response starts with a status badge showing the current role and workflow:

```
[🎯 Orchestrator]                     — No active workflow
[🟢 Executor | plan-execute:step-3/5] — Executing step 3 of 5
[📋 Planner | autopilot:phase-1]      — Autopilot planning phase
[🐛 Debugger | ultraqa:cycle-2/5]     — Debugging in QA cycle
[🔍 Reviewer | autopilot:phase-4]     — Self-review phase
[✅ Verifier | ralph:verify]          — Ralph verification
```

---

## Advanced Features

### Pre-Execution Gate

The AI automatically evaluates your request before acting:

```
You: "Make the app better"

AI: [📋 Planner]
    This request is vague — I'll plan before implementing.
    What specific aspects should I improve?
    - Performance?
    - UI/UX?
    - Code quality?
    - Test coverage?
```

```
You: "Fix the typo on line 42 of README.md"

AI: [🟢 Executor]
    (Trivial task — executes directly without planning)
```

### Escalation Protocol

```
AI: [🔧 Build Fixer | attempt 1]
    Trying to fix the type error...
    ❌ Still failing

AI: [🔧 Build Fixer | attempt 2]
    Different approach...
    ❌ Still failing

AI: [🟢 Executor | escalated]
    Escalating to Executor with broader context.
    The issue is structural — needs refactoring, not just a type fix.
```

### Handoff Protocol

When roles switch during complex work, a handoff document preserves context:

```
AI: [📋 Planner → 🟢 Executor]
    Handoff created: .omc-cursor/handoffs/planner-to-executor.md

    Context: Designed 5-step plan for auth refactor
    Key decisions: Using OAuth2 + PKCE, no session cookies
    Open questions: Redis session store vs JWT-only
    Next step: Implement OAuth2 provider adapter
```

---

## FAQ

### Q: Do I need to use specific commands?
**No.** Just describe what you want in natural language. The AI detects the right role automatically. Keywords like "autopilot", "tdd", "ralph" are shortcuts, not requirements.

### Q: What if the AI picks the wrong role?
Just tell it: "Switch to Debugger role" or "I need a code review, not implementation."

### Q: Does this work with all Cursor models?
Yes. The rules work with any model Cursor supports. More capable models will follow the patterns more consistently.

### Q: Can I customize the rules?
Absolutely. Edit any `.mdc` file in `.cursor/rules/`. You can:
- Change `alwaysApply: true` to make a rule always active
- Modify `globs` to control when rules auto-attach
- Edit the instructions to match your team's conventions

### Q: Does this slow down the AI?
The `alwaysApply` rules (orchestrator + security) add minimal overhead. All other rules are loaded on-demand by the AI when relevant.

### Q: How do I uninstall?
```bash
rm -rf .cursor/rules/omc-*.mdc
# Remove OMC section from .cursorrules (between OMC-CURSOR:START and END markers)
rm -rf .omc-cursor/
```
