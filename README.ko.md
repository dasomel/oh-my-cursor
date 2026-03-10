# oh-my-cursor

[English](./README.md) | **한국어**

[Cursor IDE](https://cursor.sh)를 위한 멀티 에이전트 오케스트레이션. [oh-my-claudecode](https://github.com/Yeachan-Heo/oh-my-claudecode)에서 영감을 받았습니다.

Cursor에는 Claude Code의 `Task` 서브 에이전트 스포닝 기능이 없습니다. oh-my-cursor는 Cursor Rules(`.mdc` 파일) 라이브러리와 CLI 설치 도구를 통해 동일한 멀티 에이전트 *패턴*을 Cursor에 제공합니다.

## 특징

- **16개의 Cursor Rules** — 에이전트 역할, 워크플로우 패턴, 코딩 관행
- **CLI 설치 도구** — `oh-my-cursor install`로 몇 초 만에 설정 완료
- **`.cursorrules` 주입** — 마커 기반 병합으로 기존 내용 보존
- **MCP 호환** — Cursor의 MCP 서버 통합과 함께 사용 가능
- **런타임 의존성 없음** — 프로젝트에 `.mdc` 파일만 추가

## 빠른 시작

### 방법 1: Shell 스크립트 (의존성 없음)

```bash
cd your-project
curl -fsSL https://raw.githubusercontent.com/dasomel/oh-my-cursor/main/install.sh | bash
```

### 방법 2: Clone + Make

```bash
git clone https://github.com/dasomel/oh-my-cursor.git ~/.oh-my-cursor
cd your-project
PROJECT=$(pwd) make -f ~/.oh-my-cursor/Makefile install
```

### 방법 3: npm (add/remove/doctor CLI 포함)

```bash
npm install -g oh-my-cursor
cd your-project
oh-my-cursor install
```

설치 후 Cursor를 열고 역할 기반 프롬프트를 사용하세요.

## 에이전트 역할

| 규칙 | 역할 | AI가 사용하는 시점 |
|------|------|-----------------|
| `omc-orchestrator` | 시스템 | 항상 — 오케스트레이션 시스템 정의 |
| `omc-planner` | 플래너 | 3단계 이상의 복잡한 작업 |
| `omc-executor` | 실행자 | 최소 diff로 집중 구현 |
| `omc-reviewer` | 리뷰어 | 심각도별 코드 품질 리뷰 |
| `omc-debugger` | 디버거 | 버그의 근본 원인 분석 |
| `omc-architect` | 아키텍트 | 시스템 설계 및 트레이드오프 분석 |
| `omc-test-engineer` | 테스트 엔지니어 | TDD 워크플로우 및 테스트 전략 |
| `omc-security-reviewer` | 보안 리뷰어 | 취약점 및 신뢰 경계 분석 |

## 워크플로우 패턴

### Autopilot
```
"autopilot: 사용자 인증 REST API 만들어줘"
```
AI 실행 흐름: 요구사항 확장 → 계획 → 구현 → QA → 자체 리뷰

### Plan-Execute (기본값)
```
"rate limiting 미들웨어를 계획하고 구현해줘"
```
AI가 계획을 만들고, 승인을 기다린 후 실행합니다.

### TDD
```
"tdd: 회원가입 폼에 입력 유효성 검사 추가해줘"
```
AI가 RED → GREEN → REFACTOR 사이클을 엄격히 따릅니다.

### Ralph Loop
```
"ralph: 모든 테스트가 통과할 때까지 계속해"
```
AI가 PRD → 구현 → 검증을 완료될 때까지 반복합니다.

## CLI 명령어

```bash
oh-my-cursor install          # 모든 규칙 설치 + .cursorrules 업데이트
oh-my-cursor install --dry-run # 적용 없이 미리보기
oh-my-cursor add executor      # 단일 규칙 추가
oh-my-cursor add workflows/tdd # 카테고리/이름으로 추가
oh-my-cursor remove executor   # 규칙 제거
oh-my-cursor list              # 설치 상태 확인
oh-my-cursor list --available  # 사용 가능한 모든 규칙 표시
oh-my-cursor doctor            # 설치 진단
```

## 작동 방식

### 규칙 유형

Cursor Rules는 세 가지 유형이 있습니다:

| 유형 | 동작 | oh-my-cursor 사용 |
|------|------|-----------------|
| **Always** | 모든 대화에 주입 | `omc-orchestrator`, `omc-security` |
| **Auto Attached** | 매칭 파일 열릴 때 주입 | `omc-coding-style`, `omc-testing` |
| **Agent Requested** | AI가 필요시 가져옴 | 에이전트 역할, 워크플로우 패턴 |

### 마커 기반 병합

`oh-my-cursor install`은 마커를 사용하여 `.cursorrules`에 OMC 섹션을 주입합니다:

```
<!-- OMC-CURSOR:START -->
<!-- OMC-CURSOR:VERSION:0.1.0 -->
[oh-my-cursor 오케스트레이션 내용]
<!-- OMC-CURSOR:END -->

[기존 내용은 여기에 보존됩니다]
```

### 상태 관리

oh-my-cursor는 `.omc-cursor/`에 파일 기반 상태를 저장합니다 (gitignore됨):

```
.omc-cursor/
  plans/       ← Planner 역할이 생성한 구현 계획
  notepad.md   ← 세션 노트 (컨텍스트 압축에서 유지)
  spec.md      ← Autopilot 워크플로우의 요구사항
  state.json   ← 워크플로우 상태
  backups/     ← 수정된 파일의 백업
```

## 설치되는 파일

`oh-my-cursor install` 실행 후 프로젝트 구조:

```
.cursor/
  rules/
    omc-orchestrator.mdc       ← 항상 적용
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
    omc-security.mdc           ← 항상 적용
    omc-git-workflow.mdc
    omc-performance.mdc
.cursorrules                   ← OMC 섹션으로 업데이트됨
.omc-cursor/                   ← 상태 (gitignore됨)
```

## 요구사항

- [Cursor IDE](https://cursor.sh)
- `curl` 또는 `make` (Shell/Makefile 설치 시)
- Node.js >= 20.0.0 (npm CLI 설치 시에만 필요)

## 크레딧

[oh-my-claudecode](https://github.com/Yeachan-Heo/oh-my-claudecode) (Yeachan Heo) — Claude Code CLI를 위한 멀티 에이전트 오케스트레이션에서 영감을 받았습니다.

## 라이선스

MIT © 2025 dasomel
