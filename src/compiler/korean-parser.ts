/**
 * K-FreeLang Parser - Korean Language Support
 * Token 스트림을 AST로 변환
 */

import { Token, TokenType, KoreanLexer } from './korean-lexer';
import * as AST from './korean-ast';

export class KoreanParser {
  private tokens: Token[];
  private current: number = 0;

  constructor(code: string) {
    const lexer = new KoreanLexer(code);
    this.tokens = lexer.tokenize();
  }

  /**
   * 전체 프로그램 파싱
   */
  parse(): AST.Program {
    const statements: AST.Statement[] = [];

    while (!this.isAtEnd()) {
      this.skipNewlines(); // NEWLINE 토큰 무시
      if (this.isAtEnd()) break;

      const stmt = this.parseStatement();
      if (stmt) {
        statements.push(stmt);
      }
    }

    return {
      type: 'Program',
      statements,
      line: 1,
      column: 1
    };
  }

  /**
   * 문장 파싱
   */
  private parseStatement(): AST.Statement | null {
    this.skipNewlines();

    // 공개 (pub) 모디파이어 스킵
    let isPublic = false;
    if (this.check(TokenType.PUB)) {
      isPublic = true;
      this.advance();
      this.skipNewlines();
    }

    // Use statement
    if (this.check(TokenType.USE)) return this.parseUseStatement();

    // Module declaration
    if (this.check(TokenType.MOD)) return this.parseModuleDeclaration();

    // Function declaration
    if (this.check(TokenType.ASYNC) && this.peekAhead(1).type === TokenType.FN) {
      return this.parseAsyncFunctionDeclaration();
    }
    if (this.check(TokenType.FN)) return this.parseFunctionDeclaration();

    // Type declaration
    if (this.check(TokenType.TYPE)) return this.parseTypeDeclaration();

    // Enum declaration
    if (this.check(TokenType.ENUM)) return this.parseEnumDeclaration();

    // Trait declaration
    if (this.check(TokenType.TRAIT)) return this.parseTraitDeclaration();

    // Impl block
    if (this.check(TokenType.IMPL)) return this.parseImplBlock();

    // Namespace declaration
    if (this.check(TokenType.NAMESPACE)) return this.parseNamespaceDeclaration();

    // Extend declaration
    if (this.check(TokenType.EXTEND)) return this.parseExtendDeclaration();

    // Macro declaration
    if (this.check(TokenType.MACRO)) return this.parseMacroDeclaration();

    // Variable declaration
    if (this.check(TokenType.VAR)) return this.parseVariableDeclaration();

    // Constant declaration
    if (this.check(TokenType.CONST)) return this.parseConstantDeclaration();

    // If statement
    if (this.check(TokenType.IF)) return this.parseIfStatement();

    // For loop
    if (this.check(TokenType.FOR)) return this.parseForStatement();

    // While loop
    if (this.check(TokenType.WHILE)) return this.parseWhileStatement();

    // Return statement
    if (this.check(TokenType.RETURN)) return this.parseReturnStatement();

    // Throw statement
    if (this.check(TokenType.THROW)) return this.parseThrowStatement();

    // Try statement
    if (this.check(TokenType.TRY)) return this.parseTryStatement();

    // Expression statement
    return this.parseExpressionStatement();
  }

  /**
   * Use statement 파싱: 사용 모듈 = "경로"
   */
  private parseUseStatement(): AST.UseStatement {
    const useToken = this.advance();
    const moduleName = this.consume(TokenType.IDENTIFIER, '모듈명 필요').value;
    this.consume(TokenType.EQUAL, '= 필요');
    const path = this.consume(TokenType.STRING, '경로 문자열 필요').value;

    return {
      type: 'UseStatement',
      module: moduleName,
      path,
      line: useToken.line,
      column: useToken.column
    };
  }

  /**
   * Module declaration 파싱: 모듈 이름 { ... }
   */
  private parseModuleDeclaration(isPublic?: boolean): AST.ModuleDeclaration {
    const modToken = this.advance();

    const name = this.consume(TokenType.IDENTIFIER, '모듈명 필요').value;
    this.consume(TokenType.LBRACE, '{ 필요');
    this.skipNewlines();

    const body: AST.Statement[] = [];
    while (!this.check(TokenType.RBRACE) && !this.isAtEnd()) {
      this.skipNewlines();
      if (this.check(TokenType.RBRACE)) break;

      const stmt = this.parseStatement();
      if (stmt) body.push(stmt);
      this.skipNewlines();
    }

    this.consume(TokenType.RBRACE, '} 필요');

    return {
      type: 'ModuleDeclaration',
      name,
      body,
      isPublic,
      line: modToken.line,
      column: modToken.column
    };
  }

  /**
   * Function declaration 파싱: 함수 이름(params) -> 반환타입 { ... }
   */
  private parseFunctionDeclaration(): AST.FunctionDeclaration {
    const fnToken = this.advance();
    const name = this.consume(TokenType.IDENTIFIER, '함수명 필요').value;

    this.consume(TokenType.LPAREN, '( 필요');
    const parameters = this.parseParameters();
    this.consume(TokenType.RPAREN, ') 필요');

    this.consume(TokenType.ARROW, '-> 필요');
    const returnType = this.parseTypeAnnotation();

    const body = this.parseBlockStatement();

    return {
      type: 'FunctionDeclaration',
      name,
      parameters,
      returnType,
      body,
      line: fnToken.line,
      column: fnToken.column
    };
  }

  /**
   * Async function declaration 파싱
   */
  private parseAsyncFunctionDeclaration(): AST.AsyncFunctionDeclaration {
    const asyncToken = this.advance();
    this.consume(TokenType.FN, 'fn 필요');

    const name = this.consume(TokenType.IDENTIFIER, '함수명 필요').value;

    this.consume(TokenType.LPAREN, '( 필요');
    const parameters = this.parseParameters();
    this.consume(TokenType.RPAREN, ') 필요');

    this.consume(TokenType.ARROW, '-> 필요');
    const returnType = this.parseTypeAnnotation();

    const body = this.parseBlockStatement();

    return {
      type: 'AsyncFunctionDeclaration',
      name,
      parameters,
      returnType,
      body,
      line: asyncToken.line,
      column: asyncToken.column
    };
  }

  /**
   * Parameters 파싱: name: type, name: type, ...
   */
  private parseParameters(): AST.Parameter[] {
    const parameters: AST.Parameter[] = [];

    if (!this.check(TokenType.RPAREN)) {
      do {
        this.skipNewlines();
        const name = this.consume(TokenType.IDENTIFIER, '파라미터명 필요').value;
        this.consume(TokenType.COLON, ': 필요');
        const typeAnnotation = this.parseTypeAnnotation();

        parameters.push({
          type: 'Parameter',
          name,
          typeAnnotation,
          line: this.peek().line,
          column: this.peek().column
        });

        this.skipNewlines();
        if (!this.check(TokenType.RPAREN)) {
          this.consume(TokenType.COMMA, ', 필요');
          this.skipNewlines();
        }
      } while (!this.check(TokenType.RPAREN) && !this.isAtEnd());
    }

    return parameters;
  }

  /**
   * Type annotation 파싱: 숫자, 문자열, 배열<숫자>, 등등
   */
  private parseTypeAnnotation(): AST.TypeAnnotation {
    const token = this.advance();

    if (token.type !== TokenType.IDENTIFIER) {
      throw new Error(`타입 필요, 받은 것: ${token.value}`);
    }

    let typeAnnotation: AST.TypeAnnotation = {
      type: 'TypeAnnotation',
      name: token.value,
      line: token.line,
      column: token.column
    };

    // Check for generic type: 배열<T>, 맵<K,V>
    if (this.check(TokenType.LT)) {
      this.advance();

      if (token.value === '배열' || token.value === 'array') {
        const elementType = this.parseTypeAnnotation();
        typeAnnotation.isArray = true;
        typeAnnotation.elementType = elementType;
      } else if (token.value === '맵' || token.value === 'map') {
        const keyType = this.parseTypeAnnotation();
        this.consume(TokenType.COMMA, ', 필요');
        const valueType = this.parseTypeAnnotation();
        typeAnnotation.isMap = true;
        typeAnnotation.keyType = keyType;
        typeAnnotation.valueType = valueType;
      }

      this.consume(TokenType.GT, '> 필요');
    }

    return typeAnnotation;
  }

  /**
   * Type declaration 파싱: 타입 이름 = 정의
   */
  private parseTypeDeclaration(): AST.TypeDeclaration {
    const typeToken = this.advance();
    const name = this.consume(TokenType.IDENTIFIER, '타입명 필요').value;
    this.consume(TokenType.EQUAL, '= 필요');

    // Enum type
    if (this.check(TokenType.ENUM)) {
      this.advance();
      this.consume(TokenType.LBRACE, '{ 필요');
      this.skipNewlines();
      const variants: AST.EnumVariant[] = [];

      while (!this.check(TokenType.RBRACE) && !this.isAtEnd()) {
        this.skipNewlines();
        if (this.check(TokenType.RBRACE)) break;

        const variantName = this.consume(TokenType.IDENTIFIER, '열거 값 필요').value;
        const variant: AST.EnumVariant = {
          type: 'EnumVariant',
          name: variantName,
          line: this.peek().line,
          column: this.peek().column
        };
        variants.push(variant);

        this.skipNewlines();
        // 쉼표 또는 NEWLINE을 separator로 허용
        if (this.check(TokenType.COMMA)) {
          this.advance();
          this.skipNewlines();
        }
      }

      this.consume(TokenType.RBRACE, '} 필요');

      const enumDef: AST.EnumDef = {
        type: 'EnumDef',
        variants,
        line: typeToken.line,
        column: typeToken.column
      };

      return {
        type: 'TypeDeclaration',
        name,
        definition: enumDef,
        line: typeToken.line,
        column: typeToken.column
      };
    }

    // Struct type
    if (this.check(TokenType.LBRACE)) {
      this.advance();
      this.skipNewlines();
      const fields: AST.StructField[] = [];

      while (!this.check(TokenType.RBRACE) && !this.isAtEnd()) {
        this.skipNewlines();
        if (this.check(TokenType.RBRACE)) break;

        const fieldName = this.consume(TokenType.IDENTIFIER, '필드명 필요').value;
        this.consume(TokenType.COLON, ': 필요');
        const fieldType = this.parseTypeAnnotation();

        fields.push({
          type: 'StructField',
          name: fieldName,
          fieldType,
          line: this.peek().line,
          column: this.peek().column
        });

        this.skipNewlines();
        // 쉼표 또는 NEWLINE을 separator로 허용
        if (this.check(TokenType.COMMA)) {
          this.advance();
          this.skipNewlines();
        }
      }

      this.consume(TokenType.RBRACE, '} 필요');

      const structDef: AST.StructDef = {
        type: 'StructDef',
        fields,
        line: typeToken.line,
        column: typeToken.column
      };

      return {
        type: 'TypeDeclaration',
        name,
        definition: structDef,
        line: typeToken.line,
        column: typeToken.column
      };
    }

    // Type alias
    const targetType = this.parseTypeAnnotation();
    const aliasDef: AST.AliasDef = {
      type: 'AliasDef',
      targetType,
      line: typeToken.line,
      column: typeToken.column
    };

    return {
      type: 'TypeDeclaration',
      name,
      definition: aliasDef,
      line: typeToken.line,
      column: typeToken.column
    };
  }

  /**
   * Enum declaration 파싱: 열거형 이름 { ... }
   */
  private parseEnumDeclaration(): AST.EnumDeclaration {
    const enumToken = this.advance();
    const name = this.consume(TokenType.IDENTIFIER, '열거형명 필요').value;
    this.consume(TokenType.LBRACE, '{ 필요');
    this.skipNewlines();

    const variants: AST.EnumVariant[] = [];
    while (!this.check(TokenType.RBRACE) && !this.isAtEnd()) {
      this.skipNewlines();
      if (this.check(TokenType.RBRACE)) break;

      const variantName = this.consume(TokenType.IDENTIFIER, '열거 값 필요').value;
      let fields: AST.TypeAnnotation[] = [];

      // 열거형 variant에 데이터 타입 지원 (Ok(값: 문자열), Err(오류: 문자열))
      if (this.check(TokenType.LPAREN)) {
        this.advance();

        // 튜플 형식: Ok(문자열), Err(숫자, 문자열)
        if (!this.check(TokenType.RPAREN)) {
          fields.push(this.parseTypeAnnotation());

          while (this.check(TokenType.COMMA)) {
            this.advance();
            fields.push(this.parseTypeAnnotation());
          }
        }

        this.consume(TokenType.RPAREN, ') 필요');
      }

      const variant: AST.EnumVariant = {
        type: 'EnumVariant',
        name: variantName,
        fields: fields.length > 0 ? fields : undefined,
        line: this.peek().line,
        column: this.peek().column
      };
      variants.push(variant);

      this.skipNewlines();
      if (this.check(TokenType.COMMA)) {
        this.advance();
        this.skipNewlines();
      }
    }

    this.consume(TokenType.RBRACE, '} 필요');

    return {
      type: 'EnumDeclaration',
      name,
      variants,
      line: enumToken.line,
      column: enumToken.column
    };
  }

  /**
   * Trait declaration 파싱: 특성 이름 { 함수 선언들 ... }
   */
  private parseTraitDeclaration(): AST.TraitDeclaration {
    const traitToken = this.advance();
    const name = this.consume(TokenType.IDENTIFIER, '특성명 필요').value;
    this.consume(TokenType.LBRACE, '{ 필요');

    const methods: AST.FunctionSignature[] = [];
    while (!this.check(TokenType.RBRACE) && !this.isAtEnd()) {
      if (this.check(TokenType.FN)) {
        this.advance();
        const methodName = this.consume(TokenType.IDENTIFIER, '메서드명 필요').value;
        this.consume(TokenType.LPAREN, '( 필요');
        const parameters = this.parseParameters();
        this.consume(TokenType.RPAREN, ') 필요');
        this.consume(TokenType.ARROW, '-> 필요');
        const returnType = this.parseTypeAnnotation();

        methods.push({
          type: 'FunctionSignature',
          name: methodName,
          parameters,
          returnType,
          line: this.peek().line,
          column: this.peek().column
        });
      }
    }

    this.consume(TokenType.RBRACE, '} 필요');

    return {
      type: 'TraitDeclaration',
      name,
      methods,
      line: traitToken.line,
      column: traitToken.column
    };
  }

  /**
   * Impl block 파싱: impl Trait for Type { 함수 구현들 ... }
   * 또는: impl Type { 함수 구현들 ... }
   */
  private parseImplBlock(): AST.ImplBlock {
    const implToken = this.advance();
    let traitName = this.consume(TokenType.IDENTIFIER, '타입/특성명 필요').value;
    let forType: string | undefined;

    // "impl Trait for Type" 형식 지원
    if (this.check(TokenType.FOR)) {
      this.advance();
      forType = this.consume(TokenType.IDENTIFIER, '타입명 필요').value;
    }

    this.consume(TokenType.LBRACE, '{ 필요');

    const methods: AST.FunctionDeclaration[] = [];
    while (!this.check(TokenType.RBRACE) && !this.isAtEnd()) {
      this.skipNewlines();
      if (this.check(TokenType.RBRACE)) break;

      if (this.check(TokenType.FN)) {
        const fnDecl = this.parseFunctionDeclaration() as AST.FunctionDeclaration;
        methods.push(fnDecl);
      }
      this.skipNewlines();
    }

    this.consume(TokenType.RBRACE, '} 필요');

    return {
      type: 'ImplBlock',
      traitName,
      forType,
      methods,
      line: implToken.line,
      column: implToken.column
    };
  }

  /**
   * Namespace declaration 파싱: 이명공간 이름 { ... }
   */
  private parseNamespaceDeclaration(): AST.NamespaceDeclaration {
    const nsToken = this.advance();
    const name = this.consume(TokenType.IDENTIFIER, '이명공간명 필요').value;
    this.consume(TokenType.LBRACE, '{ 필요');

    const body: AST.Statement[] = [];
    while (!this.check(TokenType.RBRACE) && !this.isAtEnd()) {
      const stmt = this.parseStatement();
      if (stmt) body.push(stmt);
    }

    this.consume(TokenType.RBRACE, '} 필요');

    return {
      type: 'NamespaceDeclaration',
      name,
      body,
      line: nsToken.line,
      column: nsToken.column
    };
  }

  /**
   * Extend declaration 파싱: 확장 타입명 { 함수들 ... }
   */
  private parseExtendDeclaration(): AST.ExtendDeclaration {
    const extendToken = this.advance();
    const targetType = this.consume(TokenType.IDENTIFIER, '타입명 필요').value;
    this.consume(TokenType.LBRACE, '{ 필요');

    const methods: AST.FunctionDeclaration[] = [];
    while (!this.check(TokenType.RBRACE) && !this.isAtEnd()) {
      if (this.check(TokenType.FN)) {
        const fnDecl = this.parseFunctionDeclaration() as AST.FunctionDeclaration;
        methods.push(fnDecl);
      }
    }

    this.consume(TokenType.RBRACE, '} 필요');

    return {
      type: 'ExtendDeclaration',
      targetType,
      methods,
      line: extendToken.line,
      column: extendToken.column
    };
  }

  /**
   * Macro declaration 파싱: 매크로 이름(params) { ... }
   */
  private parseMacroDeclaration(): AST.MacroDeclaration {
    const macroToken = this.advance();
    const name = this.consume(TokenType.IDENTIFIER, '매크로명 필요').value;
    this.consume(TokenType.LPAREN, '( 필요');

    const parameters: string[] = [];
    while (!this.check(TokenType.RPAREN) && !this.isAtEnd()) {
      parameters.push(this.consume(TokenType.IDENTIFIER, '파라미터명 필요').value);
      if (!this.check(TokenType.RPAREN)) {
        this.consume(TokenType.COMMA, ', 필요');
      }
    }

    this.consume(TokenType.RPAREN, ') 필요');
    this.consume(TokenType.LBRACE, '{ 필요');

    const body: AST.Statement[] = [];
    while (!this.check(TokenType.RBRACE) && !this.isAtEnd()) {
      const stmt = this.parseStatement();
      if (stmt) body.push(stmt);
    }

    this.consume(TokenType.RBRACE, '} 필요');

    return {
      type: 'MacroDeclaration',
      name,
      parameters,
      body,
      line: macroToken.line,
      column: macroToken.column
    };
  }

  /**
   * Variable declaration 파싱: 변수 이름: 타입 = 값 또는 변수 이름 = 값
   */
  private parseVariableDeclaration(): AST.VariableDeclaration {
    const varToken = this.advance();
    const name = this.consume(TokenType.IDENTIFIER, '변수명 필요').value;

    let typeAnnotation: AST.TypeAnnotation | undefined;
    if (this.check(TokenType.COLON)) {
      this.advance();
      typeAnnotation = this.parseTypeAnnotation();
    }

    let initializer: AST.Expression | undefined;
    if (this.check(TokenType.EQUAL)) {
      this.advance();
      initializer = this.parseExpression();
    }

    return {
      type: 'VariableDeclaration',
      name,
      typeAnnotation,
      initializer,
      line: varToken.line,
      column: varToken.column
    };
  }

  /**
   * Constant declaration 파싱: 상수 이름: 타입 = 값 또는 상수 이름 = 값
   */
  private parseConstantDeclaration(): AST.ConstantDeclaration {
    const constToken = this.advance();
    const name = this.consume(TokenType.IDENTIFIER, '상수명 필요').value;

    let typeAnnotation: AST.TypeAnnotation | undefined;
    if (this.check(TokenType.COLON)) {
      this.advance();
      typeAnnotation = this.parseTypeAnnotation();
    }

    this.consume(TokenType.EQUAL, '= 필요');
    const initializer = this.parseExpression();

    return {
      type: 'ConstantDeclaration',
      name,
      typeAnnotation,
      initializer,
      line: constToken.line,
      column: constToken.column
    };
  }

  /**
   * If statement 파싱: 만약 조건 { ... } 아니면 { ... }
   */
  private parseIfStatement(): AST.IfStatement {
    const ifToken = this.advance();
    const condition = this.parseExpression();
    const thenBranch = this.parseBlockStatement();

    let elseBranch: AST.BlockStatement | AST.IfStatement | undefined;
    if (this.check(TokenType.ELSE)) {
      this.advance();
      if (this.check(TokenType.IF)) {
        elseBranch = this.parseIfStatement();
      } else {
        elseBranch = this.parseBlockStatement();
      }
    }

    return {
      type: 'IfStatement',
      condition,
      thenBranch,
      elseBranch,
      line: ifToken.line,
      column: ifToken.column
    };
  }

  /**
   * For loop 파싱: 반복 초기화; 조건; 업데이트 { ... }
   */
  private parseForStatement(): AST.ForStatement {
    const forToken = this.advance();
    this.consume(TokenType.LBRACE, '{ 필요');

    // 초기화, 조건, 업데이트 모두 선택사항
    let initializer: AST.VariableDeclaration | AST.Expression | undefined;
    let condition: AST.Expression | undefined;
    let update: AST.Expression | undefined;

    // 간단한 C-style for loop: 반복 i = 0; i < 10; i = i + 1 { ... }
    if (!this.check(TokenType.SEMICOLON)) {
      if (this.check(TokenType.VAR)) {
        initializer = this.parseVariableDeclaration();
      } else {
        initializer = this.parseExpression();
      }
    }

    if (this.check(TokenType.SEMICOLON)) {
      this.advance();

      if (!this.check(TokenType.SEMICOLON)) {
        condition = this.parseExpression();
      }

      if (this.check(TokenType.SEMICOLON)) {
        this.advance();
        if (!this.check(TokenType.LBRACE)) {
          update = this.parseExpression();
        }
      }
    }

    const body = this.parseBlockStatement();

    return {
      type: 'ForStatement',
      initializer,
      condition,
      update,
      body,
      line: forToken.line,
      column: forToken.column
    };
  }

  /**
   * While loop 파싱: 아직 미구현 - 나중에 추가
   */
  private parseWhileStatement(): AST.WhileStatement {
    const whileToken = this.advance();
    const condition = this.parseExpression();
    const body = this.parseBlockStatement();

    return {
      type: 'WhileStatement',
      condition,
      body,
      line: whileToken.line,
      column: whileToken.column
    };
  }

  /**
   * Return statement 파싱: 반환 값
   */
  private parseReturnStatement(): AST.ReturnStatement {
    const returnToken = this.advance();
    let value: AST.Expression | undefined;

    if (!this.check(TokenType.SEMICOLON) && !this.check(TokenType.RBRACE) && !this.isAtEnd()) {
      value = this.parseExpression();
    }

    return {
      type: 'ReturnStatement',
      value,
      line: returnToken.line,
      column: returnToken.column
    };
  }

  /**
   * Throw statement 파싱: 던지기 값
   */
  private parseThrowStatement(): AST.ThrowStatement {
    const throwToken = this.advance();
    const error = this.parseExpression();

    return {
      type: 'ThrowStatement',
      error,
      line: throwToken.line,
      column: throwToken.column
    };
  }

  /**
   * Try statement 파싱: 오류처리 { ... } 아니면 { ... }
   */
  private parseTryStatement(): AST.TryStatement {
    const tryToken = this.advance();
    const tryBlock = this.parseBlockStatement();

    let catchBlock: AST.BlockStatement | undefined;
    if (this.check(TokenType.ELSE)) {
      this.advance();
      catchBlock = this.parseBlockStatement();
    }

    return {
      type: 'TryStatement',
      tryBlock,
      catchBlock,
      line: tryToken.line,
      column: tryToken.column
    };
  }

  /**
   * Block statement 파싱: { 문장들... }
   */
  private parseBlockStatement(): AST.BlockStatement {
    const blockToken = this.peek();
    this.consume(TokenType.LBRACE, '{ 필요');
    this.skipNewlines();

    const statements: AST.Statement[] = [];
    while (!this.check(TokenType.RBRACE) && !this.isAtEnd()) {
      this.skipNewlines();
      if (this.check(TokenType.RBRACE)) break;

      const stmt = this.parseStatement();
      if (stmt) statements.push(stmt);
      this.skipNewlines();
    }

    this.consume(TokenType.RBRACE, '} 필요');

    return {
      type: 'BlockStatement',
      statements,
      line: blockToken.line,
      column: blockToken.column
    };
  }

  /**
   * Expression statement 파싱
   */
  private parseExpressionStatement(): AST.ExpressionStatement {
    const exprToken = this.peek();
    const expression = this.parseExpression();

    return {
      type: 'ExpressionStatement',
      expression,
      line: exprToken.line,
      column: exprToken.column
    };
  }

  /**
   * Expression 파싱 - 우선순위 기반
   */
  private parseExpression(): AST.Expression {
    return this.parseAssignment();
  }

  private parseAssignment(): AST.Expression {
    let expr = this.parseLogicalOr();

    if (this.check(TokenType.EQUAL)) {
      this.advance();
      const right = this.parseAssignment();
      // Assignment은 좌측이 식별자여야 함
      if (expr.type === 'Identifier' || expr.type === 'MemberExpression') {
        return {
          type: 'BinaryExpression',
          operator: '=',
          left: expr,
          right,
          line: expr.line,
          column: expr.column
        };
      }
    }

    return expr;
  }

  private parseLogicalOr(): AST.Expression {
    let expr = this.parseLogicalAnd();

    while (this.check(TokenType.OR)) {
      const opToken = this.advance();
      const right = this.parseLogicalAnd();
      expr = {
        type: 'BinaryExpression',
        operator: '||',
        left: expr,
        right,
        line: opToken.line,
        column: opToken.column
      };
    }

    return expr;
  }

  private parseLogicalAnd(): AST.Expression {
    let expr = this.parseComparison();

    while (this.check(TokenType.AND)) {
      const opToken = this.advance();
      const right = this.parseComparison();
      expr = {
        type: 'BinaryExpression',
        operator: '&&',
        left: expr,
        right,
        line: opToken.line,
        column: opToken.column
      };
    }

    return expr;
  }

  private parseComparison(): AST.Expression {
    let expr = this.parseAdditive();

    while (
      this.check(TokenType.LT) ||
      this.check(TokenType.LE) ||
      this.check(TokenType.GT) ||
      this.check(TokenType.GE) ||
      this.check(TokenType.EQ) ||
      this.check(TokenType.NE)
    ) {
      const opToken = this.advance();
      const right = this.parseAdditive();
      expr = {
        type: 'BinaryExpression',
        operator: opToken.value,
        left: expr,
        right,
        line: opToken.line,
        column: opToken.column
      };
    }

    return expr;
  }

  private parseAdditive(): AST.Expression {
    let expr = this.parseMultiplicative();

    while (this.check(TokenType.PLUS) || this.check(TokenType.MINUS)) {
      const opToken = this.advance();
      const right = this.parseMultiplicative();
      expr = {
        type: 'BinaryExpression',
        operator: opToken.value,
        left: expr,
        right,
        line: opToken.line,
        column: opToken.column
      };
    }

    return expr;
  }

  private parseMultiplicative(): AST.Expression {
    let expr = this.parseUnary();

    while (
      this.check(TokenType.STAR) ||
      this.check(TokenType.SLASH) ||
      this.check(TokenType.PERCENT)
    ) {
      const opToken = this.advance();
      const right = this.parseUnary();
      expr = {
        type: 'BinaryExpression',
        operator: opToken.value,
        left: expr,
        right,
        line: opToken.line,
        column: opToken.column
      };
    }

    return expr;
  }

  private parseUnary(): AST.Expression {
    if (this.check(TokenType.NOT) || this.check(TokenType.MINUS) || this.check(TokenType.PLUS)) {
      const opToken = this.advance();
      const operand = this.parseUnary();
      return {
        type: 'UnaryExpression',
        operator: opToken.value,
        operand,
        isPrefix: true,
        line: opToken.line,
        column: opToken.column
      };
    }

    return this.parsePostfix();
  }

  private parsePostfix(): AST.Expression {
    let expr = this.parsePrimary();

    while (true) {
      if (this.check(TokenType.LPAREN)) {
        // Function call
        this.advance();
        const args: AST.Expression[] = [];

        while (!this.check(TokenType.RPAREN) && !this.isAtEnd()) {
          args.push(this.parseExpression());
          if (!this.check(TokenType.RPAREN)) {
            this.consume(TokenType.COMMA, ', 필요');
          }
        }

        this.consume(TokenType.RPAREN, ') 필요');

        expr = {
          type: 'CallExpression',
          callee: expr,
          arguments: args,
          line: this.peek().line,
          column: this.peek().column
        };
      } else if (this.check(TokenType.DOT)) {
        // Member access
        this.advance();
        const property = this.consume(TokenType.IDENTIFIER, '속성명 필요').value;

        expr = {
          type: 'MemberExpression',
          object: expr,
          property,
          isComputed: false,
          line: this.peek().line,
          column: this.peek().column
        };
      } else if (this.check(TokenType.LBRACKET)) {
        // Array/map access
        this.advance();
        const index = this.parseExpression();
        this.consume(TokenType.RBRACKET, '] 필요');

        expr = {
          type: 'MemberExpression',
          object: expr,
          property: index,
          isComputed: true,
          line: this.peek().line,
          column: this.peek().column
        };
      } else {
        break;
      }
    }

    return expr;
  }

  private parsePrimary(): AST.Expression {
    const token = this.peek();

    // Literal
    if (this.check(TokenType.NUMBER)) {
      this.advance();
      return {
        type: 'Literal',
        value: Number(token.value),
        literalType: 'number',
        line: token.line,
        column: token.column
      };
    }

    if (this.check(TokenType.STRING)) {
      this.advance();
      return {
        type: 'Literal',
        value: token.value,
        literalType: 'string',
        line: token.line,
        column: token.column
      };
    }

    // Identifier
    if (this.check(TokenType.IDENTIFIER)) {
      this.advance();
      return {
        type: 'Identifier',
        name: token.value,
        isKorean: token.korean,
        line: token.line,
        column: token.column
      };
    }

    // Parenthesized expression
    if (this.check(TokenType.LPAREN)) {
      this.advance();
      const expr = this.parseExpression();
      this.consume(TokenType.RPAREN, ') 필요');
      return expr;
    }

    // Array literal
    if (this.check(TokenType.LBRACKET)) {
      this.advance();
      const elements: AST.Expression[] = [];

      while (!this.check(TokenType.RBRACKET) && !this.isAtEnd()) {
        elements.push(this.parseExpression());
        if (!this.check(TokenType.RBRACKET)) {
          this.consume(TokenType.COMMA, ', 필요');
        }
      }

      this.consume(TokenType.RBRACKET, '] 필요');

      return {
        type: 'ArrayLiteral',
        elements,
        line: token.line,
        column: token.column
      };
    }

    // Object literal
    if (this.check(TokenType.LBRACE)) {
      this.advance();
      const properties: AST.ObjectProperty[] = [];

      while (!this.check(TokenType.RBRACE) && !this.isAtEnd()) {
        const key = this.consume(TokenType.IDENTIFIER, '키 필요').value;
        this.consume(TokenType.COLON, ': 필요');
        const value = this.parseExpression();

        properties.push({
          type: 'ObjectProperty',
          key,
          value,
          line: this.peek().line,
          column: this.peek().column
        });

        if (!this.check(TokenType.RBRACE)) {
          this.consume(TokenType.COMMA, ', 필요');
        }
      }

      this.consume(TokenType.RBRACE, '} 필요');

      return {
        type: 'ObjectLiteral',
        properties,
        line: token.line,
        column: token.column
      };
    }

    // Await expression
    if (this.check(TokenType.AWAIT)) {
      this.advance();
      const expr = this.parseExpression();
      return {
        type: 'AwaitExpression',
        expression: expr,
        line: token.line,
        column: token.column
      };
    }

    // Match expression (조건 value { 패턴 ... })
    if (this.check(TokenType.MATCH)) {
      return this.parseMatchExpression();
    }

    throw new Error(
      `예상치 못한 토큰: ${token.value} (${token.type}) at line ${token.line}:${token.column}`
    );
  }

  /**
   * Match expression 파싱: 조건 표현식 { 패턴 ... → body ... }
   */
  private parseMatchExpression(): AST.MatchExpression {
    const matchToken = this.advance(); // consume MATCH (조건)
    const expression = this.parseExpression();
    this.consume(TokenType.LBRACE, '{ 필요');

    const arms: AST.MatchArm[] = [];
    while (!this.check(TokenType.RBRACE) && !this.isAtEnd()) {
      this.skipNewlines();

      // Parse pattern (패턴 ... 또는 직접 패턴)
      if (this.check(TokenType.PATTERN)) {
        this.advance(); // consume PATTERN keyword
      }

      const pattern = this.parsePattern();

      // Optional guard (만약 조건)
      let guard: AST.Expression | undefined;
      if (this.check(TokenType.IF)) {
        this.advance();
        guard = this.parseExpression();
      }

      // Consume arrow (→ 또는 =>)
      this.consume(TokenType.ARROW, '→ 필요');

      // Parse body (expression or block)
      const body = this.check(TokenType.LBRACE)
        ? this.parseBlockStatement()
        : this.parseExpression();

      arms.push({
        type: 'MatchArm',
        pattern,
        guard,
        body,
        line: matchToken.line,
        column: matchToken.column
      });

      if (!this.check(TokenType.RBRACE)) {
        this.skipNewlines();
      }
    }

    this.consume(TokenType.RBRACE, '} 필요');

    return {
      type: 'MatchExpression',
      expression,
      arms,
      line: matchToken.line,
      column: matchToken.column
    };
  }

  /**
   * Pattern 파싱: identifier, literal, range, wildcard, or pattern
   */
  private parsePattern(): AST.Pattern {
    const token = this.peek();

    // Wildcard pattern (_)
    if (this.check(TokenType.UNDERSCORE)) {
      this.advance();
      return {
        type: 'WildcardPattern',
        line: token.line,
        column: token.column
      };
    }

    // Range pattern (1..10)
    if (this.check(TokenType.NUMBER)) {
      const startToken = this.advance();
      const startValue = Number(startToken.value);

      if (this.check(TokenType.DOTDOT)) {
        this.advance();
        const endToken = this.consume(TokenType.NUMBER, '숫자 필요');
        const endValue = Number(endToken.value);

        return {
          type: 'RangePattern',
          start: startValue,
          end: endValue,
          line: token.line,
          column: token.column
        };
      }

      // Just a literal pattern
      return {
        type: 'LiteralPattern',
        value: startValue,
        line: token.line,
        column: token.column
      };
    }

    // String or identifier pattern
    if (this.check(TokenType.STRING)) {
      const strToken = this.advance();
      return {
        type: 'LiteralPattern',
        value: strToken.value,
        line: token.line,
        column: token.column
      };
    }

    if (this.check(TokenType.IDENTIFIER)) {
      const idToken = this.advance();
      const name = idToken.value;

      // Check for or pattern (pattern1 | pattern2)
      if (this.check(TokenType.OR)) {
        const patterns: AST.Pattern[] = [
          {
            type: 'IdentifierPattern',
            name,
            line: token.line,
            column: token.column
          }
        ];

        while (this.check(TokenType.OR)) {
          this.advance();
          this.skipNewlines();
          const nextId = this.consume(TokenType.IDENTIFIER, '식별자 필요').value;
          patterns.push({
            type: 'IdentifierPattern',
            name: nextId,
            line: this.peek().line,
            column: this.peek().column
          });
        }

        return {
          type: 'OrPattern',
          patterns,
          line: token.line,
          column: token.column
        };
      }

      return {
        type: 'IdentifierPattern',
        name,
        line: token.line,
        column: token.column
      };
    }

    throw new Error(
      `패턴 예상: ${token.value} at line ${token.line}:${token.column}`
    );
  }

  // ===================== Helper Methods =====================

  private skipNewlines(): void {
    while (this.check(TokenType.NEWLINE) && !this.isAtEnd()) {
      this.advance();
    }
  }

  private peek(): Token {
    return this.tokens[this.current];
  }

  private peekAhead(n: number): Token {
    if (this.current + n >= this.tokens.length) {
      return this.tokens[this.tokens.length - 1]; // EOF
    }
    return this.tokens[this.current + n];
  }

  private advance(): Token {
    if (!this.isAtEnd()) {
      this.current++;
    }
    return this.tokens[this.current - 1];
  }

  private isAtEnd(): boolean {
    return this.peek().type === TokenType.EOF;
  }

  private check(type: TokenType): boolean {
    if (this.isAtEnd()) return false;
    return this.peek().type === type;
  }

  private consume(type: TokenType, message: string): Token {
    if (this.check(type)) {
      return this.advance();
    }

    const token = this.peek();
    throw new Error(
      `${message} at line ${token.line}:${token.column}, 받은 것: ${token.value} (${token.type})`
    );
  }
}

export default KoreanParser;
