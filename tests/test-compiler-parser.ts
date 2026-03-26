/**
 * K-FreeLang Parser Tests
 * Token 스트림을 AST로 변환하는 파서 검증
 */

import { KoreanParser } from '../src/compiler/korean-parser';
import * as AST from '../src/compiler/korean-ast';

describe('K-FreeLang Compiler - Parser', () => {

  describe('기본 문장 파싱', () => {

    test('변수 선언 파싱', () => {
      const code = `변수 x = 10`;
      const parser = new KoreanParser(code);
      const ast = parser.parse();

      expect(ast.type).toBe('Program');
      expect(ast.statements.length).toBeGreaterThan(0);

      const varDecl = ast.statements[0] as AST.VariableDeclaration;
      expect(varDecl.type).toBe('VariableDeclaration');
      expect(varDecl.name).toBe('x');
    });

    test('상수 선언 파싱', () => {
      const code = `상수 MAX = 100`;
      const parser = new KoreanParser(code);
      const ast = parser.parse();

      const constDecl = ast.statements[0] as AST.ConstantDeclaration;
      expect(constDecl.type).toBe('ConstantDeclaration');
      expect(constDecl.name).toBe('MAX');
    });

    test('함수 선언 파싱', () => {
      const code = `
        함수 add(a: 숫자, b: 숫자) -> 숫자 {
          반환 a + b
        }
      `;
      const parser = new KoreanParser(code);
      const ast = parser.parse();

      const fnDecl = ast.statements[0] as AST.FunctionDeclaration;
      expect(fnDecl.type).toBe('FunctionDeclaration');
      expect(fnDecl.name).toBe('add');
      expect(fnDecl.parameters.length).toBe(2);
      expect(fnDecl.returnType.name).toBe('숫자');
    });

    test('타입 선언 파싱 - 구조체', () => {
      const code = `
        타입 사용자 = {
          이름: 문자열,
          나이: 숫자
        }
      `;
      const parser = new KoreanParser(code);
      const ast = parser.parse();

      const typeDecl = ast.statements[0] as AST.TypeDeclaration;
      expect(typeDecl.type).toBe('TypeDeclaration');
      expect(typeDecl.name).toBe('사용자');

      const structDef = typeDecl.definition as AST.StructDef;
      expect(structDef.type).toBe('StructDef');
      expect(structDef.fields.length).toBe(2);
    });

    test('열거형 선언 파싱', () => {
      const code = `
        타입 상태 = 열거형 {
          활성,
          비활성
        }
      `;
      const parser = new KoreanParser(code);
      const ast = parser.parse();

      const typeDecl = ast.statements[0] as AST.TypeDeclaration;
      expect(typeDecl.type).toBe('TypeDeclaration');

      const enumDef = typeDecl.definition as AST.EnumDef;
      expect(enumDef.type).toBe('EnumDef');
      expect(enumDef.variants.length).toBe(2);
    });
  });

  describe('제어문 파싱', () => {

    test('만약-아니면 문 파싱', () => {
      const code = `
        만약 x > 0 {
          출력("양수")
        } 아니면 {
          출력("음수")
        }
      `;
      const parser = new KoreanParser(code);
      const ast = parser.parse();

      const ifStmt = ast.statements[0] as AST.IfStatement;
      expect(ifStmt.type).toBe('IfStatement');
      expect(ifStmt.condition.type).toBe('BinaryExpression');
      expect(ifStmt.elseBranch).toBeDefined();
    });

    test('반복문 파싱', () => {
      const code = `
        반복 i = 0; i < 10; i = i + 1 {
          출력(i)
        }
      `;
      const parser = new KoreanParser(code);
      const ast = parser.parse();

      const forStmt = ast.statements[0] as AST.ForStatement;
      expect(forStmt.type).toBe('ForStatement');
      expect(forStmt.initializer).toBeDefined();
      expect(forStmt.condition).toBeDefined();
      expect(forStmt.update).toBeDefined();
    });

    test('반환 문 파싱', () => {
      const code = `반환 값`;
      const parser = new KoreanParser(code);
      const ast = parser.parse();

      const returnStmt = ast.statements[0] as AST.ReturnStatement;
      expect(returnStmt.type).toBe('ReturnStatement');
      expect(returnStmt.value).toBeDefined();
    });
  });

  describe('모듈 및 구조 파싱', () => {

    test('모듈 선언 파싱', () => {
      const code = `
        모듈 핵심기능 {
          함수 test() -> 공집합 {
          }
        }
      `;
      const parser = new KoreanParser(code);
      const ast = parser.parse();

      const modDecl = ast.statements[0] as AST.ModuleDeclaration;
      expect(modDecl.type).toBe('ModuleDeclaration');
      expect(modDecl.name).toBe('핵심기능');
      expect(modDecl.body.length).toBeGreaterThan(0);
    });

    test('특성 선언 파싱', () => {
      const code = `
        특성 처리가능 {
          함수 처리() -> 숫자
        }
      `;
      const parser = new KoreanParser(code);
      const ast = parser.parse();

      const traitDecl = ast.statements[0] as AST.TraitDeclaration;
      expect(traitDecl.type).toBe('TraitDeclaration');
      expect(traitDecl.name).toBe('처리가능');
      expect(traitDecl.methods.length).toBeGreaterThan(0);
    });

    test('이명공간 선언 파싱', () => {
      const code = `
        이명공간 수학 {
          함수 거듭제곱(a: 숫자, b: 숫자) -> 숫자 {
            반환 a * b
          }
        }
      `;
      const parser = new KoreanParser(code);
      const ast = parser.parse();

      const nsDecl = ast.statements[0] as AST.NamespaceDeclaration;
      expect(nsDecl.type).toBe('NamespaceDeclaration');
      expect(nsDecl.name).toBe('수학');
      expect(nsDecl.body.length).toBeGreaterThan(0);
    });
  });

  describe('식 파싱', () => {

    test('이항 연산 파싱', () => {
      const code = `변수 result = 10 + 20`;
      const parser = new KoreanParser(code);
      const ast = parser.parse();

      const varDecl = ast.statements[0] as AST.VariableDeclaration;
      expect(varDecl.initializer?.type).toBe('BinaryExpression');

      const binOp = varDecl.initializer as AST.BinaryExpression;
      expect(binOp.operator).toBe('+');
    });

    test('함수 호출 파싱', () => {
      const code = `출력("안녕")`;
      const parser = new KoreanParser(code);
      const ast = parser.parse();

      const exprStmt = ast.statements[0] as AST.ExpressionStatement;
      expect(exprStmt.expression.type).toBe('CallExpression');

      const callExpr = exprStmt.expression as AST.CallExpression;
      expect(callExpr.arguments.length).toBe(1);
    });

    test('배열 리터럴 파싱', () => {
      const code = `변수 arr = [1, 2, 3]`;
      const parser = new KoreanParser(code);
      const ast = parser.parse();

      const varDecl = ast.statements[0] as AST.VariableDeclaration;
      expect(varDecl.initializer?.type).toBe('ArrayLiteral');

      const arrLit = varDecl.initializer as AST.ArrayLiteral;
      expect(arrLit.elements.length).toBe(3);
    });

    test('멤버 접근 파싱', () => {
      const code = `변수 value = obj.property`;
      const parser = new KoreanParser(code);
      const ast = parser.parse();

      const varDecl = ast.statements[0] as AST.VariableDeclaration;
      expect(varDecl.initializer?.type).toBe('MemberExpression');

      const memberExpr = varDecl.initializer as AST.MemberExpression;
      expect(memberExpr.property).toBe('property');
      expect(memberExpr.isComputed).toBe(false);
    });
  });

  describe('P0+P1+P2 통합 파싱', () => {

    test('hello-korean-p1-complete.free 파싱', () => {
      const code = `
        사용 수학 = "math.free"

        모듈 핵심기능 {
          타입 상태 = 열거형 {
            활성,
            비활성
          }

          특성 처리가능 {
            함수 처리(입력: 숫자) -> 숫자
          }
        }

        함수 main() -> 공집합 {
          상수 프로그램명 = "K-FreeLang"
          변수 현재상태 = 활성

          만약 현재상태 == 활성 {
            출력("시작")
          } 아니면 {
            출력("실행")
          }

          반복 i = 1; i <= 5; i = i + 1 {
            출력(i)
          }

          반환
        }

        main()
      `;

      const parser = new KoreanParser(code);
      const ast = parser.parse();

      expect(ast.type).toBe('Program');
      expect(ast.statements.length).toBeGreaterThan(0);

      // 첫 번째는 use statement
      expect(ast.statements[0].type).toBe('UseStatement');

      // 모듈 선언 확인
      const modDecl = ast.statements.find(s => s.type === 'ModuleDeclaration');
      expect(modDecl).toBeDefined();

      // 함수 선언 확인
      const fnDecl = ast.statements.find(s => s.type === 'FunctionDeclaration');
      expect(fnDecl).toBeDefined();

      // main() 호출 확인
      const callExpr = ast.statements[ast.statements.length - 1];
      expect(callExpr.type).toBe('ExpressionStatement');
    });

    test('P2 고급 기능 파싱 - async/await', () => {
      const code = `
        비동기 함수 데이터가져오기(url: 문자열) -> 문자열 {
          반환 "데이터: " + url
        }

        비동기 함수 처리() -> 공집합 {
          변수 결과 = 대기 데이터가져오기("https://api.example.com")
          출력(결과)
        }
      `;

      const parser = new KoreanParser(code);
      const ast = parser.parse();

      const asyncFn = ast.statements[0] as AST.AsyncFunctionDeclaration;
      expect(asyncFn.type).toBe('AsyncFunctionDeclaration');
      expect(asyncFn.name).toBe('데이터가져오기');
    });

    test('P2 고급 기능 파싱 - 확장', () => {
      const code = `
        타입 숫자확장 = 숫자

        확장 숫자확장 {
          함수 제곱() -> 숫자 {
            반환 0
          }
        }
      `;

      const parser = new KoreanParser(code);
      const ast = parser.parse();

      const extendDecl = ast.statements.find(s => s.type === 'ExtendDeclaration');
      expect(extendDecl).toBeDefined();
      expect((extendDecl as AST.ExtendDeclaration).targetType).toBe('숫자확장');
    });

    test('P2 고급 기능 파싱 - 매크로', () => {
      const code = `
        매크로 확인(조건, 메시지) {
          만약 조건 {
            출력("확인 성공: " + 메시지)
          } 아니면 {
            출력("확인 실패: " + 메시지)
          }
        }
      `;

      const parser = new KoreanParser(code);
      const ast = parser.parse();

      const macroDcl = ast.statements[0] as AST.MacroDeclaration;
      expect(macroDcl.type).toBe('MacroDeclaration');
      expect(macroDcl.name).toBe('확인');
      expect(macroDcl.parameters.length).toBe(2);
    });
  });

  describe('에러 처리', () => {

    test('잘못된 구문 감지', () => {
      const code = `함수 test() -> { }`; // -> 후 타입 누락
      const parser = new KoreanParser(code);

      expect(() => parser.parse()).toThrow();
    });

    test('괄호 불일치 감지', () => {
      const code = `출력("문자열"`;
      const parser = new KoreanParser(code);

      expect(() => parser.parse()).toThrow();
    });
  });

  describe('타입 파싱', () => {

    test('제네릭 타입 파싱', () => {
      const code = `변수 arr: 배열<숫자> = [1, 2, 3]`;
      const parser = new KoreanParser(code);
      const ast = parser.parse();

      const varDecl = ast.statements[0] as AST.VariableDeclaration;
      expect(varDecl.typeAnnotation?.isArray).toBe(true);
      expect(varDecl.typeAnnotation?.elementType?.name).toBe('숫자');
    });

    test('중첩 제네릭 타입 파싱', () => {
      const code = `변수 matrix: 배열<배열<숫자>> = [[1], [2]]`;
      const parser = new KoreanParser(code);
      const ast = parser.parse();

      const varDecl = ast.statements[0] as AST.VariableDeclaration;
      expect(varDecl.typeAnnotation?.isArray).toBe(true);
    });
  });

  describe('P0 8개 키워드 완전 파싱', () => {

    test('모든 P0 키워드 포함 코드 파싱', () => {
      const code = `
        변수 x = 10
        상수 MAX = 100
        타입 숫자 = 숫자
        함수 test() -> 숫자 {
          반환 x
        }
        만약 x > 0 {
          출력("양수")
        } 아니면 {
          출력("음수")
        }
        반복 i = 1; i <= 3; i = i + 1 {
          출력(i)
        }
      `;

      const parser = new KoreanParser(code);
      const ast = parser.parse();

      const types = ast.statements.map(s => s.type);
      expect(types).toContain('VariableDeclaration');
      expect(types).toContain('ConstantDeclaration');
      expect(types).toContain('TypeDeclaration');
      expect(types).toContain('FunctionDeclaration');
      expect(types).toContain('IfStatement');
      expect(types).toContain('ForStatement');
    });
  });
});
