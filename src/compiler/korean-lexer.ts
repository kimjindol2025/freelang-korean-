/**
 * K-FreeLang Korean Lexer
 *
 * 한글 및 영문 키워드 토큰화
 * - P0: 8개 기본 키워드
 * - P1: 12개 중급 키워드
 * - P2: 15개 고급 키워드
 * = 35개 전체 한글 키워드 + 영문 호환
 */

export enum TokenType {
  // 기본 토큰
  EOF = 'EOF',
  IDENTIFIER = 'IDENTIFIER',
  NUMBER = 'NUMBER',
  STRING = 'STRING',
  NEWLINE = 'NEWLINE',

  // 연산자
  PLUS = 'PLUS',           // +
  MINUS = 'MINUS',         // -
  STAR = 'STAR',           // *
  SLASH = 'SLASH',         // /
  PERCENT = 'PERCENT',     // %
  EQUAL = 'EQUAL',         // =
  EQ = 'EQ',               // ==
  NE = 'NE',               // !=
  LT = 'LT',               // <
  LE = 'LE',               // <=
  GT = 'GT',               // >
  GE = 'GE',               // >=
  AND = 'AND',             // &&
  OR = 'OR',               // ||
  NOT = 'NOT',             // !
  ARROW = 'ARROW',         // ->
  COLON = 'COLON',         // :
  SEMICOLON = 'SEMICOLON', // ;
  COMMA = 'COMMA',         // ,
  DOT = 'DOT',             // .
  PIPE = 'PIPE',           // |
  AMPERSAND = 'AMPERSAND', // &

  // 괄호
  LPAREN = 'LPAREN',       // (
  RPAREN = 'RPAREN',       // )
  LBRACE = 'LBRACE',       // {
  RBRACE = 'RBRACE',       // }
  LBRACKET = 'LBRACKET',   // [
  RBRACKET = 'RBRACKET',   // ]

  // P0: 기본 키워드 (8개)
  VAR = 'VAR',             // 변수 / let
  RETURN = 'RETURN',       // 반환 / return
  IF = 'IF',               // 만약 / if
  FN = 'FN',               // 함수 / fn
  FOR = 'FOR',             // 반복 / for
  ELSE = 'ELSE',           // 아니면 / else
  TYPE = 'TYPE',           // 타입 / type
  CONST = 'CONST',         // 상수 / const

  // P1: 중급 키워드 (12개)
  USE = 'USE',             // 사용 / use
  MATCH = 'MATCH',         // 조건 / match
  TRY = 'TRY',             // 오류처리 / try
  THROW = 'THROW',         // 던지기 / throw
  NAMESPACE = 'NAMESPACE', // 이명공간 / namespace
  INTERFACE = 'INTERFACE', // 인터페이스 / interface
  DROP = 'DROP',           // 자동해제 / drop
  ENUM = 'ENUM',           // 열거형 / enum
  IMPL = 'IMPL',           // 구현 / impl
  TRAIT = 'TRAIT',         // 특성 / trait
  MUT = 'MUT',             // 불변 / mut
  REF = 'REF',             // 참조 / ref

  // P2: 고급 키워드 (15개)
  ASYNC = 'ASYNC',         // 비동기 / async
  AWAIT = 'AWAIT',         // 대기 / await
  SPAWN = 'SPAWN',         // 동시실행 / spawn
  SYNC = 'SYNC',           // 동기화 / sync
  UNSAFE = 'UNSAFE',       // 안전하지않음 / unsafe
  MACRO = 'MACRO',         // 매크로 / macro
  GENERIC = 'GENERIC',     // 제네릭 / generic
  LIFETIME = 'LIFETIME',   // 수명 / lifetime
  PATTERN = 'PATTERN',     // 패턴 / pattern
  EXTEND = 'EXTEND',       // 확장 / extend
  MOD = 'MOD',             // 모듈 / mod
  PUB = 'PUB',             // 공개 / pub
  STATIC = 'STATIC',       // 정적 / static
  INHERIT = 'INHERIT',     // 상속 / inherit
  WHILE = 'WHILE',         // while (P2에서 추가)

  // 특수
  IN = 'IN',               // in (for...in)
  RANGE = 'RANGE',         // .. (범위)
  RANGE_INCLUSIVE = 'RANGE_INCLUSIVE', // ..= (포함 범위)
}

export interface Token {
  type: TokenType;
  value: string;
  line: number;
  column: number;
  korean?: boolean; // 한글 키워드인지 표시
}

/**
 * 한글-영문 키워드 매핑
 */
const KOREAN_KEYWORDS: Map<string, TokenType> = new Map([
  // P0: 기본 (8개)
  ['변수', TokenType.VAR],
  ['반환', TokenType.RETURN],
  ['만약', TokenType.IF],
  ['함수', TokenType.FN],
  ['반복', TokenType.FOR],
  ['아니면', TokenType.ELSE],
  ['타입', TokenType.TYPE],
  ['상수', TokenType.CONST],

  // P1: 중급 (12개)
  ['사용', TokenType.USE],
  ['조건', TokenType.MATCH],
  ['오류처리', TokenType.TRY],
  ['던지기', TokenType.THROW],
  ['이명공간', TokenType.NAMESPACE],
  ['인터페이스', TokenType.INTERFACE],
  ['자동해제', TokenType.DROP],
  ['열거형', TokenType.ENUM],
  ['구현', TokenType.IMPL],
  ['특성', TokenType.TRAIT],
  ['불변', TokenType.MUT],
  ['참조', TokenType.REF],

  // P2: 고급 (15개)
  ['비동기', TokenType.ASYNC],
  ['대기', TokenType.AWAIT],
  ['동시실행', TokenType.SPAWN],
  ['동기화', TokenType.SYNC],
  ['안전하지않음', TokenType.UNSAFE],
  ['매크로', TokenType.MACRO],
  ['제네릭', TokenType.GENERIC],
  ['수명', TokenType.LIFETIME],
  ['패턴', TokenType.PATTERN],
  ['확장', TokenType.EXTEND],
  ['모듈', TokenType.MOD],
  ['공개', TokenType.PUB],
  ['정적', TokenType.STATIC],
  ['상속', TokenType.INHERIT],
]);

/**
 * 영문 키워드 매핑
 */
const ENGLISH_KEYWORDS: Map<string, TokenType> = new Map([
  // P0: 기본 (8개)
  ['let', TokenType.VAR],
  ['var', TokenType.VAR],
  ['return', TokenType.RETURN],
  ['if', TokenType.IF],
  ['fn', TokenType.FN],
  ['for', TokenType.FOR],
  ['else', TokenType.ELSE],
  ['type', TokenType.TYPE],
  ['const', TokenType.CONST],

  // P1: 중급 (12개)
  ['use', TokenType.USE],
  ['match', TokenType.MATCH],
  ['try', TokenType.TRY],
  ['throw', TokenType.THROW],
  ['namespace', TokenType.NAMESPACE],
  ['interface', TokenType.INTERFACE],
  ['drop', TokenType.DROP],
  ['enum', TokenType.ENUM],
  ['impl', TokenType.IMPL],
  ['trait', TokenType.TRAIT],
  ['mut', TokenType.MUT],
  ['ref', TokenType.REF],

  // P2: 고급 (15개)
  ['async', TokenType.ASYNC],
  ['await', TokenType.AWAIT],
  ['spawn', TokenType.SPAWN],
  ['sync', TokenType.SYNC],
  ['unsafe', TokenType.UNSAFE],
  ['macro', TokenType.MACRO],
  ['generic', TokenType.GENERIC],
  ['lifetime', TokenType.LIFETIME],
  ['pattern', TokenType.PATTERN],
  ['extend', TokenType.EXTEND],
  ['mod', TokenType.MOD],
  ['pub', TokenType.PUB],
  ['static', TokenType.STATIC],
  ['inherit', TokenType.INHERIT],
  ['while', TokenType.WHILE],

  // 특수
  ['in', TokenType.IN],
]);

/**
 * K-FreeLang Korean Lexer
 */
export class KoreanLexer {
  private input: string;
  private position: number = 0;
  private line: number = 1;
  private column: number = 1;
  private tokens: Token[] = [];

  constructor(input: string) {
    this.input = input;
  }

  /**
   * 한글 문자 판정
   */
  private isKorean(char: string): boolean {
    if (!char) return false;
    const code = char.charCodeAt(0);
    // 완전체 (U+AC00~D7A3) 또는 자모 (U+1100~11FF)
    return (code >= 0xAC00 && code <= 0xD7A3) ||
           (code >= 0x1100 && code <= 0x11FF);
  }

  /**
   * 식별자 시작 문자 판정
   */
  private isIdentifierStart(char: string): boolean {
    if (!char) return false;
    return /[a-zA-Z_]/.test(char) || this.isKorean(char);
  }

  /**
   * 식별자 계속 문자 판정
   */
  private isIdentifierContinue(char: string): boolean {
    if (!char) return false;
    return /[a-zA-Z0-9_]/.test(char) || this.isKorean(char);
  }

  /**
   * 숫자 판정
   */
  private isDigit(char: string): boolean {
    return /[0-9]/.test(char);
  }

  /**
   * 공백 판정
   */
  private isWhitespace(char: string): boolean {
    return /\s/.test(char) && char !== '\n';
  }

  /**
   * 현재 문자
   */
  private current(): string {
    return this.input[this.position] || '';
  }

  /**
   * 다음 문자
   */
  private peek(offset: number = 1): string {
    return this.input[this.position + offset] || '';
  }

  /**
   * 문자 진행
   */
  private advance(): string {
    const char = this.current();
    if (char === '\n') {
      this.line++;
      this.column = 1;
    } else {
      this.column++;
    }
    this.position++;
    return char;
  }

  /**
   * 공백 스킵
   */
  private skipWhitespace(): void {
    while (this.isWhitespace(this.current())) {
      this.advance();
    }
  }

  /**
   * 주석 스킵
   */
  private skipComment(): void {
    if (this.current() === '/' && this.peek() === '/') {
      while (this.current() && this.current() !== '\n') {
        this.advance();
      }
    } else if (this.current() === '/' && this.peek() === '*') {
      this.advance(); // /
      this.advance(); // *
      while (this.current()) {
        if (this.current() === '*' && this.peek() === '/') {
          this.advance(); // *
          this.advance(); // /
          break;
        }
        this.advance();
      }
    }
  }

  /**
   * 식별자 또는 키워드 읽기
   */
  private readIdentifier(): Token {
    const startLine = this.line;
    const startColumn = this.column;
    let value = '';

    while (this.isIdentifierContinue(this.current())) {
      value += this.advance();
    }

    // 한글 키워드 확인
    if (KOREAN_KEYWORDS.has(value)) {
      return {
        type: KOREAN_KEYWORDS.get(value)!,
        value,
        line: startLine,
        column: startColumn,
        korean: true,
      };
    }

    // 영문 키워드 확인
    if (ENGLISH_KEYWORDS.has(value)) {
      return {
        type: ENGLISH_KEYWORDS.get(value)!,
        value,
        line: startLine,
        column: startColumn,
        korean: false,
      };
    }

    // 일반 식별자
    return {
      type: TokenType.IDENTIFIER,
      value,
      line: startLine,
      column: startColumn,
    };
  }

  /**
   * 숫자 읽기
   */
  private readNumber(): Token {
    const startLine = this.line;
    const startColumn = this.column;
    let value = '';

    while (this.isDigit(this.current())) {
      value += this.advance();
    }

    // 소수점
    if (this.current() === '.' && this.isDigit(this.peek())) {
      value += this.advance(); // .
      while (this.isDigit(this.current())) {
        value += this.advance();
      }
    }

    return {
      type: TokenType.NUMBER,
      value,
      line: startLine,
      column: startColumn,
    };
  }

  /**
   * 문자열 읽기
   */
  private readString(quote: string): Token {
    const startLine = this.line;
    const startColumn = this.column;
    let value = '';

    this.advance(); // 시작 따옴표

    while (this.current() && this.current() !== quote) {
      if (this.current() === '\\') {
        this.advance();
        const escaped = this.advance();
        value += this.getEscapeChar(escaped);
      } else {
        value += this.advance();
      }
    }

    if (this.current() === quote) {
      this.advance(); // 끝 따옴표
    }

    return {
      type: TokenType.STRING,
      value,
      line: startLine,
      column: startColumn,
    };
  }

  /**
   * 이스케이프 문자 처리
   */
  private getEscapeChar(char: string): string {
    const escapes: { [key: string]: string } = {
      'n': '\n',
      't': '\t',
      'r': '\r',
      '\\': '\\',
      '"': '"',
      "'": "'",
    };
    return escapes[char] || char;
  }

  /**
   * 토큰화
   */
  tokenize(): Token[] {
    this.tokens = [];

    while (this.position < this.input.length) {
      this.skipWhitespace();

      // 주석 스킵
      while (this.current() === '/' && (this.peek() === '/' || this.peek() === '*')) {
        this.skipComment();
        this.skipWhitespace();
      }

      if (this.position >= this.input.length) break;

      const char = this.current();
      const line = this.line;
      const column = this.column;

      // 개행
      if (char === '\n') {
        this.tokens.push({
          type: TokenType.NEWLINE,
          value: '\n',
          line,
          column,
        });
        this.advance();
      }
      // 식별자 또는 키워드
      else if (this.isIdentifierStart(char)) {
        this.tokens.push(this.readIdentifier());
      }
      // 숫자
      else if (this.isDigit(char)) {
        this.tokens.push(this.readNumber());
      }
      // 문자열
      else if (char === '"' || char === "'") {
        this.tokens.push(this.readString(char));
      }
      // 연산자 및 기호
      else if (char === '+') {
        this.tokens.push({
          type: TokenType.PLUS,
          value: '+',
          line,
          column,
        });
        this.advance();
      }
      else if (char === '-' && this.peek() === '>') {
        this.tokens.push({
          type: TokenType.ARROW,
          value: '->',
          line,
          column,
        });
        this.advance();
        this.advance();
      }
      else if (char === '-') {
        this.tokens.push({
          type: TokenType.MINUS,
          value: '-',
          line,
          column,
        });
        this.advance();
      }
      else if (char === '*') {
        this.tokens.push({
          type: TokenType.STAR,
          value: '*',
          line,
          column,
        });
        this.advance();
      }
      else if (char === '/') {
        this.tokens.push({
          type: TokenType.SLASH,
          value: '/',
          line,
          column,
        });
        this.advance();
      }
      else if (char === '%') {
        this.tokens.push({
          type: TokenType.PERCENT,
          value: '%',
          line,
          column,
        });
        this.advance();
      }
      else if (char === '=' && this.peek() === '=') {
        this.tokens.push({
          type: TokenType.EQ,
          value: '==',
          line,
          column,
        });
        this.advance();
        this.advance();
      }
      else if (char === '=') {
        this.tokens.push({
          type: TokenType.EQUAL,
          value: '=',
          line,
          column,
        });
        this.advance();
      }
      else if (char === '!' && this.peek() === '=') {
        this.tokens.push({
          type: TokenType.NE,
          value: '!=',
          line,
          column,
        });
        this.advance();
        this.advance();
      }
      else if (char === '!') {
        this.tokens.push({
          type: TokenType.NOT,
          value: '!',
          line,
          column,
        });
        this.advance();
      }
      else if (char === '<' && this.peek() === '=') {
        this.tokens.push({
          type: TokenType.LE,
          value: '<=',
          line,
          column,
        });
        this.advance();
        this.advance();
      }
      else if (char === '<') {
        this.tokens.push({
          type: TokenType.LT,
          value: '<',
          line,
          column,
        });
        this.advance();
      }
      else if (char === '>' && this.peek() === '=') {
        this.tokens.push({
          type: TokenType.GE,
          value: '>=',
          line,
          column,
        });
        this.advance();
        this.advance();
      }
      else if (char === '>') {
        this.tokens.push({
          type: TokenType.GT,
          value: '>',
          line,
          column,
        });
        this.advance();
      }
      else if (char === '&' && this.peek() === '&') {
        this.tokens.push({
          type: TokenType.AND,
          value: '&&',
          line,
          column,
        });
        this.advance();
        this.advance();
      }
      else if (char === '&') {
        this.tokens.push({
          type: TokenType.AMPERSAND,
          value: '&',
          line,
          column,
        });
        this.advance();
      }
      else if (char === '|' && this.peek() === '|') {
        this.tokens.push({
          type: TokenType.OR,
          value: '||',
          line,
          column,
        });
        this.advance();
        this.advance();
      }
      else if (char === '|') {
        this.tokens.push({
          type: TokenType.PIPE,
          value: '|',
          line,
          column,
        });
        this.advance();
      }
      else if (char === '(') {
        this.tokens.push({
          type: TokenType.LPAREN,
          value: '(',
          line,
          column,
        });
        this.advance();
      }
      else if (char === ')') {
        this.tokens.push({
          type: TokenType.RPAREN,
          value: ')',
          line,
          column,
        });
        this.advance();
      }
      else if (char === '{') {
        this.tokens.push({
          type: TokenType.LBRACE,
          value: '{',
          line,
          column,
        });
        this.advance();
      }
      else if (char === '}') {
        this.tokens.push({
          type: TokenType.RBRACE,
          value: '}',
          line,
          column,
        });
        this.advance();
      }
      else if (char === '[') {
        this.tokens.push({
          type: TokenType.LBRACKET,
          value: '[',
          line,
          column,
        });
        this.advance();
      }
      else if (char === ']') {
        this.tokens.push({
          type: TokenType.RBRACKET,
          value: ']',
          line,
          column,
        });
        this.advance();
      }
      else if (char === ':') {
        this.tokens.push({
          type: TokenType.COLON,
          value: ':',
          line,
          column,
        });
        this.advance();
      }
      else if (char === ';') {
        this.tokens.push({
          type: TokenType.SEMICOLON,
          value: ';',
          line,
          column,
        });
        this.advance();
      }
      else if (char === ',') {
        this.tokens.push({
          type: TokenType.COMMA,
          value: ',',
          line,
          column,
        });
        this.advance();
      }
      else if (char === '.' && this.peek() === '.' && this.peek(2) === '=') {
        this.tokens.push({
          type: TokenType.RANGE_INCLUSIVE,
          value: '..=',
          line,
          column,
        });
        this.advance();
        this.advance();
        this.advance();
      }
      else if (char === '.' && this.peek() === '.') {
        this.tokens.push({
          type: TokenType.RANGE,
          value: '..',
          line,
          column,
        });
        this.advance();
        this.advance();
      }
      else if (char === '.') {
        this.tokens.push({
          type: TokenType.DOT,
          value: '.',
          line,
          column,
        });
        this.advance();
      }
      else {
        // 알 수 없는 문자 스킵
        this.advance();
      }
    }

    // EOF 토큰 추가
    this.tokens.push({
      type: TokenType.EOF,
      value: '',
      line: this.line,
      column: this.column,
    });

    return this.tokens;
  }
}
