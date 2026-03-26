/**
 * K-FreeLang P2 Parser Test Suite
 * Match Expression, Pattern Matching, Async/Spawn/Sync 파싱
 * 2026-03-27
 */

import { KoreanParser } from '../src/compiler/korean-parser';
import * as AST from '../src/compiler/korean-ast';

describe('Parser P2: Match Expression', () => {
  test('기본 match 표현식', () => {
    const code = `
      조건 x {
        패턴 1 → "하나"
        패턴 2 → "둘"
        패턴 _ → "기타"
      }
    `;

    const parser = new KoreanParser(code);
    const ast = parser.parse();

    expect(ast.statements.length).toBeGreaterThan(0);
    const firstStmt = ast.statements[0] as AST.ExpressionStatement;
    const matchExpr = firstStmt.expression as AST.MatchExpression;

    expect(matchExpr.type).toBe('MatchExpression');
    expect(matchExpr.arms.length).toBe(3);
    expect(matchExpr.arms[0].pattern.type).toBe('LiteralPattern');
    expect(matchExpr.arms[2].pattern.type).toBe('WildcardPattern');
  });

  test('범위 패턴 (Range Pattern)', () => {
    const code = `
      조건 숫자 {
        패턴 1..10 → "범위"
        패턴 _ → "아님"
      }
    `;

    const parser = new KoreanParser(code);
    const ast = parser.parse();

    const matchExpr = (ast.statements[0] as AST.ExpressionStatement)
      .expression as AST.MatchExpression;

    expect(matchExpr.arms[0].pattern.type).toBe('RangePattern');
    const rangePattern = matchExpr.arms[0].pattern as AST.RangePattern;
    expect(rangePattern.start).toBe(1);
    expect(rangePattern.end).toBe(10);
  });

  test('OR 패턴', () => {
    const code = `
      조건 값 {
        패턴 a | b | c → "매칭"
      }
    `;

    const parser = new KoreanParser(code);
    const ast = parser.parse();

    const matchExpr = (ast.statements[0] as AST.ExpressionStatement)
      .expression as AST.MatchExpression;

    expect(matchExpr.arms[0].pattern.type).toBe('OrPattern');
  });

  test('가드 조건이 있는 패턴', () => {
    const code = `
      조건 x {
        패턴 n 만약 n > 0 → "양수"
        패턴 _ → "다른 수"
      }
    `;

    const parser = new KoreanParser(code);
    const ast = parser.parse();

    const matchExpr = (ast.statements[0] as AST.ExpressionStatement)
      .expression as AST.MatchExpression;

    expect(matchExpr.arms[0].guard).toBeDefined();
    expect(matchExpr.arms[0].guard?.type).toBe('BinaryExpression');
  });

  test('패턴 블록 바디', () => {
    const code = `
      조건 x {
        패턴 1 → {
          변수 y = 10
          반환 y
        }
      }
    `;

    const parser = new KoreanParser(code);
    const ast = parser.parse();

    const matchExpr = (ast.statements[0] as AST.ExpressionStatement)
      .expression as AST.MatchExpression;

    expect(matchExpr.arms[0].body.type).toBe('BlockStatement');
  });
});

describe('Parser P2: Async/Await', () => {
  test('async 함수 선언', () => {
    const code = `
      비동기 함수 fetchData() → 숫자 {
        대기 어떤작업()
        반환 42
      }
    `;

    const parser = new KoreanParser(code);
    const ast = parser.parse();

    const fnDecl = ast.statements[0] as AST.AsyncFunctionDeclaration;
    expect(fnDecl.type).toBe('AsyncFunctionDeclaration');
    expect(fnDecl.name).toBe('fetchData');
    expect(fnDecl.returnType.name).toBe('숫자');
  });

  test('await 표현식', () => {
    const code = `
      비동기 함수 foo() → 숫자 {
        변수 결과 = 대기 fetchData()
        반환 결과
      }
    `;

    const parser = new KoreanParser(code);
    const ast = parser.parse();

    const fnDecl = ast.statements[0] as AST.AsyncFunctionDeclaration;
    const body = fnDecl.body as AST.BlockStatement;
    const varDecl = body.statements[0] as AST.VariableDeclaration;

    expect(varDecl.initializer?.type).toBe('AwaitExpression');
  });

  test('await in 표현식', () => {
    const code = `
      비동기 함수 test() → 공집합 {
        만약 대기 조건() {
          출력("참")
        }
      }
    `;

    const parser = new KoreanParser(code);
    const ast = parser.parse();

    expect(ast.statements[0].type).toBe('AsyncFunctionDeclaration');
  });
});

describe('Parser P2: Spawn/Sync', () => {
  test('spawn 표현식 (동시실행)', () => {
    const code = `
      동시실행 {
        함수 task1() → 공집합 {
          출력("작업 1")
        }
        함수 task2() → 공집합 {
          출력("작업 2")
        }
      }
    `;

    const parser = new KoreanParser(code);
    const ast = parser.parse();

    const spawnExpr = (ast.statements[0] as AST.ExpressionStatement)
      .expression as AST.SpawnExpression;

    expect(spawnExpr.type).toBe('SpawnExpression');
    expect(spawnExpr.body.length).toBe(2);
  });

  test('sync 블록 (동기화)', () => {
    const code = `
      동기화 {
        변수 x = 10
        변수 y = 20
        변수 z = x + y
      }
    `;

    const parser = new KoreanParser(code);
    const ast = parser.parse();

    const syncBlock = (ast.statements[0] as AST.ExpressionStatement)
      .expression as AST.SyncBlock;

    expect(syncBlock.type).toBe('SyncBlock');
    expect(syncBlock.body.length).toBe(3);
  });

  test('중첩된 spawn과 sync', () => {
    const code = `
      동시실행 {
        동기화 {
          변수 x = 1
        }
        동기화 {
          변수 y = 2
        }
      }
    `;

    const parser = new KoreanParser(code);
    const ast = parser.parse();

    const spawnExpr = (ast.statements[0] as AST.ExpressionStatement)
      .expression as AST.SpawnExpression;

    expect(spawnExpr.body.length).toBe(2);
  });
});

describe('Parser P2: Integration', () => {
  test('match + async 통합', () => {
    const code = `
      비동기 함수 process(x: 숫자) → 문자열 {
        조건 대기 getValue(x) {
          패턴 1 → "하나"
          패턴 2 → "둘"
          패턴 _ → "기타"
        }
      }
    `;

    const parser = new KoreanParser(code);
    const ast = parser.parse();

    const fnDecl = ast.statements[0] as AST.AsyncFunctionDeclaration;
    expect(fnDecl.type).toBe('AsyncFunctionDeclaration');
  });

  test('spawn + match 통합', () => {
    const code = `
      동시실행 {
        조건 상태 {
          패턴 "ready" → 출력("준비됨")
          패턴 "busy" → 출력("작업중")
          패턴 _ → 출력("불명")
        }
      }
    `;

    const parser = new KoreanParser(code);
    const ast = parser.parse();

    const spawnExpr = (ast.statements[0] as AST.ExpressionStatement)
      .expression as AST.SpawnExpression;

    expect(spawnExpr.body[0].type).toBe('ExpressionStatement');
  });

  test('복잡한 P2 조합', () => {
    const code = `
      비동기 함수 complexTask() → 공집합 {
        동시실행 {
          조건 대기 getStatus() {
            패턴 1..10 → 출력("작은 수")
            패턴 _ → 출력("큰 수")
          }

          동기화 {
            변수 결과 = 대기 calculate()
          }
        }
      }
    `;

    const parser = new KoreanParser(code);
    const ast = parser.parse();

    const fnDecl = ast.statements[0] as AST.AsyncFunctionDeclaration;
    expect(fnDecl.type).toBe('AsyncFunctionDeclaration');
  });
});

describe('Parser P2: Error Handling', () => {
  test('잘못된 패턴 문법', () => {
    const code = `
      조건 x {
        1 → "오류"
      }
    `;

    expect(() => {
      const parser = new KoreanParser(code);
      parser.parse();
    }).toThrow();
  });

  test('match 없이 패턴', () => {
    const code = `
      패턴 1 → "오류"
    `;

    expect(() => {
      const parser = new KoreanParser(code);
      parser.parse();
    }).toThrow();
  });

  test('와일드카드만 있는 match', () => {
    const code = `
      조건 x {
        패턴 _ → "모두"
      }
    `;

    const parser = new KoreanParser(code);
    const ast = parser.parse();

    expect(ast.statements.length).toBeGreaterThan(0);
  });
});

describe('Parser P2: Token Coverage', () => {
  test('DOTDOT 토큰 인식', () => {
    const code = `
      조건 x {
        패턴 1..100 → "범위"
      }
    `;

    const parser = new KoreanParser(code);
    const ast = parser.parse();

    const matchExpr = (ast.statements[0] as AST.ExpressionStatement)
      .expression as AST.MatchExpression;

    expect(matchExpr.arms[0].pattern.type).toBe('RangePattern');
  });

  test('UNDERSCORE 토큰 인식', () => {
    const code = `
      조건 x {
        패턴 _ → "와일드카드"
      }
    `;

    const parser = new KoreanParser(code);
    const ast = parser.parse();

    const matchExpr = (ast.statements[0] as AST.ExpressionStatement)
      .expression as AST.MatchExpression;

    expect(matchExpr.arms[0].pattern.type).toBe('WildcardPattern');
  });

  test('_identifier는 일반 식별자', () => {
    const code = `
      변수 _private = 10
      변수 _result = _private + 5
    `;

    const parser = new KoreanParser(code);
    const ast = parser.parse();

    const var1 = ast.statements[0] as AST.VariableDeclaration;
    expect(var1.name).toBe('_private');
  });
});
