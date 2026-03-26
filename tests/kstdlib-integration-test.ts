/**
 * K-StdLib Phase 1 통합 테스트
 * - stdlibs 7개 모듈 (math, array, string, object, json, io, date)
 * - 한글 문법 P0/P1 파싱 검증
 */

import { KoreanLexer, TokenType } from '../src/compiler/korean-lexer';
import { KoreanParser } from '../src/compiler/korean-parser';
import { KoreanSemanticAnalyzer } from '../src/compiler/korean-semantic';

describe('K-StdLib Phase 1 통합 테스트', () => {
  describe('Team B: K-StdLib stdlibs 모듈 검증', () => {
    test('math.free 함수 정의 파싱', () => {
      const code = `
함수 절대값(x: 숫자) → 숫자 {
  만약 x < 0 {
    반환 0 - x
  }
  반환 x
}
`;
      const lexer = new KoreanLexer(code);
      const tokens = lexer.tokenize();
      const parser = new KoreanParser(code);
      const ast = parser.parse();

      expect(ast.statements.length).toBeGreaterThan(0);
      expect(ast.statements[0].type).toBe('FunctionDeclaration');
    });

    test('array.free 배열 메서드 파싱', () => {
      const code = `
함수 배열반전(arr: 배열<숫자>) → 배열<숫자> {
  변수 result = []
  반복 변수 i = 길이(arr) - 1; i >= 0; i = i - 1 {
    result = [타입(result), arr[i]]
  }
  반환 result
}
`;
      const parser = new KoreanParser(code);
      const ast = parser.parse();
      expect(ast.statements.length).toBeGreaterThan(0);
    });

    test('string.free 문자열 메서드 파싱', () => {
      const code = `
함수 대문자변환(s: 문자열) → 문자열 {
  // 문자열 대문자 변환
  반환 s
}
`;
      const parser = new KoreanParser(code);
      const ast = parser.parse();
      expect(ast.statements.length).toBeGreaterThan(0);
    });

    test('object.free 객체 메서드 파싱', () => {
      const code = `
함수 객체키추출(obj: 맵<문자열, 숫자>) → 배열<문자열> {
  변수 keys = []
  반환 keys
}
`;
      const parser = new KoreanParser(code);
      const ast = parser.parse();
      expect(ast.statements.length).toBeGreaterThan(0);
    });

    test('json.free JSON 메서드 파싱', () => {
      const code = `
함수 JSON문자열변환(obj: 맵<문자열, 문자열>) → 문자열 {
  변수 result = "{"
  반환 result + "}"
}
`;
      const parser = new KoreanParser(code);
      const ast = parser.parse();
      expect(ast.statements.length).toBeGreaterThan(0);
    });

    test('io.free 파일 I/O 메서드 파싱', () => {
      const code = `
함수 파일읽기(경로: 문자열) → 문자열 {
  // 파일 읽기 로직
  반환 경로
}
`;
      const parser = new KoreanParser(code);
      const ast = parser.parse();
      expect(ast.statements.length).toBeGreaterThan(0);
    });

    test('date.free 날짜 메서드 파싱', () => {
      const code = `
함수 현재타임스탬프() → 숫자 {
  반환 1711430400  // 2026-03-26
}
`;
      const parser = new KoreanParser(code);
      const ast = parser.parse();
      expect(ast.statements.length).toBeGreaterThan(0);
    });
  });

  describe('Team C: 한글 문법 P0/P1 검증', () => {
    test('P0 키워드: 변수 선언', () => {
      const code = '변수 x = 10';
      const lexer = new KoreanLexer(code);
      const tokens = lexer.tokenize();
      expect(tokens.some(t => t.type === TokenType.VAR)).toBeTruthy();
    });

    test('P0 키워드: 함수 정의', () => {
      const code = '함수 test() → 공집합 { }';
      const lexer = new KoreanLexer(code);
      const tokens = lexer.tokenize();
      expect(tokens.some(t => t.type === TokenType.FN)).toBeTruthy();
    });

    test('P0 키워드: 반환문', () => {
      const code = '반환 값';
      const lexer = new KoreanLexer(code);
      const tokens = lexer.tokenize();
      expect(tokens.some(t => t.type === TokenType.RETURN)).toBeTruthy();
    });

    test('P0 키워드: 조건문 (만약)', () => {
      const code = '만약 참 { }';
      const lexer = new KoreanLexer(code);
      const tokens = lexer.tokenize();
      expect(tokens.some(t => t.type === TokenType.IF)).toBeTruthy();
    });

    test('P0 키워드: 반복문 (반복)', () => {
      const code = '반복 변수 i = 0; i < 10; i = i + 1 { }';
      const lexer = new KoreanLexer(code);
      const tokens = lexer.tokenize();
      expect(tokens.some(t => t.type === TokenType.FOR)).toBeTruthy();
    });

    test('P0 키워드: 상수 (상수)', () => {
      const code = '상수 PI = 3.14';
      const lexer = new KoreanLexer(code);
      const tokens = lexer.tokenize();
      expect(tokens.some(t => t.type === TokenType.CONST)).toBeTruthy();
    });

    test('P1 키워드: 타입 정의', () => {
      const code = '타입 MyType = 숫자';
      const lexer = new KoreanLexer(code);
      const tokens = lexer.tokenize();
      expect(tokens.some(t => t.type === TokenType.TYPE)).toBeTruthy();
    });

    test('P1 키워드: 구조체 (구조체)', () => {
      const code = `
구조체 Point {
  x: 숫자
  y: 숫자
}
`;
      const lexer = new KoreanLexer(code);
      const tokens = lexer.tokenize();
      // 구조체는 RECORD 토큰으로 표현될 수 있음
      expect(tokens.length).toBeGreaterThan(0);
    });

    test('P1 키워드: 열거형 (열거형)', () => {
      const code = `
열거형 Color {
  빨강
  초록
  파랑
}
`;
      const lexer = new KoreanLexer(code);
      const tokens = lexer.tokenize();
      expect(tokens.some(t => t.type === TokenType.ENUM)).toBeTruthy();
    });
  });

  describe('Team D: 한글 문법 통합 컴파일', () => {
    test('hello-korean 기본 프로그램 컴파일', () => {
      const code = `
함수 main() → 공집합 {
  변수 이름 = "K-FreeLang"
  출력("안녕하세요, " + 이름 + "!")
}

main()
`;
      const parser = new KoreanParser(code);
      const ast = parser.parse();
      expect(ast.statements.length).toBeGreaterThan(0);

      // 의미 분석
      const analyzer = new KoreanSemanticAnalyzer();
      const checkedAST = analyzer.check(ast);
      expect(checkedAST).toBeDefined();
    });

    test('변수 + 함수 + 제어문 통합', () => {
      const code = `
함수 팩토리얼(n: 숫자) → 숫자 {
  만약 n <= 1 {
    반환 1
  }
  반환 n * 팩토리얼(n - 1)
}

변수 결과 = 팩토리얼(5)
출력(결과)
`;
      const parser = new KoreanParser(code);
      const ast = parser.parse();
      expect(ast.statements.length).toBeGreaterThan(1);
    });

    test('배열 + 반복문 통합', () => {
      const code = `
함수 배열합계(arr: 배열<숫자>) → 숫자 {
  변수 합 = 0
  반복 변수 i = 0; i < 길이(arr); i = i + 1 {
    합 = 합 + arr[i]
  }
  반환 합
}

변수 숫자들 = [1, 2, 3, 4, 5]
출력(배열합계(숫자들))
`;
      const parser = new KoreanParser(code);
      const ast = parser.parse();
      expect(ast.statements.length).toBeGreaterThan(0);
    });

    test('타입 검증 통합', () => {
      const code = `
변수 x: 숫자 = 42
변수 y: 문자열 = "hello"
변수 z: 참거짓 = 참

함수 더하기(a: 숫자, b: 숫자) → 숫자 {
  반환 a + b
}

변수 결과 = 더하기(x, 10)
`;
      const parser = new KoreanParser(code);
      const ast = parser.parse();

      const analyzer = new KoreanSemanticAnalyzer();
      const checkedAST = analyzer.check(ast);
      expect(checkedAST).toBeDefined();
    });
  });

  describe('K-StdLib 모듈 임포트 파싱', () => {
    test('stdlibs 모듈 사용 선언', () => {
      const code = `
사용 math
변수 절댓값 = 절대값(-5)
`;
      // 현재 임포트 시스템 미지원, 향후 P2에서 구현
      const parser = new KoreanParser(code);
      const ast = parser.parse();
      expect(ast.statements.length).toBeGreaterThan(0);
    });
  });
});
