/**
 * K-FreeLang 한글 렉서 단위 테스트
 *
 * 한글 키워드 인식 검증:
 * - 변수 (let/var)
 * - 반환 (return)
 * - 만약 (if)
 * - 함수 (fn)
 * - 반복 (for)
 * - 아니면 (else)
 * - 타입 (type/struct)
 * - 상수 (const)
 */

import NexusLexer from '../src/lexer'; // 또는 freelang-nexus 경로
import { TokenType } from '../src/token';

describe('K-FreeLang Korean Lexer Tests', () => {
  let lexer: NexusLexer;

  beforeEach(() => {
    lexer = new NexusLexer('');
  });

  describe('P0 한글 키워드 (8개)', () => {
    test('변수 키워드 인식', () => {
      const tokens = new NexusLexer('변수 x = 10').tokenize();
      expect(tokens[0].type).toBe(TokenType.LET);
      expect(tokens[0].value).toBe('변수');
    });

    test('반환 키워드 인식', () => {
      const tokens = new NexusLexer('반환 x').tokenize();
      expect(tokens[0].type).toBe(TokenType.RETURN);
      expect(tokens[0].value).toBe('반환');
    });

    test('만약 키워드 인식', () => {
      const tokens = new NexusLexer('만약 x > 0 { }').tokenize();
      expect(tokens[0].type).toBe(TokenType.IF);
      expect(tokens[0].value).toBe('만약');
    });

    test('함수 키워드 인식', () => {
      const tokens = new NexusLexer('함수 add(a, b) { }').tokenize();
      expect(tokens[0].type).toBe(TokenType.FN);
      expect(tokens[0].value).toBe('함수');
    });

    test('반복 키워드 인식', () => {
      const tokens = new NexusLexer('반복 i = 0; i < 10; i++ { }').tokenize();
      expect(tokens[0].type).toBe(TokenType.FOR);
      expect(tokens[0].value).toBe('반복');
    });

    test('아니면 키워드 인식', () => {
      const tokens = new NexusLexer('만약 x { } 아니면 { }').tokenize();
      const elseToken = tokens.find(t => t.value === '아니면');
      expect(elseToken).toBeDefined();
      expect(elseToken?.type).toBe(TokenType.ELSE);
    });

    test('타입 키워드 인식', () => {
      const tokens = new NexusLexer('타입 사람 { }').tokenize();
      expect(tokens[0].type).toBe(TokenType.STRUCT);
      expect(tokens[0].value).toBe('타입');
    });

    test('상수 키워드 인식', () => {
      const tokens = new NexusLexer('상수 MAX = 100').tokenize();
      expect(tokens[0].type).toBe(TokenType.CONST);
      expect(tokens[0].value).toBe('상수');
    });
  });

  describe('한글 변수명 (식별자)', () => {
    test('한글 변수명 인식', () => {
      const tokens = new NexusLexer('변수 이름 = "김프리"').tokenize();
      const nameToken = tokens.find(t => t.value === '이름');
      expect(nameToken).toBeDefined();
      expect(nameToken?.type).toBe(TokenType.IDENTIFIER);
    });

    test('복합 한글 변수명', () => {
      const tokens = new NexusLexer('변수 최종점수 = 95').tokenize();
      const scoreToken = tokens.find(t => t.value === '최종점수');
      expect(scoreToken).toBeDefined();
      expect(scoreToken?.type).toBe(TokenType.IDENTIFIER);
    });

    test('한글_영문_혼합 변수명', () => {
      const tokens = new NexusLexer('변수 점수_final = 90').tokenize();
      // 한글 후 언더스코어 후 영문도 하나의 식별자로 인식되어야 함
      const token = tokens.find(t => t.value === '점수_final');
      expect(token).toBeDefined();
    });
  });

  describe('한글-영문 혼합 코드', () => {
    test('한글 키워드 + 영문 식별자', () => {
      const code = `
        변수 message = "Hello"
        만약 message == "Hello" {
          반환 참
        }
      `;
      const tokens = new NexusLexer(code).tokenize();

      const varToken = tokens.find(t => t.value === '변수');
      const ifToken = tokens.find(t => t.value === '만약');
      const returnToken = tokens.find(t => t.value === '반환');

      expect(varToken?.type).toBe(TokenType.LET);
      expect(ifToken?.type).toBe(TokenType.IF);
      expect(returnToken?.type).toBe(TokenType.RETURN);
    });

    test('완전 한글 코드', () => {
      const code = `
        함수 계산(수1: 숫자, 수2: 숫자) -> 숫자 {
          변수 결과 = 수1 + 수2
          반환 결과
        }
      `;
      const tokens = new NexusLexer(code).tokenize();

      const funcToken = tokens.find(t => t.value === '함수');
      const varToken = tokens.find(t => t.value === '변수');
      const returnToken = tokens.find(t => t.value === '반환');

      expect(funcToken?.type).toBe(TokenType.FN);
      expect(varToken?.type).toBe(TokenType.LET);
      expect(returnToken?.type).toBe(TokenType.RETURN);
    });
  });

  describe('타입 한글화', () => {
    test('한글 타입 문자열 (미래 지원)', () => {
      // P1 이상에서 구현 예정
      // const tokens = new NexusLexer('변수 이름: 문자열').tokenize();
      // expect(tokens).toContain({ type: TokenType.STRING_TYPE, value: '문자열' });
    });

    test('한글 타입 숫자 (미래 지원)', () => {
      // const tokens = new NexusLexer('변수 나이: 숫자').tokenize();
      // 현재는 숫자를 NUMBER로 인식하므로 영문 number 또는 i32/i64 등만 지원
    });
  });

  describe('엣지 케이스', () => {
    test('한글 키워드와 영문 키워드 구분', () => {
      const tokens1 = new NexusLexer('변수 x = 10').tokenize();
      const tokens2 = new NexusLexer('let x = 10').tokenize();

      expect(tokens1[0].type).toBe(TokenType.LET);
      expect(tokens2[0].type).toBe(TokenType.LET);
      expect(tokens1[0].value).toBe('변수');
      expect(tokens2[0].value).toBe('let');
    });

    test('한글 문자열 내부 (한글이 문자열 리터럴이어야 함)', () => {
      const tokens = new NexusLexer('변수 msg = "안녕하세요"').tokenize();
      const stringToken = tokens.find(t => t.type === TokenType.STRING);
      expect(stringToken?.value).toContain('안녕하세요');
    });

    test('한글 주석 지원', () => {
      const code = `
        // 이것은 한글 주석입니다
        변수 x = 10
        /* 여러 줄
           한글 주석 */
      `;
      const tokens = new NexusLexer(code).tokenize();
      // 주석은 토큰화되지 않음
      const varToken = tokens.find(t => t.value === '변수');
      expect(varToken?.type).toBe(TokenType.LET);
    });

    test('연속 한글 키워드', () => {
      const tokens = new NexusLexer('함수 main() { 만약 참 { 반환 } }').tokenize();
      const funcToken = tokens.find(t => t.value === '함수');
      const ifToken = tokens.find(t => t.value === '만약');
      const returnToken = tokens.find(t => t.value === '반환');

      expect(funcToken?.type).toBe(TokenType.FN);
      expect(ifToken?.type).toBe(TokenType.IF);
      expect(returnToken?.type).toBe(TokenType.RETURN);
    });
  });

  describe('렉서 성능', () => {
    test('대량 한글 키워드 처리', () => {
      let code = '';
      for (let i = 0; i < 1000; i++) {
        code += `변수 x${i} = ${i}\n`;
      }

      const startTime = Date.now();
      const tokens = new NexusLexer(code).tokenize();
      const elapsed = Date.now() - startTime;

      // 1000줄 처리가 100ms 내에 완료되어야 함
      expect(elapsed).toBeLessThan(100);

      // 모든 한글 변수 키워드가 LET으로 인식되어야 함
      const varTokens = tokens.filter(t => t.value === '변수');
      expect(varTokens.length).toBe(1000);
      expect(varTokens.every(t => t.type === TokenType.LET)).toBe(true);
    });
  });
});
