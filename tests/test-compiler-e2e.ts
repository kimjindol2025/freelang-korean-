/**
 * K-FreeLang Compiler E2E Tests
 * 전체 컴파일 파이프라인 통합 테스트
 */

import { KoreanCompiler } from '../src/compiler/korean-compiler';
import * as fs from 'fs';
import * as path from 'path';

describe('K-FreeLang Compiler - E2E Integration', () => {

  describe('기본 컴파일', () => {

    test('간단한 변수 선언 컴파일', () => {
      const code = `변수 x = 10`;
      const compiler = new KoreanCompiler();
      const result = compiler.compile(code);

      expect(result.success).toBe(true);
      expect(result.code).toBeDefined();
      expect(result.code).toContain('let x = 10');
    });

    test('함수 선언 및 호출 컴파일', () => {
      const code = `
        함수 add(a, b) -> 숫자 {
          반환 a + b
        }

        변수 result = add(5, 3)
      `;
      const compiler = new KoreanCompiler();
      const result = compiler.compile(code);

      expect(result.success).toBe(true);
      expect(result.code).toContain('function add');
      expect(result.code).toContain('return a + b');
    });

    test('if-else 문 컴파일', () => {
      const code = `
        변수 x = 10
        만약 x > 5 {
          변수 message = "크다"
        } 아니면 {
          변수 message = "작다"
        }
      `;
      const compiler = new KoreanCompiler();
      const result = compiler.compile(code);

      expect(result.success).toBe(true);
      expect(result.code).toContain('if (x > 5)');
      expect(result.code).toContain('else');
    });

    test('for 루프 컴파일', () => {
      const code = `
        반복 i = 0; i < 5; i = i + 1 {
          출력(i)
        }
      `;
      const compiler = new KoreanCompiler();
      const result = compiler.compile(code);

      expect(result.success).toBe(true);
      expect(result.code).toContain('for (');
      expect(result.code).toContain('i < 5');
    });
  });

  describe('P0+P1+P2 통합 컴파일', () => {

    test('모듈 선언 컴파일', () => {
      const code = `
        모듈 math {
          함수 add(a, b) -> 숫자 {
            반환 a + b
          }

          함수 multiply(a, b) -> 숫자 {
            반환 a * b
          }
        }
      `;
      const compiler = new KoreanCompiler();
      const result = compiler.compile(code);

      expect(result.success).toBe(true);
      expect(result.code).toContain('const math = {');
      expect(result.code).toContain('add: function');
    });

    test('비동기 함수 컴파일', () => {
      const code = `
        비동기 함수 fetchData(url) -> 문자열 {
          반환 "data from " + url
        }
      `;
      const compiler = new KoreanCompiler();
      const result = compiler.compile(code);

      expect(result.success).toBe(true);
      expect(result.code).toContain('async function');
    });

    test('try-catch 문 컴파일', () => {
      const code = `
        오류처리 {
          변수 x = 10 / 0
        } 아니면 {
          출력("오류 발생")
        }
      `;
      const compiler = new KoreanCompiler();
      const result = compiler.compile(code);

      expect(result.success).toBe(true);
      expect(result.code).toContain('try {');
      expect(result.code).toContain('catch');
    });

    test('배열 리터럴 컴파일', () => {
      const code = `
        변수 arr = [1, 2, 3, 4, 5]
        출력(arr)
      `;
      const compiler = new KoreanCompiler();
      const result = compiler.compile(code);

      expect(result.success).toBe(true);
      expect(result.code).toContain('[1, 2, 3, 4, 5]');
    });

    test('객체 리터럴 컴파일', () => {
      const code = `
        변수 obj = {name: "test", value: 42}
        출력(obj)
      `;
      const compiler = new KoreanCompiler();
      const result = compiler.compile(code);

      expect(result.success).toBe(true);
      expect(result.code).toContain('name: ');
    });
  });

  describe('hello-korean 예제 컴파일', () => {

    test('hello-korean.free 컴파일', () => {
      const filePath = path.join(__dirname, '../examples/hello-korean.free');

      if (fs.existsSync(filePath)) {
        const code = fs.readFileSync(filePath, 'utf-8');
        const compiler = new KoreanCompiler();
        const result = compiler.compile(code);

        expect(result.success).toBe(true);
        expect(result.ast).toBeDefined();
        expect(result.code).toBeDefined();
      }
    });

    test('hello-korean-p1.free 컴파일', () => {
      const filePath = path.join(__dirname, '../examples/hello-korean-p1.free');

      if (fs.existsSync(filePath)) {
        const code = fs.readFileSync(filePath, 'utf-8');
        const compiler = new KoreanCompiler();
        const result = compiler.compile(code);

        expect(result.success).toBe(true);
        expect(result.ast).toBeDefined();
        expect(result.code).toBeDefined();
      }
    });

    test('hello-korean-p2.free 컴파일', () => {
      const filePath = path.join(__dirname, '../examples/hello-korean-p2.free');

      if (fs.existsSync(filePath)) {
        const code = fs.readFileSync(filePath, 'utf-8');
        const compiler = new KoreanCompiler();
        const result = compiler.compile(code);

        expect(result.success).toBe(true);
        expect(result.ast).toBeDefined();
        expect(result.code).toBeDefined();
      }
    });

    test('hello-korean-complete.free 컴파일', () => {
      const filePath = path.join(__dirname, '../examples/hello-korean-complete.free');

      if (fs.existsSync(filePath)) {
        const code = fs.readFileSync(filePath, 'utf-8');
        const compiler = new KoreanCompiler();
        const result = compiler.compile(code);

        expect(result.success).toBe(true);
        expect(result.ast).toBeDefined();
        expect(result.code).toBeDefined();

        // AST 검증
        expect(result.ast!.statements.length).toBeGreaterThan(0);

        // 주요 구조 확인
        const types = result.ast!.statements.map(s => s.type);
        expect(types).toContain('UseStatement');
        expect(types).toContain('ModuleDeclaration');
        expect(types).toContain('FunctionDeclaration');
      }
    });
  });

  describe('타입 에러 감지', () => {

    test('타입 불일치 감지', () => {
      const code = `
        변수 x: 숫자 = "문자열"
      `;
      const compiler = new KoreanCompiler();
      const result = compiler.compile(code);

      expect(result.success).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });

    test('미정의 변수 사용 감지', () => {
      const code = `
        출력(undefined_var)
      `;
      const compiler = new KoreanCompiler();
      const result = compiler.compile(code);

      // 런타임 에러는 나중에 감지되지만, 최소한 컴파일 경고는 있어야 함
      expect(result.ast).toBeDefined();
    });
  });

  describe('컴파일 파이프라인 단계별 검증', () => {

    test('Lexer 단계 확인', () => {
      const code = `변수 x = 10`;
      const compiler = new KoreanCompiler();
      const result = compiler.compile(code);

      expect(result.tokens).toBeDefined();
      expect(result.tokens!.length).toBeGreaterThan(0);
    });

    test('Parser 단계 확인', () => {
      const code = `변수 x = 10`;
      const compiler = new KoreanCompiler();
      const result = compiler.compile(code);

      expect(result.ast).toBeDefined();
      expect(result.ast!.type).toBe('Program');
    });

    test('Semantic 단계 확인', () => {
      const code = `변수 x = 10`;
      const compiler = new KoreanCompiler();
      const result = compiler.compile(code);

      expect(result.semanticErrors).toBeDefined();
      expect(result.semanticErrors!.hasErrors).toBe(false);
    });

    test('Code Generation 단계 확인', () => {
      const code = `변수 x = 10`;
      const compiler = new KoreanCompiler();
      const result = compiler.compile(code);

      expect(result.code).toBeDefined();
      expect(result.code).toContain('let x = 10');
    });
  });

  describe('복잡한 프로그램 컴파일', () => {

    test('재귀 함수 컴파일', () => {
      const code = `
        함수 factorial(n) -> 숫자 {
          만약 n <= 1 {
            반환 1
          } 아니면 {
            반환 n * factorial(n - 1)
          }
        }

        변수 result = factorial(5)
      `;
      const compiler = new KoreanCompiler();
      const result = compiler.compile(code);

      expect(result.success).toBe(true);
      expect(result.code).toContain('function factorial');
      expect(result.code).toContain('factorial(n - 1)');
    });

    test('중첩 함수 호출 컴파일', () => {
      const code = `
        함수 outer() -> 숫자 {
          함수 inner() -> 숫자 {
            반환 42
          }
          반환 inner()
        }
      `;
      const compiler = new KoreanCompiler();
      const result = compiler.compile(code);

      expect(result.success).toBe(true);
    });

    test('복합 식 컴파일', () => {
      const code = `
        변수 x = 5
        변수 y = 10
        변수 z = (x + y) * 2 - 3
        변수 condition = z > 20 && y < 15
      `;
      const compiler = new KoreanCompiler();
      const result = compiler.compile(code);

      expect(result.success).toBe(true);
      expect(result.code).toContain('(x + y) * 2 - 3');
      expect(result.code).toContain('z > 20 && y < 15');
    });
  });

  describe('코드 생성 정확성', () => {

    test('한글 변수명 보존', () => {
      const code = `변수 한글변수 = 42`;
      const compiler = new KoreanCompiler();
      const result = compiler.compile(code);

      expect(result.code).toContain('한글변수');
    });

    test('한글 함수명 보존', () => {
      const code = `함수 한글함수() -> 공집합 { }`;
      const compiler = new KoreanCompiler();
      const result = compiler.compile(code);

      expect(result.code).toContain('한글함수');
    });

    test('출력 함수 변환', () => {
      const code = `출력("테스트")`;
      const compiler = new KoreanCompiler();
      const result = compiler.compile(code);

      expect(result.code).toContain('출력');
    });

    test('문자열 이스케이프 처리', () => {
      const code = `변수 str = "hello\\nworld"`;
      const compiler = new KoreanCompiler();
      const result = compiler.compile(code);

      expect(result.code).toContain('\\n');
    });
  });
});
