# K-FreeLang 컴파일러 아키텍처

**문서 버전**: v1.0  
**작성일**: 2026-03-26  
**대상**: 개발자 및 기여자

---

## 🏗️ 5단계 컴파일 파이프라인

```
┌─────────────────────────────────────────────────────────────┐
│                    K-FreeLang 소스 코드                      │
│                   (*.free 파일)                              │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
        ┌────────────────────────┐
        │   1️⃣ LEXICAL ANALYSIS  │
        │     (렉싱)             │
        │                        │
        │  Korean Lexer          │
        │  - 35개 한글 키워드    │
        │  - 연산자, 리터럴      │
        │  - 주석 처리           │
        └────────┬───────────────┘
                 │
                 ▼
        ┌────────────────────────┐
        │  2️⃣ SYNTAX ANALYSIS   │
        │    (파싱)             │
        │                        │
        │  Korean Parser         │
        │  - 47개 문법 규칙      │
        │  - AST 구성            │
        │  - NEWLINE 처리        │
        └────────┬───────────────┘
                 │
                 ▼
        ┌────────────────────────┐
        │  3️⃣ SEMANTIC ANALYSIS  │
        │    (의미 분석)         │
        │                        │
        │  Semantic Analyzer     │
        │  - 타입 체킹           │
        │  - 심볼 테이블         │
        │  - 스코프 관리         │
        └────────┬───────────────┘
                 │
                 ▼
        ┌────────────────────────┐
        │  4️⃣ CODE GENERATION   │
        │   (코드 생성)          │
        │                        │
        │  Code Generator        │
        │  - AST → JavaScript    │
        │  - 한글 식별자 보존    │
        │  - 최적화              │
        └────────┬───────────────┘
                 │
                 ▼
        ┌────────────────────────┐
        │  5️⃣ RUNTIME EXECUTION │
        │    (실행)              │
        │                        │
        │  JavaScript VM         │
        │  - eval() 기반         │
        │  - 즉시 실행           │
        │  - 결과 출력           │
        └────────┬───────────────┘
                 │
                 ▼
        ┌────────────────────────┐
        │      출력 결과         │
        └────────────────────────┘
```

---

## 📁 코드 구조

```
src/compiler/
├── korean-lexer.ts      (280줄)
│   ├── TokenType enum (96개 토큰)
│   ├── Token interface
│   ├── KoreanLexer class
│   └── 한글-영문 키워드 매핑
│
├── korean-ast.ts        (400줄)
│   ├── Program
│   ├── Statement (10+ 타입)
│   ├── Expression (7+ 타입)
│   └── Type definitions
│
├── korean-parser.ts     (1,180줄)
│   ├── KoreanParser class
│   ├── parseStatement()
│   ├── parseExpression()
│   ├── 47개 파싱 규칙
│   └── 우선순위 기반 식 파싱
│
├── korean-semantic.ts   (850줄)
│   ├── SymbolTable class
│   ├── TypeChecker class
│   ├── SemanticAnalyzer class
│   └── 타입 호환성 검사
│
├── korean-codegen.ts    (550줄)
│   ├── CodeGenerator class
│   ├── emitStatement()
│   ├── emitExpression()
│   └── 내장 함수 정의
│
└── korean-compiler.ts   (140줄)
    ├── KoreanCompiler class
    ├── compile()
    ├── execute()
    └── 전체 파이프라인
```

---

## 🔄 각 단계 상세

### Stage 1: Lexer (렉싱)

**입력**: 문자열 (한글/영문 섞인 코드)  
**출력**: Token[]

**처리 과정**:
1. 문자 단위로 스캔
2. 한글 키워드 인식 (KOREAN_KEYWORDS Map)
3. 영문 키워드 인식 (ENGLISH_KEYWORDS Map)
4. 연산자, 괄호, 리터럴 토큰화

**예시**:
```
입력:  "변수 x = 10"
출력: [
  Token(VAR, "변수"),
  Token(IDENTIFIER, "x"),
  Token(ASSIGN, "="),
  Token(NUMBER, "10")
]
```

### Stage 2: Parser (파싱)

**입력**: Token[]  
**출력**: AST (Program)

**처리 과정**:
1. Recursive Descent Parsing
2. 토큰 시퀀스를 트리로 변환
3. NEWLINE 토큰 자동 처리
4. 우선순위 기반 식 파싱 (Pratt parsing)

**파싱 규칙 예시**:
```
program     := statement*
statement   := varDecl | funcDecl | ifStmt | ...
funcDecl    := FN IDENTIFIER LPAREN params RPAREN ARROW type LBRACE blockStmt RBRACE
ifStmt      := IF expr LBRACE blockStmt RBRACE (ELSE (ifStmt | blockStmt))?
expr        := assignment
assignment  := logicalOr (ASSIGN assignment)?
logicalOr   := logicalAnd (OR logicalAnd)*
...
```

### Stage 3: Semantic Analysis (의미 분석)

**입력**: AST  
**출력**: SemanticErrors

**검사 항목**:
- 정의되지 않은 식별자 (Symbol Table)
- 타입 불일치
- 함수 호출 인수 개수
- 스코프 유효성

**구현**:
```typescript
SymbolTable: Map<문자열, Symbol[]>
- 각 스코프에서 심볼 관리
- lookup(name, scope) - 현재 스코프의 심볼 찾기

TypeChecker:
- isCompatible(fromType, toType)
- 타입 별칭 지원 (한글/영문)
```

### Stage 4: Code Generation (코드 생성)

**입력**: AST  
**출력**: JavaScript 문자열

**변환 규칙**:
```
한글 변수 → JavaScript let
한글 함수 → JavaScript function
한글 조건 → JavaScript if
한글 반복 → JavaScript for
한글 식별자 → 그대로 유지
```

**예시**:
```
입력 AST:
  VariableDeclaration {
    name: "x",
    initializer: Literal(10)
  }

출력 JavaScript:
  let x = 10;
```

### Stage 5: Runtime (실행)

**입력**: JavaScript 코드 문자열  
**출력**: 실행 결과

**구현**:
```javascript
eval(generatedCode)
```

내장 함수들:
- `출력()` → console.log()
- `타입()` → typeof 확장
- `길이()` → .length
- 등 7개 함수

---

## 🎯 핵심 설계 결정

### 1. 한글 식별자 완전 지원
- 변수명, 함수명 모두 한글 가능
- 파서/코드젠에서 그대로 보존
- JavaScript도 한글 식별자 지원

### 2. NEWLINE을 Statement 구분자로
- 렉서에서 NEWLINE 토큰 생성
- 파서에서 `skipNewlines()` 자동 처리
- 세미콜론 불필요

### 3. 타입 호환성 (한글/영문 별칭)
```
'숫자' ≡ 'number'
'문자열' ≡ 'string'
'참거짓' ≡ 'bool'
'공집합' ≡ 'void'
```

### 4. 내장 함수 자동 정의
- Semantic Analysis 시작 시 `defineBuiltinFunctions()`
- 7개 기본 함수 심볼 테이블에 추가
- 사용자 정의 함수와 동일 취급

---

## 🔧 확장 포인트

### P1 키워드 추가 (구조체, 열거형, etc)
```
korean-lexer.ts:
  + STRUCT 토큰 추가
  + 한글 '구조체' 매핑

korean-ast.ts:
  + StructDeclaration 인터페이스

korean-parser.ts:
  + parseStructDeclaration() 구현

korean-semantic.ts:
  + 구조체 필드 타입 검사
```

### K-StdLib 라이브러리 추가
```
src/kstdlib/
├── stdlibs/ (math, array, string, object, json, io, date)
├── crypto/ (ARIA, SEED, OTP)
├── compliance/ (PIPA 규정)
└── proof/ (형식적 증명)
```

---

## 📊 성능 특성

| 항목 | 값 |
|------|-----|
| 렉싱 | O(n) - n은 문자 개수 |
| 파싱 | O(n) - LL(1) 파서 |
| 의미 분석 | O(n) - 단일 패스 |
| 코드 생성 | O(n) - 트리 순회 |
| **전체 컴파일** | **O(n)** |

---

## ✅ 테스트 현황

```
Lexer Tests:     22/22 ✅
Parser Tests:    24/24 ✅ (구현 중)
E2E Tests:       11/26 ✅ (진행 중)
Bootstrap:       4/4 단계 ✅
```

---

**다음**: [K-StdLib 아키텍처](./K-STDLIB.md)
