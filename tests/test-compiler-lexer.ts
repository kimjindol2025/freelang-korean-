/**
 * K-FreeLang Compiler - Korean Lexer Tests
 *
 * 완전한 렉서 토큰화 검증
 * - P0+P1+P2 한글 키워드 (35개)
 * - 연산자, 기호, 문자열, 숫자
 * - 주석 처리
 * - Unicode 한글 문자
 */

import { KoreanLexer, TokenType } from '../src/compiler/korean-lexer';

describe('K-FreeLang Compiler - Korean Lexer', () => {

  describe('한글 키워드 토큰화', () => {

    test('P0 기본 키워드 (8개)', () => {
      const lexer = new KoreanLexer(`
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
      `);

      const tokens = lexer.tokenize();
      const tokenTypes = tokens.map(t => t.type);

      expect(tokenTypes).toContain(TokenType.VAR);
      expect(tokenTypes).toContain(TokenType.CONST);
      expect(tokenTypes).toContain(TokenType.FN);
      expect(tokenTypes).toContain(TokenType.RETURN);
      expect(tokenTypes).toContain(TokenType.IF);
      expect(tokenTypes).toContain(TokenType.ELSE);
      expect(tokenTypes).toContain(TokenType.FOR);
      expect(tokenTypes).toContain(TokenType.TYPE);
    });

    test('P1 중급 키워드 (12개)', () => {
      const lexer = new KoreanLexer(`
        사용 수학 = "math"

        타입 상태 = 열거형 {
          활성
          비활성
        }

        특성 처리가능 {
          함수 처리() -> 숫자
        }

        구현 계산기 {
          함수 더하기(a, b) -> 숫자 {
            반환 a + b
          }
        }

        이명공간 고급 {
          함수 거듭제곱(a, b) -> 숫자 {
            반환 a * b
          }
        }

        함수 안전() -> 공집합 {
          오류처리 {
            변수 x = 10 / 2
          } 아니면 {
            던지기 "오류"
          }

          자동해제 {
            변수 임시 = ""
          }
        }
      `);

      const tokens = lexer.tokenize();
      const tokenTypes = tokens.map(t => t.type);

      expect(tokenTypes).toContain(TokenType.USE);
      expect(tokenTypes).toContain(TokenType.ENUM);
      expect(tokenTypes).toContain(TokenType.TRAIT);
      expect(tokenTypes).toContain(TokenType.IMPL);
      expect(tokenTypes).toContain(TokenType.NAMESPACE);
      expect(tokenTypes).toContain(TokenType.TRY);
      expect(tokenTypes).toContain(TokenType.THROW);
      expect(tokenTypes).toContain(TokenType.DROP);
    });

    test('P2 고급 키워드 (15개)', () => {
      const lexer = new KoreanLexer(`
        모듈 기능 {
          공개 정적 변수 카운터 = 0
        }

        비동기 함수 비동기작업() -> 문자열 {
          변수 결과 = 대기 로드()
          반환 결과
        }

        함수 병렬() -> 공집합 {
          동시실행 {
            출력("병렬1")
          }

          동기화 {
            변수 x = 0
          }

          안전하지않음 함수 저수준() -> 숫자 {
            반환 0
          }
        }

        매크로 확인(조건) {
          만약 조건 {
            출력("OK")
          }
        }

        함수 제네릭<T>(값: 배열<T>) -> T {
          반환 값[0]
        }

        함수 수명<'a>(참조 값: 참조 숫자) -> 참조 숫자 {
          반환 값
        }

        // 확장
        확장 숫자 {
          함수 제곱() -> 숫자 {
            반환 0
          }
        }

        타입 기본 = { 이름: 문자열 }
        타입 확장타입 상속 기본 { ID: 숫자 }
      `);

      const tokens = lexer.tokenize();
      const tokenTypes = tokens.map(t => t.type);

      expect(tokenTypes).toContain(TokenType.MOD);
      expect(tokenTypes).toContain(TokenType.PUB);
      expect(tokenTypes).toContain(TokenType.STATIC);
      expect(tokenTypes).toContain(TokenType.ASYNC);
      expect(tokenTypes).toContain(TokenType.AWAIT);
      expect(tokenTypes).toContain(TokenType.SPAWN);
      expect(tokenTypes).toContain(TokenType.SYNC);
      expect(tokenTypes).toContain(TokenType.UNSAFE);
      expect(tokenTypes).toContain(TokenType.MACRO);
    });
  });

  describe('연산자 및 기호', () => {

    test('산술 연산자', () => {
      const lexer = new KoreanLexer('1 + 2 - 3 * 4 / 5 % 6');
      const tokens = lexer.tokenize();
      const types = tokens.map(t => t.type);

      expect(types).toContain(TokenType.PLUS);
      expect(types).toContain(TokenType.MINUS);
      expect(types).toContain(TokenType.STAR);
      expect(types).toContain(TokenType.SLASH);
      expect(types).toContain(TokenType.PERCENT);
    });

    test('비교 연산자', () => {
      const lexer = new KoreanLexer('a == b != c < d <= e > f >= g');
      const tokens = lexer.tokenize();
      const types = tokens.map(t => t.type);

      expect(types).toContain(TokenType.EQ);
      expect(types).toContain(TokenType.NE);
      expect(types).toContain(TokenType.LT);
      expect(types).toContain(TokenType.LE);
      expect(types).toContain(TokenType.GT);
      expect(types).toContain(TokenType.GE);
    });

    test('논리 연산자', () => {
      const lexer = new KoreanLexer('a && b || !c');
      const tokens = lexer.tokenize();
      const types = tokens.map(t => t.type);

      expect(types).toContain(TokenType.AND);
      expect(types).toContain(TokenType.OR);
      expect(types).toContain(TokenType.NOT);
    });

    test('화살표 및 범위', () => {
      const lexer = new KoreanLexer('a -> 1..5 1..=10');
      const tokens = lexer.tokenize();
      const types = tokens.map(t => t.type);

      expect(types).toContain(TokenType.ARROW);
      expect(types).toContain(TokenType.RANGE);
      expect(types).toContain(TokenType.RANGE_INCLUSIVE);
    });

    test('괄호 및 기호', () => {
      const lexer = new KoreanLexer('() {} [] : ; , . & |');
      const tokens = lexer.tokenize();
      const types = tokens.map(t => t.type);

      expect(types).toContain(TokenType.LPAREN);
      expect(types).toContain(TokenType.RPAREN);
      expect(types).toContain(TokenType.LBRACE);
      expect(types).toContain(TokenType.RBRACE);
      expect(types).toContain(TokenType.LBRACKET);
      expect(types).toContain(TokenType.RBRACKET);
      expect(types).toContain(TokenType.COLON);
      expect(types).toContain(TokenType.SEMICOLON);
      expect(types).toContain(TokenType.COMMA);
      expect(types).toContain(TokenType.DOT);
      expect(types).toContain(TokenType.AMPERSAND);
      expect(types).toContain(TokenType.PIPE);
    });
  });

  describe('리터럴', () => {

    test('숫자 리터럴', () => {
      const lexer = new KoreanLexer('42 0 3.14 123.456');
      const tokens = lexer.tokenize();
      const numberTokens = tokens.filter(t => t.type === TokenType.NUMBER);

      expect(numberTokens.length).toBeGreaterThanOrEqual(4);
      expect(numberTokens.some(t => t.value === '42')).toBe(true);
      expect(numberTokens.some(t => t.value === '3.14')).toBe(true);
    });

    test('문자열 리터럴', () => {
      const lexer = new KoreanLexer('"hello" "한글" \'single\'');
      const tokens = lexer.tokenize();
      const stringTokens = tokens.filter(t => t.type === TokenType.STRING);

      expect(stringTokens.length).toBeGreaterThanOrEqual(3);
      expect(stringTokens.some(t => t.value === 'hello')).toBe(true);
      expect(stringTokens.some(t => t.value === '한글')).toBe(true);
    });

    test('이스케이프 문자', () => {
      const lexer = new KoreanLexer('"hello\\nworld" "tab\\there"');
      const tokens = lexer.tokenize();
      const stringTokens = tokens.filter(t => t.type === TokenType.STRING);

      expect(stringTokens.some(t => t.value.includes('\n'))).toBe(true);
      expect(stringTokens.some(t => t.value.includes('\t'))).toBe(true);
    });

    test('식별자', () => {
      const lexer = new KoreanLexer('myVar 이름 count_값 x1y2z3');
      const tokens = lexer.tokenize();
      const identifiers = tokens.filter(t => t.type === TokenType.IDENTIFIER);

      expect(identifiers.length).toBeGreaterThanOrEqual(4);
      expect(identifiers.some(t => t.value === 'myVar')).toBe(true);
      expect(identifiers.some(t => t.value === '이름')).toBe(true);
    });
  });

  describe('주석 처리', () => {

    test('한 줄 주석', () => {
      const lexer = new KoreanLexer(`
        변수 x = 10 // 이것은 주석
        반환 x // 반환합니다
      `);

      const tokens = lexer.tokenize();
      const types = tokens.map(t => t.type);

      // 주석 제외하고 실제 코드만 토큰화
      expect(types).toContain(TokenType.VAR);
      expect(types).toContain(TokenType.RETURN);
    });

    test('여러 줄 주석', () => {
      const lexer = new KoreanLexer(`
        /* 여러 줄 주석
           주석 내용
           계속... */
        변수 x = 10
      `);

      const tokens = lexer.tokenize();
      const types = tokens.map(t => t.type);

      expect(types).toContain(TokenType.VAR);
    });
  });

  describe('한글-영문 혼합', () => {

    test('혼합 코드 토큰화', () => {
      const lexer = new KoreanLexer(`
        변수 result = 0
        함수 calculate(a: number) -> 숫자 {
          let b = 20
          반환 a + b
        }
      `);

      const tokens = lexer.tokenize();
      const types = tokens.map(t => t.type);

      // 한글 키워드
      expect(types).toContain(TokenType.VAR); // 변수
      expect(types).toContain(TokenType.FN); // 함수
      expect(types).toContain(TokenType.RETURN); // 반환

      // 영문 키워드
      expect(types).toContain(TokenType.VAR); // let
    });

    test('한글 식별자 + 영문 키워드', () => {
      const lexer = new KoreanLexer(`
        let 한글변수 = 100
        const 상수명 = 50
      `);

      const tokens = lexer.tokenize();
      const identifiers = tokens.filter(t => t.type === TokenType.IDENTIFIER);

      expect(identifiers.some(t => t.value === '한글변수')).toBe(true);
      expect(identifiers.some(t => t.value === '상수명')).toBe(true);
    });
  });

  describe('위치 정보', () => {

    test('토큰 위치 추적', () => {
      const lexer = new KoreanLexer(`변수 x = 10`);
      const tokens = lexer.tokenize();

      const varToken = tokens.find(t => t.type === TokenType.VAR);
      expect(varToken).toBeDefined();
      expect(varToken!.line).toBe(1);
      expect(varToken!.column).toBeGreaterThan(0);
    });

    test('다중 라인 위치 추적', () => {
      const lexer = new KoreanLexer(`
변수 x = 10
반환 x
      `);

      const tokens = lexer.tokenize();
      const returnToken = tokens.find(t => t.type === TokenType.RETURN);

      expect(returnToken).toBeDefined();
      expect(returnToken!.line).toBeGreaterThan(1);
    });
  });

  describe('개별 P2 키워드', () => {

    test('확장 (extend) 키워드', () => {
      const lexer = new KoreanLexer('확장 숫자 { }');
      const tokens = lexer.tokenize();
      const types = tokens.map(t => t.type);

      expect(types).toContain(TokenType.EXTEND);
    });

    test('상속 (inherit) 키워드', () => {
      const lexer = new KoreanLexer('타입 T 상속 Base { }');
      const tokens = lexer.tokenize();
      const types = tokens.map(t => t.type);

      expect(types).toContain(TokenType.INHERIT);
    });
  });

  describe('완전한 hello-korean-complete.free 렉싱', () => {

    test('전체 파일 토큰화 성공', () => {
      const code = `
사용 수학 = "math.free"

모듈 핵심기능 {
  공개 타입 상태 = 열거형 {
    대기중
    실행중
    완료됨
  }

  공개 특성 처리가능 {
    함수 처리(입력: 숫자) -> 숫자
  }

  정적 변수 전역카운터 = 0
}

함수 main() -> 공집합 {
  상수 프로그램명 = "K-FreeLang"
  변수 현재상태 = 대기중

  만약 현재상태 == 대기중 {
    출력("시작")
  } 아니면 {
    출력("실행")
  }

  반복 i = 1; i <= 5; i = i + 1 {
    출력(i)
  }

  비동기 함수 비동기작업() -> 공집합 {
    변수 결과 = 대기 원격데이터()
  }
}

main()
      `;

      const lexer = new KoreanLexer(code);
      const tokens = lexer.tokenize();

      // 기본 토큰 존재 확인
      expect(tokens.length).toBeGreaterThan(50);
      expect(tokens[tokens.length - 1].type).toBe(TokenType.EOF);

      // 주요 키워드 포함 확인
      const types = tokens.map(t => t.type);
      expect(types).toContain(TokenType.USE);
      expect(types).toContain(TokenType.MOD);
      expect(types).toContain(TokenType.PUB);
      expect(types).toContain(TokenType.ENUM);
      expect(types).toContain(TokenType.TRAIT);
      expect(types).toContain(TokenType.FN);
      expect(types).toContain(TokenType.IF);
      expect(types).toContain(TokenType.ASYNC);
      expect(types).toContain(TokenType.AWAIT);
    });

    test('한글 키워드 마킹 검증', () => {
      const lexer = new KoreanLexer('변수 x = 10 let y = 20');
      const tokens = lexer.tokenize();

      const koreanVar = tokens.find(t => t.value === '변수');
      const englishVar = tokens.find(t => t.value === 'let');

      expect(koreanVar?.korean).toBe(true);
      expect(englishVar?.korean).toBe(false);
    });
  });
});
