# oh-my-cursor

[English](./README.md) | **한국어**

[Cursor IDE](https://cursor.sh)를 위한 멀티 에이전트 오케스트레이션. [oh-my-claudecode](https://github.com/Yeachan-Heo/oh-my-claudecode)에서 영감을 받았습니다.

Cursor에는 Claude Code의 `Task` 서브 에이전트 스포닝 기능이 없습니다. oh-my-cursor는 Cursor Rules(`.mdc` 파일) 라이브러리와 CLI 설치 도구를 통해 동일한 멀티 에이전트 *패턴*을 Cursor에 제공합니다.

## 특징

- **42개의 Cursor Rules** — 에이전트 역할, 워크플로우 패턴, 코딩 관행
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

### 방법 3: npm (coming soon)

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
| `omc-explore` | 탐색자 | 코드베이스 탐색 및 파일/심볼 매핑 |
| `omc-analyst` | 분석가 | 요구사항 분석 및 수락 기준 정의 |
| `omc-verifier` | 검증자 | 완료 증거 수집 및 주장 검증 |
| `omc-designer` | 디자이너 | UI/UX 아키텍처 및 인터랙션 설계 |
| `omc-writer` | 작성자 | 문서, README, API 문서 작성 |
| `omc-git-master` | Git 마스터 | Git 운영 및 브랜치 관리 |
| `omc-code-simplifier` | 코드 단순화 | 코드 명확성 향상 및 데드 코드 제거 |
| `omc-critic` | 비평가 | 계획/설계 비판적 검토 |
| `omc-scientist` | 과학자 | 데이터 분석 및 벤치마킹 |
| `omc-qa-tester` | QA 테스터 | 런타임 검증 및 엣지 케이스 테스트 |
| `omc-document-specialist` | 문서 전문가 | 외부 문서 참조 및 조회 |
| `omc-build-fixer` | 빌드 수정 | 컴파일, 타입, 린트 에러 해결 |
| `omc-deep-executor` | 딥 실행자 | 복잡한 자율 목표 지향 구현 |
| `omc-harsh-critic` | 엄격 비평가 | 강한 거부 기준의 구조적 갭 분석 |
| `omc-quality-reviewer` | 품질 리뷰어 | SOLID 원칙, 안티패턴, 로직 분석 |

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

### Ralplan
```
"ralplan: 새 API에 대한 합의 계획"
```
반복적 계획: 플래너 → 아키텍트 → 비평가 → 합의 (최대 3라운드).

### UltraQA
```
"ultraqa: 모든 게 통과할 때까지 계속 테스트해"
```
QA 순환: 테스트 → 진단 → 수정 → 검증 → 반복 (최대 5사이클).

### Deep Interview
```
"deep interview: 코딩 전에 이해하기"
```
소크라틱 질문으로 구현 전 요구사항을 명확히 합니다.

### Slop Cleaner
```
"deslop: AI 생성 코드 정리"
```
테스트 우선, 삭제 우선으로 AI 생성 코드의 불필요한 부분을 제거합니다.

### Ralph Loop
```
"ralph: 모든 테스트가 통과할 때까지 계속해"
```
PRD 기반 지속 루프: 스토리 생성 → 구현 → 검증 → 완료까지 반복.

### Learner
```
"learn this: 이 프로젝트에서는 항상 named export 사용"
```
세션에서 재사용 가능한 패턴을 추출하여 `.mdc` 규칙 파일로 저장.

### Release
```
"release: 버전 업데이트하고 변경 로그 만들어줘"
```
자동 릴리스: 커밋 분석 → 버전 범프 → 변경 로그 → 태그.

## CLI 명령어

```bash
oh-my-cursor install          # 모든 규칙 설치 + .cursorrules 업데이트
oh-my-cursor install --dry-run # 적용 없이 미리보기
oh-my-cursor add executor      # 단일 규칙 추가
oh-my-cursor add workflows/tdd # 카테고리/이름으로 추가
oh-my-cursor remove executor   # 규칙 제거
oh-my-cursor list              # 설치 상태 확인
oh-my-cursor list --available  # 사용 가능한 모든 규칙 표시
oh-my-cursor update            # 변경된 규칙만 업데이트
oh-my-cursor update --force    # 모든 규칙 강제 업데이트
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
  prd.json     ← Ralph 워크플로우의 PRD
  spec.md      ← Autopilot 워크플로우의 요구사항
  handoffs/    ← 역할 전환 문서
  research/    ← 리서치 세션 노트
  backups/     ← 수정된 파일의 백업
```

## 설치되는 파일

`oh-my-cursor install` 실행 후 42개 규칙 파일이 설치됩니다:

```
.cursor/rules/
  # 글로벌 (항상 적용)
  omc-orchestrator.mdc
  # 에이전트 (22개 역할)
  omc-analyst.mdc              omc-harsh-critic.mdc
  omc-architect.mdc            omc-planner.mdc
  omc-build-fixer.mdc          omc-qa-tester.mdc
  omc-code-simplifier.mdc      omc-quality-reviewer.mdc
  omc-critic.mdc               omc-reviewer.mdc
  omc-debugger.mdc             omc-scientist.mdc
  omc-deep-executor.mdc        omc-security-reviewer.mdc
  omc-designer.mdc             omc-test-engineer.mdc
  omc-document-specialist.mdc  omc-verifier.mdc
  omc-executor.mdc             omc-writer.mdc
  omc-explore.mdc              omc-git-master.mdc
  # 워크플로우 (11개 패턴)
  omc-autopilot.mdc            omc-ralph.mdc
  omc-deep-interview.mdc       omc-ralplan.mdc
  omc-learner.mdc              omc-release.mdc
  omc-plan-execute.mdc         omc-slop-cleaner.mdc
  omc-swarm.mdc                omc-tdd.mdc
  omc-ultraqa.mdc
  # 관행 (8개 표준)
  omc-coding-style.mdc         omc-performance.mdc
  omc-design-patterns.mdc      omc-refactoring-patterns.mdc
  omc-git-workflow.mdc         omc-security.mdc (항상 적용)
  omc-karpathy-guidelines.mdc  omc-testing.mdc

.cursorrules                   ← OMC 섹션으로 업데이트됨
.omc-cursor/                   ← 상태 (gitignore됨)
```

## 요구사항

- [Cursor IDE](https://cursor.sh)
- `curl` 또는 `make` (Shell/Makefile 설치 시)
- Node.js >= 20.0.0 (npm CLI 설치 시에만 필요)

## 크레딧

- [oh-my-claudecode](https://github.com/Yeachan-Heo/oh-my-claudecode) (Yeachan Heo) — Claude Code CLI를 위한 멀티 에이전트 오케스트레이션
- [oh-my-cursor](https://github.com/tmcfarlane/oh-my-cursor) (tmcfarlane) — Cursor를 위한 Team Avatar 에이전트 오케스트레이션 (스웜 분해, 리팩토링 패턴, 디자인 패턴, 에스컬레이션 프로토콜)

## 라이선스

MIT © 2025 dasomel
