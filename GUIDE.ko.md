# oh-my-cursor 사용자 가이드

[English](./GUIDE.md) | **한국어**

이 가이드는 oh-my-cursor를 실제 예시와 함께 설명합니다. 외울 필요 없이, 자연어로 말하면 AI가 알아서 적절한 역할과 워크플로우를 활성화합니다.

---

## 목차

1. [작동 방식](#작동-방식)
2. [기본 사용법 — 에이전트 역할](#기본-사용법--에이전트-역할)
3. [워크플로우 패턴](#워크플로우-패턴)
4. [상태 관리](#상태-관리)
5. [상태 표시](#상태-표시)
6. [고급 기능](#고급-기능)
7. [자주 묻는 질문](#자주-묻는-질문)

---

## 작동 방식

oh-my-cursor는 Cursor AI에게 **상황에 맞는 전문 역할을 전환**하도록 가르칩니다. 하나의 대화에서 여러 전문가를 쓰는 것과 같습니다.

```
사용자: "이 로그인 버그 고쳐줘"
AI: [🐛 Debugger]
    Debugger 역할로 전환합니다.
    근본 원인을 추적하겠습니다...

사용자: "유닛 테스트도 추가해줘"
AI: [🧪 Test Engineer]
    Test Engineer 역할로 전환합니다.
    TDD 워크플로우를 시작합니다...
```

### 핵심 개념: 서브 에이전트가 아니라 역할 전환

Claude Code는 별도의 에이전트를 생성하지만, Cursor는 하나의 대화 안에서 작동합니다. oh-my-cursor는 AI가 **전문화된 행동을 채택**하도록 역할을 전환합니다 — 각 역할마다 고유한 규칙, 우선순위, 출력 형식이 있습니다.

---

## 기본 사용법 — 에이전트 역할

### 그냥 자연어로 말하세요

특별한 명령어가 필요 없습니다. 원하는 것을 설명하면 됩니다:

| 사용자 요청 | 활성화 역할 | 동작 |
|-----------|-----------|------|
| "auth.ts의 TypeError 고쳐줘" | 🐛 Debugger | 근본 원인 분석 후 수정 |
| "결제 API 구현해줘" | 🟢 Executor | 최소 변경으로 집중 구현 |
| "이 코드 리뷰해줘" | 🔍 Reviewer | 심각도별 코드 품질 리뷰 |
| "이 아키텍처 맞아?" | 🏗️ Architect | 읽기 전용 설계 분석 |
| "유저 서비스 테스트 추가해줘" | 🧪 Test Engineer | TDD: RED → GREEN → REFACTOR |
| "보안 이슈 있는지 확인해줘" | 🔒 Security Reviewer | OWASP Top 10 스캔 |
| "인증 로직 어디 있어?" | 🧭 Explorer | 코드베이스 탐색, 파일 매핑 |
| "요구사항이 뭐가 되어야 해?" | 📊 Analyst | 수락 기준 정의 |
| "이 기능 완성됐어?" | ✅ Verifier | 증거 기반 완료 확인 |
| "머지 후 빌드 에러 나" | 🔧 Build Fixer | 최소 diff 컴파일 수정 |
| "이 함수 간단하게 해줘" | ✂️ Code Simplifier | 복잡도 감소, 데드 코드 제거 |
| "이 계획 비평해줘" | 🎭 Critic | 건설적 비판 |
| "가혹하게 — 다 찢어봐" | 💀 Harsh Critic | 구조적 갭 분석, 강한 거부 |

### 예시: 버그 수정 흐름

```
사용자: "마지막 배포 후 로그인이 안 돼"

AI: [🐛 Debugger]
    Debugger 역할로 전환합니다.

    1. 인증 미들웨어 확인... 원인 발견.
    2. 근본 원인: 커밋 abc123에서 세션 토큰 검증이 바뀌었지만
       쿠키 포맷이 업데이트되지 않았습니다.

    Executor 역할로 전환합니다.

AI: [🟢 Executor]
    수정 적용:
    - 수정 파일: src/auth/session.ts (42번째 줄)
    - 변경 사항: 새 토큰 포맷을 처리하도록 쿠키 파서 수정

    테스트 실행... ✅ 23/23 통과
    빌드 실행... ✅ 성공
```

---

## 워크플로우 패턴

워크플로우는 키워드나 작업 복잡도에 의해 활성화되는 **다중 역할 시퀀스**입니다.

### 1. Plan-Execute (복잡한 작업의 기본값)

**트리거:** 3단계 이상의 작업, 또는 "이거 계획해줘"

```
사용자: "이메일과 푸시 지원하는 알림 시스템 추가해줘"

AI: [📋 Planner]
    여러 단계가 필요합니다. 계획을 작성합니다...

    ## 구현 계획
    1. 알림 인터페이스와 타입 정의
    2. 이메일 프로바이더 어댑터 구현
    3. 푸시 알림 어댑터 구현
    4. 라우팅 로직이 있는 알림 서비스 생성
    5. API 엔드포인트 추가
    6. 테스트 작성

    저장 위치: .omc-cursor/plans/notification-system.md

    이 계획으로 진행할까요? (yes/no)

사용자: "yes"

AI: [🟢 Executor | plan-execute:step-1/6]
    1단계: 알림 인터페이스 정의 중...
    ...
AI: [🟢 Executor | plan-execute:step-2/6]
    2단계: 이메일 어댑터 구현 중...
    ...
```

### 2. Autopilot (완전 자동)

**트리거:** "autopilot", "만들어줘", "전부 자동으로"

AI가 처음부터 끝까지 모든 것을 처리합니다: 요구사항 → 계획 → 구현 → QA → 리뷰

```
사용자: "autopilot: 사용자 인증 REST API 만들어줘"

AI: [📊 Analyst | autopilot:phase-0]
    Phase 0: 요구사항 확장 중...
    - 이메일/비밀번호로 사용자 등록
    - JWT 토큰으로 로그인
    - 비밀번호 재설정 흐름
    - 속도 제한
    저장: .omc-cursor/spec.md

AI: [📋 Planner | autopilot:phase-1]
    Phase 1: 구현 계획 작성 중...
    (8단계 식별)

AI: [🟢 Executor | autopilot:phase-2]
    Phase 2: 구현 중...
    (파일 생성, 코드 작성)

AI: [🧪 QA Tester | autopilot:phase-3]
    Phase 3: QA 루프...
    테스트 실행... 2개 실패 발견
    수정... 재시도... ✅ 전체 통과

AI: [🔍 Reviewer | autopilot:phase-4]
    Phase 4: 자체 리뷰...
    치명적 이슈 없음. 보안 리뷰 통과.
```

### 3. TDD (테스트 주도 개발)

**트리거:** "tdd", "테스트 먼저", "red green"

```
사용자: "tdd: 회원가입 폼에 입력 유효성 검사 추가해줘"

AI: [🧪 Test Engineer | tdd:red]
    RED: 실패하는 테스트 먼저 작성...

    test("@ 없는 이메일 거부", () => {
      expect(validateEmail("invalid")).toBe(false);
    });

    테스트 실행... ❌ FAIL (함수가 아직 없음)

AI: [🟢 Executor | tdd:green]
    GREEN: 통과를 위한 최소 구현...

    function validateEmail(email: string): boolean {
      return email.includes("@");
    }

    테스트 실행... ✅ PASS

AI: [✂️ Code Simplifier | tdd:refactor]
    REFACTOR: 테스트 깨지지 않게 개선...

    function validateEmail(email: string): boolean {
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    테스트 실행... ✅ PASS
```

### 4. Ralph (지속 루프)

**트리거:** "ralph", "멈추지 마", "끝날 때까지 계속해"

PRD로 작업을 추적하고 모든 스토리가 통과할 때까지 반복합니다.

```
사용자: "ralph: 결제 흐름 전체 구현해줘"

AI: [📋 Planner | ralph:prd]
    PRD 생성 중...
    S1: 장바구니 요약 컴포넌트
    S2: 배송 주소 폼
    S3: 결제 연동
    S4: 주문 확인
    S5: 이메일 영수증
    저장: .omc-cursor/prd.json

AI: [🟢 Executor | ralph:S1]
    S1 구현 중: 장바구니 요약...

AI: [✅ Verifier | ralph:verify]
    S1 검증... ✅ 모든 기준 충족

    Ralph 진행: [==--------] 1/5 스토리
      S1: 통과  S2: 다음  S3: 대기  S4: 대기  S5: 대기

    ...모든 스토리가 통과할 때까지 계속...

AI: [🏗️ Architect | ralph:signoff]
    최종 승인: 5개 스토리 모두 통과. 통합 이슈 없음.
```

### 5. Ralplan (합의 계획)

**트리거:** "ralplan", "합의 계획"

여러 관점이 합의에 도달할 때까지 계획을 다듬습니다:

```
사용자: "ralplan: 마이크로서비스 새 API 설계해줘"

AI: [📋 Planner | ralplan:round-1]
    라운드 1 — 플래너 제안:
    - 버전 관리가 있는 REST API
    - JWT 인증, 속도 제한
    - Prisma ORM과 PostgreSQL

AI: [🏗️ Architect | ralplan:round-1]
    아키텍트 평가:
    - ✅ REST + 버전 관리 적절
    - ⚠️ 모바일 클라이언트를 위해 GraphQL 고려
    - ⚠️ 복잡한 쿼리에서 Prisma가 느릴 수 있음

AI: [🎭 Critic | ralplan:round-1]
    비평가 도전:
    - 서비스 간 통신에 gRPC는 왜 안 쓰나?
    - 속도 제한에 테넌트별 전략 필요
    - 누락: 하위 서비스를 위한 서킷 브레이커

AI: [📋 Planner | ralplan:round-2]
    라운드 2 — 수정된 계획:
    - 공개 API는 REST, 내부는 gRPC
    - Redis 기반 테넌트별 속도 제한
    - 지수 백오프가 있는 서킷 브레이커

    ✅ 2라운드 만에 합의 도달.
```

### 6. Swarm (마이크로태스크 분해)

**트리거:** "swarm", "분해해줘", "나눠서 해줘"

```
사용자: "swarm: 8개 API 엔드포인트 전부에 에러 처리 추가해줘"

AI: [📋 Planner | swarm:decompose]
    8개 마이크로태스크로 분해:

    T1: GET /users 에러 처리 추가
    T2: POST /users 에러 처리 추가
    T3: GET /users/:id 에러 처리 추가
    T4: PUT /users/:id 에러 처리 추가
    T5: DELETE /users/:id 에러 처리 추가
    T6: POST /auth/login 에러 처리 추가
    T7: POST /auth/refresh 에러 처리 추가
    T8: POST /auth/logout 에러 처리 추가

AI: [🟢 Executor | swarm:T1]
    T1: GET /users — 완료 ✅

    ...순차적으로 실행...

    Swarm 진행: [==========] 8/8 태스크
    전체 완료. 검증 실행 중...
```

### 7. Deep Interview (심층 인터뷰)

**트리거:** "deep interview", "코딩 전에 이해하기"

```
사용자: "deep interview: 인증 시스템 리팩토링하고 싶어"

AI: [📊 Analyst | deep-interview]
    시작하기 전에 요구사항을 이해하겠습니다:

    1. 현재 인증에서 어떤 문제가 있나요?
    2. 어떤 인증 방식을 지원하나요 (비밀번호, OAuth, SSO)?
    3. 성능 문제인가요 보안 우려인가요?
    4. 예상 사용자 규모는? (100? 10K? 100만?)

사용자: "OAuth가 깨져있고, 기업용 SSO 필요하고, 10만 사용자 규모"

AI: [📊 Analyst | deep-interview]
    추가 질문:
    5. 어떤 SSO 프로바이더? (Okta, Azure AD, Google Workspace)
    6. 기존 세션과 하위 호환성 필요한가요?
    7. 데드라인이 있나요, 점진적 마이그레이션 가능한가요?

    ...여러 라운드 후...

    요구사항 스펙 생성: .omc-cursor/spec.md
    추천 워크플로우: Security Reviewer와 함께하는 Plan-Execute
```

### 8. UltraQA (QA 루프)

**트리거:** "ultraqa", "qa loop", "버그 없을 때까지 테스트해"

```
사용자: "ultraqa: 결제 흐름에 버그가 하나도 없게 해줘"

AI: [🧪 QA Tester | ultraqa:cycle-1]
    사이클 1: 전체 결제 테스트 실행...
    ❌ 3개 실패 발견

AI: [🐛 Debugger | ultraqa:cycle-1]
    실패 진단:
    - 테스트 7: 동시 결제 시 경쟁 조건
    - 테스트 12: 할인 코드의 null 체크 누락
    - 테스트 15: 영수증 날짜의 시간대 이슈

AI: [🟢 Executor | ultraqa:cycle-1]
    3개 이슈 수정 중...

AI: [✅ Verifier | ultraqa:cycle-1]
    수정 검증... 테스트 7 ✅, 테스트 12 ✅, 테스트 15 ✅
    새 테스트: ❌ 1개 리그레션 발견

AI: [🐛 Debugger | ultraqa:cycle-2]
    사이클 2: 리그레션 진단 중...
    ...전부 통과할 때까지 계속 (최대 5사이클)...
```

### 9. Slop Cleaner (AI 코드 정리)

**트리거:** "deslop", "AI 코드 정리해줘"

```
사용자: "deslop: AI가 생성한 유저 서비스 정리해줘"

AI: [🧪 Test Engineer | deslop:baseline]
    테스트 기준선 실행... 15/15 통과

AI: [✂️ Code Simplifier | deslop:identify]
    발견된 슬롭 패턴:
    - 불필요한 주석 23개 ("// 사용자 이름 설정")
    - 빈 에러 핸들러 5개
    - 미사용 임포트 3개
    - 과도한 유틸 함수 2개
    - 데드 코드 블록 1개

AI: [🟢 Executor | deslop:delete]
    적극적으로 삭제 중...
    - 47줄의 슬롭 제거
    - 2개의 불필요한 추상화 인라인

    테스트 실행... 15/15 여전히 통과 ✅
    동작 보존. 코드가 깨끗해졌습니다.
```

### 10. Learner (학습)

**트리거:** "이거 기억해", "패턴 저장해", "learn this"

```
사용자: "이거 기억해: 우리 프로젝트에서는 API 유효성 검사에 항상 zod 써"

AI: [📝 Learner]
    학습된 패턴:
    - 패턴: 모든 API 입력 유효성 검사에 zod 스키마 사용
    - 저장 위치: .cursor/rules/project-api-validation.mdc
    - 적용 범위: **/*.ts API 파일 편집 시 자동 첨부
    - 충돌: 없음

    이 규칙은 관련 파일이 열릴 때 자동으로 적용됩니다.
```

### 11. Release (릴리스)

**트리거:** "release", "버전 업데이트", "변경 로그"

```
사용자: "release: 새 버전 만들어줘"

AI: [🧭 Explorer | release:analyze]
    v0.1.0 이후 커밋:
    - feat 커밋 5개
    - fix 커밋 2개
    - docs 커밋 3개
    추천 범프: minor (0.1.0 → 0.2.0)

AI: [✏️ Writer | release:changelog]
    CHANGELOG.md 업데이트:
    ## [0.2.0] - 2025-03-10
    ### 추가
    - 마이크로태스크 분해를 위한 Swarm 워크플로우
    - 리팩토링 패턴 관행 규칙
    ...

AI: [🟢 Executor | release:version]
    package.json 버전 업데이트
    빌드 통과 ✅

AI: [🌿 Git Master | release:tag]
    커밋 및 태그 준비 완료:
    - 커밋: "chore: release v0.2.0"
    - 태그: v0.2.0

    리모트에 푸시할까요? (승인 대기)
```

---

## 상태 관리

oh-my-cursor는 긴 대화에서 중요한 상태를 파일로 저장합니다:

```
.omc-cursor/
  plans/           ← 구현 계획
  notepad.md       ← 핵심 컨텍스트 (압축에서 유지)
  prd.json         ← Ralph 스토리 추적
  spec.md          ← Autopilot 요구사항
  handoffs/        ← 역할 전환 문서
  research/        ← 리서치 노트
  backups/         ← 수정 전 파일 백업
```

### 컨텍스트 보존 예시

```
사용자: (긴 대화 후, 컨텍스트가 압축됨)

AI: [🎯 Orchestrator]
    컨텍스트가 압축되었습니다. 노트패드를 읽습니다...

    .omc-cursor/notepad.md에서 복원된 컨텍스트:
    - 목표: 결제 흐름 구현
    - 현재 단계: 3/6 (결제 연동)
    - 결정 사항: Stripe API 사용, 웹훅 기반 확인
    - 수정된 파일: src/checkout/cart.ts, src/checkout/shipping.ts

    3단계부터 이어갑니다...
```

---

## 상태 표시

모든 응답은 현재 역할과 워크플로우를 보여주는 상태 배지로 시작합니다:

```
[🎯 Orchestrator]                     — 활성 워크플로우 없음
[🟢 Executor | plan-execute:step-3/5] — 5단계 중 3단계 실행 중
[📋 Planner | autopilot:phase-1]      — Autopilot 계획 단계
[🐛 Debugger | ultraqa:cycle-2/5]     — QA 사이클 디버깅
[🔍 Reviewer | autopilot:phase-4]     — 자체 리뷰 단계
[✅ Verifier | ralph:verify]          — Ralph 검증
```

---

## 고급 기능

### Pre-Execution Gate (사전 실행 게이트)

AI가 요청을 실행하기 전에 자동으로 복잡도를 평가합니다:

```
사용자: "앱 좋게 만들어줘"

AI: [📋 Planner]
    요청이 모호합니다 — 구현 전에 계획을 세우겠습니다.
    어떤 측면을 개선할까요?
    - 성능?
    - UI/UX?
    - 코드 품질?
    - 테스트 커버리지?
```

```
사용자: "README.md 42번째 줄 오타 수정해"

AI: [🟢 Executor]
    (사소한 작업 — 계획 없이 바로 실행)
```

### Escalation Protocol (에스컬레이션 프로토콜)

```
AI: [🔧 Build Fixer | 시도 1]
    타입 에러 수정 시도...
    ❌ 여전히 실패

AI: [🔧 Build Fixer | 시도 2]
    다른 접근법...
    ❌ 여전히 실패

AI: [🟢 Executor | 에스컬레이션]
    더 넓은 컨텍스트를 가진 Executor로 에스컬레이션.
    이 문제는 구조적입니다 — 타입 수정이 아니라 리팩토링이 필요합니다.
```

### Handoff Protocol (핸드오프 프로토콜)

복잡한 작업 중 역할이 전환될 때, 핸드오프 문서가 컨텍스트를 보존합니다:

```
AI: [📋 Planner → 🟢 Executor]
    핸드오프 생성: .omc-cursor/handoffs/planner-to-executor.md

    컨텍스트: 인증 리팩토링을 위한 5단계 계획 설계
    핵심 결정: OAuth2 + PKCE 사용, 세션 쿠키 미사용
    미해결 질문: Redis 세션 저장소 vs JWT 전용
    다음 단계: OAuth2 프로바이더 어댑터 구현
```

---

## 자주 묻는 질문

### Q: 특정 명령어를 써야 하나요?
**아닙니다.** 원하는 것을 자연어로 설명하면 됩니다. AI가 자동으로 적절한 역할을 감지합니다. "autopilot", "tdd", "ralph" 같은 키워드는 단축어일 뿐, 필수가 아닙니다.

### Q: AI가 잘못된 역할을 선택하면?
직접 말하세요: "Debugger 역할로 전환해" 또는 "구현이 아니라 코드 리뷰가 필요해."

### Q: 모든 Cursor 모델에서 작동하나요?
네. 규칙은 Cursor가 지원하는 모든 모델에서 작동합니다. 더 뛰어난 모델이 패턴을 더 일관성 있게 따릅니다.

### Q: 규칙을 커스터마이즈할 수 있나요?
물론입니다. `.cursor/rules/`의 아무 `.mdc` 파일이나 수정하세요:
- `alwaysApply: true`로 변경하면 규칙이 항상 활성화
- `globs`를 수정하면 규칙이 자동 첨부되는 시점 제어
- 지시사항을 팀 컨벤션에 맞게 수정

### Q: AI 속도가 느려지나요?
`alwaysApply` 규칙(orchestrator + security)은 최소한의 오버헤드만 추가합니다. 나머지 규칙은 AI가 필요할 때만 온디맨드로 로드합니다.

### Q: 삭제는 어떻게 하나요?
```bash
rm -rf .cursor/rules/omc-*.mdc
# .cursorrules에서 OMC 섹션 제거 (OMC-CURSOR:START와 END 마커 사이)
rm -rf .omc-cursor/
```
