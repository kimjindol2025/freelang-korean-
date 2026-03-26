# 🌳 K-FreeLang Git 브랜치 전략

**Modified Gitflow for 4-Team Parallel Development**

---

## 📊 전체 구조도

```
                    main (production)
                      ↑
                   (merge from develop)
                      ↑
          ┌───────────────────────┐
          │                       │
     develop (integration)        v0.1.0 (tag)
          ↑
      (merge from feature/*)
          ↑
    ┌─────┼─────────────────────┐
    ↓     ↓         ↓            ↓
 Team A  Team B   Team C       Team D
 feature/bootstrap-fix
 feature/kstdlib
 feature/korean-syntax
 feature/docs
```

---

## 🎯 핵심 브랜치

### 🔵 **main** (Production)
**목적**: 안정적인 릴리즈 버전만 유지

**규칙**:
- 모든 merge는 **develop**에서만 수락
- Tag: v0.1.0, v0.2.0, ... (semantic versioning)
- Branch protection: 모든 커밋이 develop에서 검증되어야 함
- Force push: ❌ 금지

**작업 흐름**:
```bash
# develop이 안정적일 때만 merge
git checkout main
git pull origin develop
git merge develop
git tag v0.1.0
git push origin main --tags
```

---

### 🟡 **develop** (Integration)
**목적**: 4개 팀의 feature 브랜치를 통합, 주간 안정성 검증

**규칙**:
- 모든 PR은 **feature/*** 에서만 수락
- CI/CD 자동 검증 필수 (GitHub Actions)
- Bootstrap validation 자동 보고
- 모든 테스트 통과 후 merge
- 수동 코드 리뷰 1명 이상 필수

**작업 흐름**:
```bash
# 1. develop 기반 feature 브랜치 생성
git checkout develop
git pull origin develop
git checkout -b feature/your-task

# 2. 개발 완료 후 PR 생성
git push origin feature/your-task
# GitHub에서 PR 생성 → develop

# 3. 자동 CI/CD 실행
# → build.yml (Node 18, 20)
# → bootstrap-validation.yml (상태 보고)

# 4. 승인 후 자동 merge
# (develop에 merge 후 feature 브랜치 자동 삭제)
```

---

### 🟢 **feature/*** (팀별 작업)
**목적**: 각 팀이 독립적으로 작업하는 개발 브랜치

#### 🔴 feature/bootstrap-fix (Team A)
**작업**: 부트스트랩 P1~P5 블로커 해결 (69% → 100%)

```
feature/bootstrap-fix
  ├─ P1: Anonymous Struct Literal (1-2h)
  ├─ P2: Struct Constructor (2-3h)
  ├─ P3: If-Else Statement (1h)
  ├─ P4: For Loop Edge Cases (1h)
  └─ P5: Complex Issues (4-8h)
```

**검증**:
```bash
npm run test-bootstrap
# 목표: 42/61 → 61/61
```

**Merge 체크리스트**:
- [ ] 42/61 → 61/61 통과
- [ ] npm test 통과
- [ ] 새로운 테스트 추가됨
- [ ] 커밋 메시지 P1~P5 명확히 구분

---

#### 🟡 feature/kstdlib (Team B)
**작업**: K-StdLib Phase 1 (즉시 이식)

```
feature/kstdlib
  ├─ Phase 1 (1-2d): 8개 모듈 즉시 이식
  │   ├─ math.free
  │   ├─ string.free
  │   ├─ array.free
  │   ├─ object.free
  │   ├─ json.free
  │   ├─ date.free
  │   ├─ io.free
  │   └─ proof.free (cleanup)
  ├─ Phase 2 (3-5d): crypto + compliance
  └─ Phase 3 (1-2w): ARIA/SEED + Korean features
```

**구조**:
```
src/kstdlib/
├── stdlibs/
│   ├── math.free
│   ├── string.free
│   └── ...
├── crypto/
├── compliance/
├── proof/
└── index.free
```

**검증**:
```bash
npm run test-kstdlib
# Phase 1: 8개 모듈 모두 로드 가능
```

---

#### 🟢 feature/korean-syntax (Team C)
**작업**: 한글 문법 v1.0 (P0 8개 키워드)

```
feature/korean-syntax
  ├─ P0 (Week 1): 8개 핵심 키워드
  │   ├─ 변수, 반환, 만약, 함수
  │   ├─ 반복, 아니면, 타입, 상수
  │   └─ lexer.ts 한글 지원 추가
  ├─ KOREAN_SYNTAX_v1.0.md
  ├─ lexer-korean.free
  └─ tests/hello-korean.free
```

**검증**:
```bash
npm run test-korean-syntax
# hello-korean.free 렉싱 & 파싱 성공
```

**파일**:
- docs/specifications/KOREAN_SYNTAX_v1.0.md
- src/bootstrap/lexer-korean.free
- tests/hello-korean.free

---

#### 🔵 feature/docs (Team D)
**작업**: CI/CD, 문서, 커뮤니티 기반

```
feature/docs
  ├─ .github/workflows/
  │   ├─ build.yml (✅ 완성)
  │   └─ bootstrap-validation.yml
  ├─ CONTRIBUTING.md (✅ 완성)
  ├─ docs/BRANCHING_STRATEGY.md (이 파일)
  ├─ docs/architecture/
  │   ├─ ARCHITECTURE.md
  │   ├─ BOOTSTRAP_PLAN.md
  │   └─ K-STDLIB.md
  └─ docs/tutorials/
      ├─ 01_hello_korean.md
      ├─ 02_basic_syntax.md
      └─ 03_kstdlib_usage.md
```

**검증**:
```bash
# CI/CD 정상 작동 확인
# 모든 워크플로우 트리거 테스트
```

---

## 🔄 작업 흐름 (Step by Step)

### 1️⃣ 브랜치 생성 (Team Lead)

```bash
# develop에서 최신 코드 받기
git fetch origin
git checkout develop
git pull origin develop

# feature 브랜치 생성
git checkout -b feature/bootstrap-fix        # Team A
git checkout -b feature/kstdlib              # Team B
git checkout -b feature/korean-syntax        # Team C
git checkout -b feature/docs                 # Team D

# 원격 브랜치 푸시
git push origin feature/bootstrap-fix
git push origin feature/kstdlib
git push origin feature/korean-syntax
git push origin feature/docs
```

### 2️⃣ 개발 (각 팀)

```bash
# feature 브랜치에서 작업
git checkout feature/bootstrap-fix

# 개발 + 커밋
git add .
git commit -m "feat: P1 블로커 해결 - Anonymous Struct Literal"

# 주기적으로 푸시
git push origin feature/bootstrap-fix
```

### 3️⃣ PR 생성 (GitHub)

```bash
# 자동 또는 수동으로 PR 생성 (develop으로)
# PR 제목: "[Team A] P1 블로커 해결 - Anonymous Struct Literal"
# PR 설명:
#   - 변경 사항
#   - 검증 방법
#   - 관련 이슈 (#8 등)
```

### 4️⃣ CI/CD 자동 실행 (GitHub Actions)

```yaml
# build.yml 트리거:
- npm ci
- npm run build
- npm test
- npm run test-bootstrap (Team A 전용)
- npm run test-korean-syntax (Team C 전용)

# bootstrap-validation.yml:
- 부트스트랩 현황 보고
- PR 코멘트로 자동 피드백
```

### 5️⃣ 코드 리뷰 (Team Lead + 관련자)

```
체크리스트:
- [ ] 로직 정확성
- [ ] 테스트 커버리지 (80%+)
- [ ] 문서 업데이트
- [ ] 다른 팀과의 충돌 없음
```

### 6️⃣ Merge (develop에)

```bash
# GitHub UI에서 "Squash and merge" 선택
# 또는 커맨드라인:
git checkout develop
git pull origin develop
git merge --squash feature/bootstrap-fix
git commit -m "Merge feature/bootstrap-fix into develop"
git push origin develop
```

### 7️⃣ 주간 정리 (매주 금요일)

```bash
# develop이 안정적이면 main으로 merge
git checkout main
git pull origin develop
git merge develop
git tag v0.1.0
git push origin main --tags
```

---

## ⚠️ 충돌 해결

### Scenario 1: 같은 파일을 여러 팀이 수정

```bash
# A 팀이 먼저 merge됨
# B 팀이 develop으로부터 rebase
git fetch origin
git rebase origin/develop
# 충돌 해결 후
git push origin feature/kstdlib --force-with-lease
```

### Scenario 2: feature 브랜치가 너무 오래됨

```bash
# develop의 최신 변경사항을 feature에 반영
git fetch origin
git rebase origin/develop
# 또는 merge
git merge origin/develop
git push origin feature/bootstrap-fix
```

---

## 🚨 금지 사항

❌ **절대 금지**:
1. main에 직접 push
2. develop에 merge commit (squash 사용)
3. Force push to main
4. Release 변경사항을 feature에서 직접 merge

✅ **권장**:
1. 모든 작업은 feature/** 브랜치에서
2. develop으로만 PR
3. main은 develop에서만 merge
4. 주간 회의에서 브랜치 상태 공유

---

## 📊 현재 상태 (2026-03-26)

```
┌─ main (v0.0.1)
│  └─ 아직 릴리즈 없음 (준비 중)
│
└─ develop (준비 중)
   ├─ feature/bootstrap-fix (🚀 준비 중)
   ├─ feature/kstdlib (🚀 준비 중)
   ├─ feature/korean-syntax (🚀 준비 중)
   └─ feature/docs (✅ 생성됨)
```

---

## 📅 주간 계획

| 주차 | 마일스톤 | 타겟 | Status |
|------|---------|------|--------|
| Week 1 | P1~P4 해결 | 42/61 → 87% | 🔴 시작 |
| Week 2-3 | K-StdLib Phase 1-2 | 4개 모듈 이식 | 🔴 예정 |
| Week 2-3 | 한글 문법 P0 완성 | 8개 키워드 | 🔴 예정 |
| Week 4-6 | 전체 통합 테스트 | 100% 통과 | 🔴 예정 |
| Week 7 | K-FreeLang v0.1.0 | 공식 릴리즈 | 🔴 예정 |

---

**Gitflow Version**: v1.0
**Created**: 2026-03-26
**Reviewed By**: Team Leads (Team A, B, C, D)
**Last Updated**: 2026-03-26
