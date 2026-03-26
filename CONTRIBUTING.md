# 🤝 K-FreeLang 기여 가이드

**한국형 독립 프로그래밍 언어 개발에 참여하세요.**

---

## 🎯 프로젝트 목표

K-FreeLang은 다음을 목표로 합니다:
- **기술적 독립**: TypeScript/Node.js 의존성 완전 제거
- **보안 독립**: K-암호화 (ARIA/SEED), 규제 검증 (PIPA, ISMS) 내재화
- **표준 독립**: 한글 문법 v1.0, K-StdLib (한국형 표준 라이브러리)
- **운영 독립**: GitHub + Gogs 자관, 오픈소스 커뮤니티 주도

---

## 👥 4팀 구조 & 담당 영역

### 🔴 Team A: Compiler (부트스트랩 완성)
**목표**: FreeLang v2 자가 호스팅 100% (현재 69%)

**작업**:
- P1~P5 부트스트랩 블로커 해결
- 자가 컴파일 파이프라인 구현
- ISA bytecode → native code 생성

**담당자**: (Team Lead 명시)
**저장소**: `feature/bootstrap-fix` 브랜치

**검증 방법**:
```bash
npm run test-bootstrap
# 목표: 42/61 → 61/61 통과
```

---

### 🟡 Team B: K-StdLib (한국형 표준 라이브러리)
**목표**: 4개 핵심 모듈 (crypto, compliance, proof, stdlibs) 완성

**작업 단계**:
1. **Phase 1** (1-2일): 즉시 이식 (math, array, string, object, json, io, date, proof)
2. **Phase 2** (3-5일): 골격 기반 구현 (OTP, 보안 헤더, 감사 로그)
3. **Phase 3** (1-2주): 신규 설계 (ARIA/SEED, 주민등록번호, PIPA 마스킹)

**담당자**: (Team Lead 명시)
**저장소**: `feature/kstdlib` 브랜치

**구조**:
```
src/kstdlib/
├── stdlibs/          # 기본 라이브러리 (math, array, string, ...)
├── crypto/           # 암호화 (ARIA, SEED, OTP)
├── compliance/       # 규제 검증 (PIPA, ISMS, 주민번호)
├── proof/            # 증명 아키텍처
└── index.free        # 통합 인터페이스
```

---

### 🟢 Team C: Korean Syntax (한글 문법)
**목표**: 한글 문법 v1.0 설계 & 구현

**작업**:
- **P0** (Week 1): 8개 핵심 키워드 (변수, 반환, 만약, 함수, 반복, 아니면, 타입, 상수)
- **P1** (Week 2-3): 12개 추가 키워드 (사용, 패턴, 오류처리 등)
- **P2** (Week 4+): 15개 고급 키워드 (비동기, 메모리관리, 매크로 등)

**담당자**: (Team Lead 명시)
**저장소**: `feature/korean-syntax` 브랜치

**검증**:
```bash
npm run test-korean-syntax
# hello-korean.free 컴파일 및 실행
```

---

### 🔵 Team D: Infrastructure & Docs
**목표**: CI/CD, 문서, 커뮤니티 기반 구축

**작업**:
1. **CI/CD** (.github/workflows/)
   - build.yml: 컴파일 & 테스트
   - bootstrap-validation.yml: 부트스트랩 상태 추적

2. **문서**
   - KOREAN_SYNTAX_v1.0.md
   - K-STDLIB.md
   - ARCHITECTURE.md
   - 튜토리얼 (hello-korean, 기본 문법, K-StdLib 사용법)

3. **커뮤니티**
   - ISSUES 템플릿
   - PR 템플릿
   - 교육 자료

**담당자**: (Team Lead 명시)
**저장소**: `feature/docs` 브랜치

---

## 🔀 Git Workflow (Gitflow 변형)

### 브랜치 구조
```
main (릴리즈만) ← develop (통합) ← feature/* (팀별 작업)
     ↓                         ↓
 v0.1.0 태그            feature/bootstrap-fix
                         feature/kstdlib
                         feature/korean-syntax
                         feature/docs
```

### 브랜치 생성
```bash
# 1. develop 브랜치에서 최신 코드 받기
git fetch origin
git checkout develop
git pull origin develop

# 2. feature 브랜치 생성 (팀별)
git checkout -b feature/bootstrap-fix        # Team A
git checkout -b feature/kstdlib              # Team B
git checkout -b feature/korean-syntax        # Team C
git checkout -b feature/docs                 # Team D
```

### 커밋 메시지 규칙
```
<타입>: <요약>

<상세 설명>

Fixes #<이슈번호>
Related-To: Team <A|B|C|D>
```

**타입**:
- `feat`: 새 기능
- `fix`: 버그 수정
- `refactor`: 코드 재구성
- `docs`: 문서화
- `test`: 테스트 추가
- `chore`: 빌드, 의존성 등

**예제**:
```
feat: P1 블로커 해결 - Anonymous Struct Literal 지원

- parser.ts nud() 함수에서 LBRACE 핸들러 강화
- Struct constructor vs literal 구분 로직 추가
- test_struct_field_access.fl 통과 확인

Fixes #8
Related-To: Team A
```

---

## ✅ PR (Pull Request) 프로세스

### 1️⃣ PR 생성 (develop으로)
```bash
git push origin feature/your-team-branch
# GitHub에서 PR 생성 (또는 gh cli 사용)
```

### 2️⃣ PR 템플릿 (자동 생성)
```markdown
## 📋 변경 사항
- [ ] 기능 추가 / 버그 수정 / 문서 업데이트

## 🎯 관련 이슈
Fixes #8, Fixes #9

## ✅ 검증 체크리스트
- [ ] npm test 통과
- [ ] npm run build 성공
- [ ] bootstrap validation 상태 확인 (42/61 → ?)
- [ ] 코드 리뷰 1명 이상 승인

## 🔗 관련 팀
@Team-A @Team-B @Team-C @Team-D

## 📸 스크린샷 (있으면)
(변경 사항 시각 자료)
```

### 3️⃣ CI/CD 자동 검증
- GitHub Actions 자동 실행 (build.yml)
- Bootstrap 상태 자동 보고 (bootstrap-validation.yml)
- PR 코멘트로 실시간 피드백

### 4️⃣ Merge (develop → main)
- **develop**: PR 승인 후 자동 merge
- **main**: develop이 안정적일 때만 수동 merge (주 1회 또는 마일스톤 완성 시)

---

## 🚀 개발 환경 설정

### 필수 도구
- Node.js 18.x 이상
- npm 9.x 이상
- Git

### 로컬 개발 시작
```bash
# 1. 저장소 클론 (Gogs)
git clone https://gogs.dclub.kr/kim/freelang-korean-independent.git
cd freelang-korean-independent

# 2. 의존성 설치
npm install

# 3. 개발 환경 시작
npm run dev

# 4. 테스트 실행
npm test

# 5. 부트스트랩 검증 (Team A)
npm run test-bootstrap
```

### 주요 npm 스크립트
| 스크립트 | 목적 |
|---------|------|
| `npm run build` | TypeScript 컴파일 |
| `npm test` | Jest 테스트 |
| `npm run test-bootstrap` | 부트스트랩 42/61 검증 |
| `npm run test-korean-syntax` | 한글 문법 검증 |
| `npm run dev` | 개발 모드 시작 |

---

## 📚 문서 규칙

### 마크다운 포맷
- 제목: H1~H3 사용 (#, ##, ###)
- 코드 블록: 언어명 명시 (```freelang, ```typescript)
- 테이블: GitHub 마크다운 테이블
- 리스트: - (bullet) 또는 1. (numbered)

### 문서 위치
```
docs/
├── specifications/
│   ├── KOREAN_SYNTAX_v1.0.md      (Team C)
│   ├── K-STDLIB.md                 (Team B)
│   └── K-FREELANG_SPEC.md
├── architecture/
│   ├── ARCHITECTURE.md             (Team D)
│   ├── BOOTSTRAP_PLAN.md           (Team A)
│   └── COMPILER_PHASES.md          (Team A)
├── tutorials/
│   ├── 01_hello_korean.md          (Team C)
│   ├── 02_basic_syntax.md          (Team C)
│   └── 03_kstdlib_usage.md         (Team B)
└── guides/
    ├── CONTRIBUTING.md (이 파일)
    └── BRANCHING_STRATEGY.md       (Team D)
```

---

## 🐛 이슈 보고

### 이슈 템플릿
```markdown
## 🐛 버그 설명
(명확하고 간결하게)

## 🔍 재현 방법
1. ...
2. ...

## ❌ 현재 동작
(실제 결과)

## ✅ 예상 동작
(기대 결과)

## 📋 추가 정보
- OS: ...
- Node.js 버전: ...
- 관련 팀: Team A/B/C/D
```

### 이슈 라벨
- `bug`: 버그
- `feature`: 새 기능
- `documentation`: 문서화
- `Team-A`, `Team-B`, `Team-C`, `Team-D`: 팀 할당
- `P0`, `P1`, `P2`, `P3`: 우선순위

---

## 📅 주간 미팅 (제안)

### 목표
- 각 팀 진행 상황 공유
- 블로커 해결
- 다음 주 목표 설정

### 일정 (제안)
- **매주 월요일 10:00**: 주간 계획 (30분)
- **매주 금요일 16:00**: 주간 정리 (30분)
- **필요 시**: 팀별 동기화 (15분 스탠드업)

---

## ✨ 코딩 스타일

### TypeScript (v2 소스)
```typescript
// 함수
function parseExpression(tokens: Token[]): Expr {
  // 구현
}

// 변수
const KEYWORDS = { let: TokenType.LET };
```

### FreeLang (K-FreeLang 타겟)
```freelang
// 함수
함수 parseExpression(tokens: array) -> Expr {
  // 구현
}

// 상수
상수 KEYWORDS = { "변수": TokenType.LET }
```

### 일반 규칙
- 함수명: camelCase (TypeScript) / kebab-case (FreeLang)
- 상수명: UPPER_SNAKE_CASE
- 들여쓰기: 2 spaces
- 최대 줄 길이: 120자

---

## 🤝 코드 리뷰 체크리스트

### 검토자 (Reviewer)
- [ ] 코드 로직 정확성
- [ ] 테스트 커버리지 (80% 이상)
- [ ] 문서 업데이트 여부
- [ ] 커밋 메시지 품질
- [ ] 팀 간 충돌 확인

### 저자 (Author)
- [ ] 모든 테스트 통과
- [ ] npm run build 성공
- [ ] 셀프 리뷰 완료
- [ ] 관련 이슈 링크

---

## 🎓 학습 자료

- **FreeLang 공식 명세**: [LANGUAGE_INDEPENDENT_SPEC.md](../freelang-v4-spec/LANGUAGE_INDEPENDENT_SPEC.md)
- **v2 소스**: [_v2-source/](../_v2-source/)
- **한글 문법**: [KOREAN_SYNTAX_v1.0.md](./docs/specifications/KOREAN_SYNTAX_v1.0.md) (구성 중)

---

## 📞 연락처

- **Gogs**: https://gogs.dclub.kr/kim/freelang-korean-independent
- **GitHub**: https://github.com/kimjindol2025/freelang-korean
- **이슈 추적**: GitHub Issues

---

**Happy Coding! 🚀**

한국형 독립 프로그래밍 언어 개발에 참여해주셔서 감사합니다.

**Created**: 2026-03-26
**Version**: v1.0
**Last Updated**: 2026-03-26
