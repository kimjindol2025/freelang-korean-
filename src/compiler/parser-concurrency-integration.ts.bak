/**
 * K-FreeLang Parser - 동시성 구조 통합
 * parsePostfixExpression과 parseStatement에 추가
 */

import { Token, TokenType } from './korean-lexer';
import * as AST from './korean-ast';

/**
 * 주요 통합: Parser 클래스의 parseStatement()에 추가
 */
export class ConcurrencyParserIntegration {
  /**
   * parseStatement에 추가할 분기
   * 동시성 관련 키워드 처리
   */
  static parseStatementExtension(parser: any, token: Token): AST.Statement | null {
    switch (token.type) {
      case TokenType.LOCK:
        return parser.parseLockStatement();

      case TokenType.MUTEX:
        return parser.parseMutexDeclaration();

      case TokenType.SEMAPHORE:
        return parser.parseSemaphoreDeclaration();

      case TokenType.CHANNEL:
        return parser.parseChannelDeclaration();

      case TokenType.SELECT:
        return parser.parseSelectStatement();

      default:
        return null;
    }
  }

  /**
   * parsePostfixExpression에 추가할 메서드 호출 처리
   * 뮤텍스/세마포어 메서드 호출
   */
  static parseMethodCall(parser: any, object: AST.Expression): AST.Expression {
    // 메서드명 확인
    if (parser.current < parser.tokens.length) {
      const methodToken = parser.tokens[parser.current];

      // 뮤텍스 메서드
      if (methodToken.value === 'lock' || methodToken.value === '잠금') {
        return parser.parseMutexLock(object);
      }

      if (methodToken.value === 'unlock' || methodToken.value === '해제') {
        return parser.parseMutexUnlock(object);
      }

      // 세마포어 메서드
      if (methodToken.value === 'signal' || methodToken.value === '신호') {
        return parser.parseSemaphoreSignal(object);
      }

      if (methodToken.value === 'wait' || methodToken.value === '대기') {
        return parser.parseSemaphoreWait(object);
      }

      // 채널 메서드
      if (methodToken.type === TokenType.SEND || methodToken.value === '<-') {
        return parser.parseChannelSend(object);
      }
    }

    return object;
  }

  /**
   * parseExpression에 추가: 채널 수신 처리
   * 값 <- 채널 형태
   */
  static parseChannelReceiveAssignment(parser: any, variable: AST.Expression): AST.Expression {
    if (parser.check(TokenType.SEND)) {  // SEND = <-
      parser.advance();
      const channel = parser.parseExpression();

      return {
        type: 'ChannelReceive',
        channel,
        line: variable.line,
        column: variable.column
      };
    }

    return variable;
  }

  /**
   * 동시성 AST 노드를 Expression 타입에 추가
   */
  static extendExpressionUnion(): void {
    // korean-ast.ts의 Expression 유니온 타입에 추가:
    // | MutexLock
    // | MutexUnlock
    // | SemaphoreSignal
    // | SemaphoreWait
    // | ChannelSend
    // | ChannelReceive
    // | ScopedMutex
  }

  /**
   * 동시성 Statement 노드를 Statement 타입에 추가
   */
  static extendStatementUnion(): void {
    // korean-ast.ts의 Statement 유니온 타입에 추가:
    // | LockStatement
    // | MutexDeclaration
    // | SemaphoreDeclaration
    // | ChannelDeclaration
    // | SelectStatement
  }
}

/**
 * 렉서에 추가할 토큰 타입
 */
export const ConcurrencyTokens = {
  LOCK: 'LOCK',           // 락
  MUTEX: 'MUTEX',         // 뮤텍스
  SEMAPHORE: 'SEMAPHORE', // 세마포어
  CHANNEL: 'CHANNEL',     // 채널
  SELECT: 'SELECT',       // 선택
  CASE: 'CASE',           // 경우
  SEND: 'SEND',           // <- (채널 전송/수신)
  LOCK_CALL: 'LOCK_CALL', // .lock()
  UNLOCK_CALL: 'UNLOCK_CALL', // .unlock()
  SIGNAL_CALL: 'SIGNAL_CALL', // .signal()
  WAIT_CALL: 'WAIT_CALL'  // .wait()
};

/**
 * 렉서에 추가할 키워드
 */
export const ConcurrencyKeywords = {
  'lock': 'LOCK',
  '락': 'LOCK',
  'mutex': 'MUTEX',
  '뮤텍스': 'MUTEX',
  'semaphore': 'SEMAPHORE',
  '세마포어': 'SEMAPHORE',
  'channel': 'CHANNEL',
  '채널': 'CHANNEL',
  'select': 'SELECT',
  '선택': 'SELECT',
  'case': 'CASE',
  '경우': 'CASE',
  'locked': 'LOCKED',
  '잠김': 'LOCKED',
  'unlocked': 'UNLOCKED',
  '해제됨': 'UNLOCKED'
};

/**
 * 문법 규칙 추가
 *
 * K-FreeLang P3 문법 (Lock/Mutex/Channel):
 *
 * lock_statement:
 *     락 { statement* }
 *
 * mutex_declaration:
 *     뮤텍스 identifier { type_annotation? = expression? }
 *
 * semaphore_declaration:
 *     세마포어 identifier ( expression )
 *
 * channel_declaration:
 *     채널 identifier < type_annotation > ( expression )?
 *
 * scoped_mutex:
 *     잠금 ( expression ) { statement* }
 *
 * channel_send:
 *     expression <- expression
 *
 * channel_receive:
 *     expression <- channel
 *
 * select_statement:
 *     선택 {
 *         (경우 channel_operation -> statement*)+
 *     }
 *
 * mutex_lock:
 *     expression . 잠금 ( )
 *
 * mutex_unlock:
 *     expression . 해제 ( )
 *
 * semaphore_signal:
 *     expression . 신호 ( )
 *
 * semaphore_wait:
 *     expression . 대기 ( )
 */
export const ConcurrencyGrammarRules = `
// P3: Lock/Mutex/Channel/Semaphore 구조

// 1. Lock Statement
lock_statement -> '락' '{' statement* '}'

// 2. Mutex Declaration
mutex_declaration -> '뮤텍스' IDENTIFIER ('{' type_annotation? '=' expression? '}')?

// 3. Semaphore Declaration
semaphore_declaration -> '세마포어' IDENTIFIER '(' expression ')'

// 4. Channel Declaration
channel_declaration -> '채널' IDENTIFIER '<' type_annotation '>' ('(' expression ')')?

// 5. Scoped Mutex (RAII pattern)
scoped_mutex -> '잠금' '(' expression ')' '{' statement* '}'

// 6. Mutex Operations
mutex_lock -> expression '.' '잠금' '(' ')'
mutex_unlock -> expression '.' '해제' '(' ')'

// 7. Semaphore Operations
semaphore_signal -> expression '.' '신호' '(' ')'
semaphore_wait -> expression '.' '대기' '(' ')'

// 8. Channel Operations
channel_send -> expression '<-' expression
channel_receive -> expression '<-' expression

// 9. Select Statement
select_statement -> '선택' '{' select_case+ '}'
select_case -> '경우' (channel_op | 'default') '->' statement*
channel_op -> (channel_send | channel_receive)

// 10. 타입 확장 (제네릭)
// type_annotation += '뮤텍스<' type_annotation '>'
// type_annotation += '세마포어'
// type_annotation += '채널<' type_annotation '>'
`;

/**
 * 파서 통합 테스트 예제
 */
export const ConcurrencyParserExample = `
// Lock Statement
락 {
  공유변수 = 공유변수 + 1
}

// Mutex Declaration
뮤텍스 카운터 {
  숫자 = 0
}

// Semaphore
세마포어 신호 (1)

// Channel
채널 메시지<문자열>(100)

// Scoped Mutex (자동 lock/unlock)
잠금(카운터) {
  카운터.값 = 카운터.값 + 1
}

// Channel Send/Receive
메시지 <- "Hello"  // Send
변수 msg = <- 메시지  // Receive

// Select
선택 {
  경우 채널1 <- 값1 -> 처리1()
  경우 <- 채널2 -> 처리2()
  경우기본 -> 기본처리()
}

// Mutex Methods
카운터.잠금()
// 작업...
카운터.해제()

// Semaphore Methods
신호.신호()  // Increment
신호.대기()   // Decrement
`;

/**
 * 실행 시간 의미론 (코드젠 단계에서)
 *
 * Lock Statement:
 *   - JavaScript: 기본적으로 동기화 (자동)
 *   - Go: runtime.Mutex 사용
 *   - Rust: std::sync::Mutex
 *
 * Mutex:
 *   - JavaScript: 프로미스 기반 lock 큐
 *   - Go: sync.Mutex
 *   - Rust: parking_lot::Mutex
 *
 * Semaphore:
 *   - JavaScript: CountdownLatch or Semaphore library
 *   - Go: time/rate 또는 custom implementation
 *   - Rust: tokio::sync::Semaphore
 *
 * Channel:
 *   - JavaScript: EventEmitter 또는 RxJS Subject
 *   - Go: chan Type
 *   - Rust: tokio::sync::mpsc
 *
 * Select:
 *   - JavaScript: Promise.race() 또는 async generator
 *   - Go: select statement (native)
 *   - Rust: tokio::select! macro
 */
export const ConcurrencySemantics = {
  targets: {
    javascript: {
      lock: 'async lock queue',
      mutex: 'Promise-based mutual exclusion',
      semaphore: 'token-based counting',
      channel: 'EventEmitter or async iterator'
    },
    go: {
      lock: 'sync.Mutex',
      mutex: 'sync.Mutex with try pattern',
      semaphore: 'custom or golang.org/x/sync/semaphore',
      channel: 'chan<T>'
    },
    rust: {
      lock: 'std::sync::Mutex (or tokio async)',
      mutex: 'parking_lot::Mutex or tokio::sync::Mutex',
      semaphore: 'tokio::sync::Semaphore',
      channel: 'tokio::sync::mpsc or crossbeam-channel'
    }
  }
};
