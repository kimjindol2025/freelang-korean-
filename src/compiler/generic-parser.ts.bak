/**
 * K-FreeLang Parser - 제네릭 타입 지원
 * Generic<T>, Generic<T, U>, 타입 바인딩, 타입 경계
 */

import { Token, TokenType } from './korean-lexer';
import * as AST from './korean-ast';

/**
 * 제네릭 타입 파라미터 파싱
 * 예: <T>, <T: Trait>, <T, U: Clone>, <'a>
 */
export function parseGenericParameters(parser: any): AST.GenericParameter[] {
  const params: AST.GenericParameter[] = [];

  if (!parser.check(TokenType.LT)) {
    return params;
  }

  parser.advance(); // consume <

  while (!parser.check(TokenType.GT) && !parser.isAtEnd()) {
    // Lifetime 파라미터 (Rust-like): 'a, 'b
    if (parser.check(TokenType.LIFETIME)) {
      const lifetimeToken = parser.advance();
      params.push({
        type: 'LifetimeParameter',
        name: lifetimeToken.value.substring(1), // 'a → a
        bounds: [],
        line: lifetimeToken.line,
        column: lifetimeToken.column
      });
    } else {
      // 일반 타입 파라미터: T, T: Bound
      const nameToken = parser.advance();
      const name = nameToken.value;
      const bounds: AST.TypeAnnotation[] = [];

      // 타입 경계 파싱: T: Display + Clone
      if (parser.check(TokenType.COLON)) {
        parser.advance(); // consume :

        do {
          bounds.push(parser.parseTypeAnnotation());

          if (parser.check(TokenType.PLUS)) {
            parser.advance(); // consume +
          } else {
            break;
          }
        } while (!parser.check(TokenType.COMMA) && !parser.check(TokenType.GT));
      }

      params.push({
        type: 'TypeParameter',
        name,
        bounds,
        variance: 'covariant',
        line: nameToken.line,
        column: nameToken.column
      });
    }

    // 다음 파라미터
    if (parser.check(TokenType.COMMA)) {
      parser.advance();
    } else if (parser.check(TokenType.GT)) {
      break;
    } else {
      parser.error('쉼표 또는 > 필요');
    }
  }

  parser.consume(TokenType.GT, '> 필요');

  return params;
}

/**
 * 제네릭 함수 선언 파싱
 * 예: 함수<T> foo(x: T) → T
 */
export function parseGenericFunctionDeclaration(parser: any): AST.GenericFunctionDeclaration {
  const fnToken = parser.advance(); // consume 함수

  // 제네릭 파라미터
  const typeParams = parseGenericParameters(parser);

  // 함수명
  const nameToken = parser.advance();
  const name = nameToken.value;

  // 파라미터
  parser.consume(TokenType.LPAREN, '( 필요');
  const params: AST.Parameter[] = [];

  while (!parser.check(TokenType.RPAREN) && !parser.isAtEnd()) {
    const paramName = parser.advance().value;
    parser.consume(TokenType.COLON, ': 필요');
    const paramType = parser.parseTypeAnnotation();

    params.push({
      name: paramName,
      type: paramType,
      isVariadic: false
    });

    if (parser.check(TokenType.COMMA)) {
      parser.advance();
    }
  }

  parser.consume(TokenType.RPAREN, ') 필요');

  // 반환 타입
  parser.consume(TokenType.ARROW, '→ 필요');
  const returnType = parser.parseTypeAnnotation();

  // 함수 본문
  const body = parser.parseBlockStatement();

  return {
    type: 'GenericFunctionDeclaration',
    name,
    typeParameters: typeParams,
    parameters: params,
    returnType,
    body,
    line: fnToken.line,
    column: fnToken.column
  };
}

/**
 * 제네릭 구조체 선언 파싱
 * 예: 구조체<T> Box { 값: T }
 */
export function parseGenericStructDeclaration(parser: any): AST.GenericStructDeclaration {
  const structToken = parser.advance(); // consume 구조체

  // 제네릭 파라미터
  const typeParams = parseGenericParameters(parser);

  // 구조체명
  const nameToken = parser.advance();
  const name = nameToken.value;

  parser.consume(TokenType.LBRACE, '{ 필요');

  const fields: AST.StructField[] = [];

  while (!parser.check(TokenType.RBRACE) && !parser.isAtEnd()) {
    const fieldName = parser.advance().value;
    parser.consume(TokenType.COLON, ': 필요');
    const fieldType = parser.parseTypeAnnotation();

    fields.push({
      name: fieldName,
      type: fieldType,
      isPublic: true
    });

    if (parser.check(TokenType.COMMA)) {
      parser.advance();
    }
  }

  parser.consume(TokenType.RBRACE, '} 필요');

  return {
    type: 'GenericStructDeclaration',
    name,
    typeParameters: typeParams,
    fields,
    line: structToken.line,
    column: structToken.column
  };
}

/**
 * 제네릭 특성(Trait) 선언 파싱
 * 예: 특성<T> Iterator { ... }
 */
export function parseGenericTraitDeclaration(parser: any): AST.GenericTraitDeclaration {
  const traitToken = parser.advance(); // consume 특성

  // 제네릭 파라미터
  const typeParams = parseGenericParameters(parser);

  // 특성명
  const nameToken = parser.advance();
  const name = nameToken.value;

  // 상위 특성 (supertraits)
  let supertraits: string[] = [];
  if (parser.check(TokenType.COLON)) {
    parser.advance();
    do {
      const traitName = parser.advance().value;
      supertraits.push(traitName);
      if (parser.check(TokenType.PLUS)) {
        parser.advance();
      } else {
        break;
      }
    } while (true);
  }

  parser.consume(TokenType.LBRACE, '{ 필요');

  const methods: AST.MethodSignature[] = [];

  while (!parser.check(TokenType.RBRACE) && !parser.isAtEnd()) {
    if (parser.check(TokenType.FN)) {
      parser.advance(); // consume 함수

      const methodName = parser.advance().value;
      parser.consume(TokenType.LPAREN, '( 필요');

      const methodParams: AST.Parameter[] = [];

      while (!parser.check(TokenType.RPAREN)) {
        const paramName = parser.advance().value;
        parser.consume(TokenType.COLON, ': 필요');
        const paramType = parser.parseTypeAnnotation();

        methodParams.push({
          name: paramName,
          type: paramType,
          isVariadic: false
        });

        if (parser.check(TokenType.COMMA)) {
          parser.advance();
        }
      }

      parser.consume(TokenType.RPAREN, ') 필요');
      parser.consume(TokenType.ARROW, '→ 필요');
      const returnType = parser.parseTypeAnnotation();

      methods.push({
        name: methodName,
        parameters: methodParams,
        returnType
      });

      parser.consume(TokenType.SEMICOLON, '; 필요');
    }
  }

  parser.consume(TokenType.RBRACE, '} 필요');

  return {
    type: 'GenericTraitDeclaration',
    name,
    typeParameters: typeParams,
    supertraits,
    methods,
    line: traitToken.line,
    column: traitToken.column
  };
}

/**
 * 제네릭 타입 인스턴스화 파싱
 * 예: Box<숫자>, HashMap<문자열, 숫자>
 */
export function parseGenericTypeInstantiation(parser: any, baseName: string): AST.GenericType {
  if (!parser.check(TokenType.LT)) {
    return {
      type: 'GenericType',
      name: baseName,
      typeArguments: [],
      line: 0,
      column: 0
    };
  }

  const ltToken = parser.current;
  parser.advance(); // consume <

  const typeArgs: AST.TypeAnnotation[] = [];

  while (!parser.check(TokenType.GT) && !parser.isAtEnd()) {
    typeArgs.push(parser.parseTypeAnnotation());

    if (parser.check(TokenType.COMMA)) {
      parser.advance();
    } else if (parser.check(TokenType.GT)) {
      break;
    }
  }

  parser.consume(TokenType.GT, '> 필요');

  return {
    type: 'GenericType',
    name: baseName,
    typeArguments: typeArgs,
    line: ltToken.line,
    column: ltToken.column
  };
}

/**
 * Where 절 파싱 (타입 경계 상세 지정)
 * 예: where T: Display, U: Clone + Send
 */
export function parseWhereClause(parser: any): AST.WhereBound[] {
  if (!parser.check(TokenType.WHERE)) {
    return [];
  }

  parser.advance(); // consume where

  const bounds: AST.WhereBound[] = [];

  do {
    const paramName = parser.advance().value;
    parser.consume(TokenType.COLON, ': 필요');

    const traitBounds: string[] = [];

    do {
      traitBounds.push(parser.advance().value);

      if (parser.check(TokenType.PLUS)) {
        parser.advance();
      } else {
        break;
      }
    } while (true);

    bounds.push({
      typeParam: paramName,
      traitBounds
    });

    if (parser.check(TokenType.COMMA)) {
      parser.advance();
    } else {
      break;
    }
  } while (!parser.check(TokenType.LBRACE) && !parser.isAtEnd());

  return bounds;
}

/**
 * AST 노드 정의 (korean-ast.ts에 추가)
 */

declare global {
  namespace AST {
    interface TypeParameter extends ASTNode {
      type: 'TypeParameter';
      name: string;
      bounds: TypeAnnotation[];
      variance: 'covariant' | 'contravariant' | 'invariant';
    }

    interface LifetimeParameter extends ASTNode {
      type: 'LifetimeParameter';
      name: string;
      bounds: string[];
    }

    interface GenericParameter extends ASTNode {
      type: 'TypeParameter' | 'LifetimeParameter';
      name: string;
      bounds?: TypeAnnotation[] | string[];
    }

    interface GenericFunctionDeclaration extends ASTNode {
      type: 'GenericFunctionDeclaration';
      name: string;
      typeParameters: GenericParameter[];
      parameters: Parameter[];
      returnType: TypeAnnotation;
      body: BlockStatement;
    }

    interface GenericStructDeclaration extends ASTNode {
      type: 'GenericStructDeclaration';
      name: string;
      typeParameters: GenericParameter[];
      fields: StructField[];
    }

    interface GenericTraitDeclaration extends ASTNode {
      type: 'GenericTraitDeclaration';
      name: string;
      typeParameters: GenericParameter[];
      supertraits: string[];
      methods: MethodSignature[];
    }

    interface GenericType extends ASTNode {
      type: 'GenericType';
      name: string;
      typeArguments: TypeAnnotation[];
    }

    interface WhereBound {
      typeParam: string;
      traitBounds: string[];
    }

    interface MethodSignature {
      name: string;
      parameters: Parameter[];
      returnType: TypeAnnotation;
    }
  }
}

// 내보내기
export {
  parseGenericParameters,
  parseGenericFunctionDeclaration,
  parseGenericStructDeclaration,
  parseGenericTraitDeclaration,
  parseGenericTypeInstantiation,
  parseWhereClause
};
