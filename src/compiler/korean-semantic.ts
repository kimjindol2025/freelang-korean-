/**
 * K-FreeLang Semantic Analyzer
 * AST 검증: 타입 체킹, 심볼 테이블, 스코프 관리
 */

import * as AST from './korean-ast';

// ===================== Symbol Table =====================

export interface Symbol {
  name: string;
  type: 'variable' | 'function' | 'type' | 'trait' | 'module' | 'namespace' | 'macro';
  valueType?: Type;
  scope: number;
  isMutable?: boolean;
  isPublic?: boolean;
  line: number;
  column: number;
}

export interface FunctionSymbol extends Symbol {
  parameterTypes: Type[];
  returnType: Type;
}

export class SymbolTable {
  private symbols: Map<string, Symbol[]> = new Map();
  private currentScope: number = 0;

  define(symbol: Symbol): void {
    const name = symbol.name;
    const scope = symbol.scope;

    if (!this.symbols.has(name)) {
      this.symbols.set(name, []);
    }

    const symbolList = this.symbols.get(name)!;

    // 같은 스코프에서 재정의 확인
    if (symbolList.some(s => s.scope === scope)) {
      throw new Error(`심볼 재정의: ${name} at line ${symbol.line}`);
    }

    symbolList.push(symbol);
  }

  lookup(name: string, currentScope: number): Symbol | null {
    const symbolList = this.symbols.get(name);
    if (!symbolList) return null;

    // 현재 스코프에서 가장 가까운 심볼 찾기
    for (let i = symbolList.length - 1; i >= 0; i--) {
      if (symbolList[i].scope <= currentScope) {
        return symbolList[i];
      }
    }

    return null;
  }

  enterScope(): number {
    return ++this.currentScope;
  }

  exitScope(): void {
    // 현재 스코프의 심볼들 제거
    for (const [name, symbolList] of this.symbols) {
      const filtered = symbolList.filter(s => s.scope !== this.currentScope);
      if (filtered.length === 0) {
        this.symbols.delete(name);
      } else {
        this.symbols.set(name, filtered);
      }
    }
    this.currentScope--;
  }

  getCurrentScope(): number {
    return this.currentScope;
  }
}

// ===================== Type System =====================

export type Type =
  | PrimitiveType
  | ArrayType
  | MapType
  | StructType
  | EnumType
  | FunctionType
  | UnionType;

export interface PrimitiveType {
  kind: 'primitive';
  name: string; // '숫자', '문자열', '참거짓', '공집합'
}

export interface ArrayType {
  kind: 'array';
  elementType: Type;
}

export interface MapType {
  kind: 'map';
  keyType: Type;
  valueType: Type;
}

export interface StructType {
  kind: 'struct';
  name: string;
  fields: Map<string, Type>;
}

export interface EnumType {
  kind: 'enum';
  name: string;
  variants: string[];
}

export interface FunctionType {
  kind: 'function';
  parameterTypes: Type[];
  returnType: Type;
}

export interface UnionType {
  kind: 'union';
  types: Type[];
}

export class TypeChecker {
  private symbolTable: SymbolTable;
  private definedTypes: Map<string, Type> = new Map();
  private errors: string[] = [];

  constructor() {
    this.symbolTable = new SymbolTable();
    this.initializePrimitiveTypes();
  }

  private initializePrimitiveTypes(): void {
    const primitives: PrimitiveType[] = [
      { kind: 'primitive', name: '숫자' },
      { kind: 'primitive', name: 'number' },
      { kind: 'primitive', name: '문자열' },
      { kind: 'primitive', name: 'string' },
      { kind: 'primitive', name: '참거짓' },
      { kind: 'primitive', name: 'bool' },
      { kind: 'primitive', name: '공집합' },
      { kind: 'primitive', name: 'void' }
    ];

    for (const prim of primitives) {
      this.definedTypes.set(prim.name, prim);
    }
  }

  /**
   * 프로그램 검증
   */
  check(program: AST.Program): SemanticErrors {
    this.errors = [];

    try {
      for (const statement of program.statements) {
        this.checkStatement(statement);
      }
    } catch (e: any) {
      this.errors.push(e.message);
    }

    return {
      hasErrors: this.errors.length > 0,
      errors: this.errors
    };
  }

  /**
   * 문장 검증
   */
  private checkStatement(stmt: AST.Statement): void {
    switch (stmt.type) {
      case 'VariableDeclaration':
        this.checkVariableDeclaration(stmt as AST.VariableDeclaration);
        break;
      case 'ConstantDeclaration':
        this.checkConstantDeclaration(stmt as AST.ConstantDeclaration);
        break;
      case 'FunctionDeclaration':
        this.checkFunctionDeclaration(stmt as AST.FunctionDeclaration);
        break;
      case 'TypeDeclaration':
        this.checkTypeDeclaration(stmt as AST.TypeDeclaration);
        break;
      case 'IfStatement':
        this.checkIfStatement(stmt as AST.IfStatement);
        break;
      case 'ForStatement':
        this.checkForStatement(stmt as AST.ForStatement);
        break;
      case 'ReturnStatement':
        this.checkReturnStatement(stmt as AST.ReturnStatement);
        break;
      case 'ExpressionStatement':
        this.checkExpressionStatement(stmt as AST.ExpressionStatement);
        break;
      case 'ModuleDeclaration':
        this.checkModuleDeclaration(stmt as AST.ModuleDeclaration);
        break;
      case 'TraitDeclaration':
        this.checkTraitDeclaration(stmt as AST.TraitDeclaration);
        break;
      case 'NamespaceDeclaration':
        this.checkNamespaceDeclaration(stmt as AST.NamespaceDeclaration);
        break;
      // ... 다른 statement 타입들
    }
  }

  private checkVariableDeclaration(stmt: AST.VariableDeclaration): void {
    let declaredType: Type | undefined;

    // 타입 지정이 있으면 확인
    if (stmt.typeAnnotation) {
      declaredType = this.annotationToType(stmt.typeAnnotation);
    }

    // 초기화 값이 있으면 타입 체크
    if (stmt.initializer) {
      const initType = this.checkExpression(stmt.initializer);

      if (declaredType && !this.isCompatible(initType, declaredType)) {
        this.error(
          `타입 불일치: '${stmt.name}' 변수에 ${this.typeToString(initType)}를 할당할 수 없음 (예상: ${this.typeToString(declaredType)})`
        );
      }

      if (!declaredType) {
        declaredType = initType;
      }
    }

    // 심볼 테이블에 등록
    const symbol: Symbol = {
      name: stmt.name,
      type: 'variable',
      valueType: declaredType,
      scope: this.symbolTable.getCurrentScope(),
      isMutable: true,
      line: stmt.line,
      column: stmt.column
    };

    this.symbolTable.define(symbol);
  }

  private checkConstantDeclaration(stmt: AST.ConstantDeclaration): void {
    let declaredType: Type | undefined;

    // 타입 지정이 있으면 확인
    if (stmt.typeAnnotation) {
      declaredType = this.annotationToType(stmt.typeAnnotation);
    }

    // 초기화 값 체크 (필수)
    const initType = this.checkExpression(stmt.initializer);

    if (declaredType && !this.isCompatible(initType, declaredType)) {
      this.error(
        `타입 불일치: '${stmt.name}' 상수에 ${this.typeToString(initType)}를 할당할 수 없음 (예상: ${this.typeToString(declaredType)})`
      );
    }

    if (!declaredType) {
      declaredType = initType;
    }

    // 심볼 테이블에 등록
    const symbol: Symbol = {
      name: stmt.name,
      type: 'variable',
      valueType: declaredType,
      scope: this.symbolTable.getCurrentScope(),
      isMutable: false,
      line: stmt.line,
      column: stmt.column
    };

    this.symbolTable.define(symbol);
  }

  private checkFunctionDeclaration(stmt: AST.FunctionDeclaration): void {
    const returnType = this.annotationToType(stmt.returnType);
    const parameterTypes: Type[] = stmt.parameters.map(p => this.annotationToType(p.typeAnnotation));

    // 심볼 테이블에 함수 등록
    const funcSymbol: FunctionSymbol = {
      name: stmt.name,
      type: 'function',
      parameterTypes,
      returnType,
      scope: this.symbolTable.getCurrentScope(),
      isPublic: stmt.isPublic,
      line: stmt.line,
      column: stmt.column
    };

    this.symbolTable.define(funcSymbol);

    // 함수 본체 검증 (새로운 스코프)
    this.symbolTable.enterScope();

    // 파라미터들을 스코프에 추가
    for (let i = 0; i < stmt.parameters.length; i++) {
      const param = stmt.parameters[i];
      const paramSymbol: Symbol = {
        name: param.name,
        type: 'variable',
        valueType: parameterTypes[i],
        scope: this.symbolTable.getCurrentScope(),
        isMutable: param.isMutable,
        line: param.line,
        column: param.column
      };
      this.symbolTable.define(paramSymbol);
    }

    // 함수 본체 검증
    this.checkBlockStatement(stmt.body);

    this.symbolTable.exitScope();
  }

  private checkIfStatement(stmt: AST.IfStatement): void {
    const condType = this.checkExpression(stmt.condition);

    // 조건은 bool이어야 함
    if (!this.isBoolType(condType)) {
      this.error(`if 조건은 참거짓 타입이어야 함, 받은 것: ${this.typeToString(condType)}`);
    }

    this.checkBlockStatement(stmt.thenBranch);

    if (stmt.elseBranch) {
      if (stmt.elseBranch.type === 'BlockStatement') {
        this.checkBlockStatement(stmt.elseBranch);
      } else if (stmt.elseBranch.type === 'IfStatement') {
        this.checkIfStatement(stmt.elseBranch);
      }
    }
  }

  private checkForStatement(stmt: AST.ForStatement): void {
    this.symbolTable.enterScope();

    // 초기화
    if (stmt.initializer) {
      if (stmt.initializer.type === 'VariableDeclaration') {
        this.checkVariableDeclaration(stmt.initializer);
      } else {
        this.checkExpression(stmt.initializer as AST.Expression);
      }
    }

    // 조건
    if (stmt.condition) {
      const condType = this.checkExpression(stmt.condition);
      if (!this.isBoolType(condType)) {
        this.error(`for 조건은 참거짓 타입이어야 함`);
      }
    }

    // 업데이트
    if (stmt.update) {
      this.checkExpression(stmt.update);
    }

    // 본체
    this.checkBlockStatement(stmt.body);

    this.symbolTable.exitScope();
  }

  private checkReturnStatement(stmt: AST.ReturnStatement): void {
    if (stmt.value) {
      this.checkExpression(stmt.value);
    }
  }

  private checkExpressionStatement(stmt: AST.ExpressionStatement): void {
    this.checkExpression(stmt.expression);
  }

  private checkModuleDeclaration(stmt: AST.ModuleDeclaration): void {
    const symbol: Symbol = {
      name: stmt.name,
      type: 'module',
      scope: this.symbolTable.getCurrentScope(),
      isPublic: stmt.isPublic,
      line: stmt.line,
      column: stmt.column
    };

    this.symbolTable.define(symbol);

    // 모듈 본체 검증 (새로운 스코프)
    this.symbolTable.enterScope();

    for (const statement of stmt.body) {
      this.checkStatement(statement);
    }

    this.symbolTable.exitScope();
  }

  private checkTraitDeclaration(stmt: AST.TraitDeclaration): void {
    const symbol: Symbol = {
      name: stmt.name,
      type: 'trait',
      scope: this.symbolTable.getCurrentScope(),
      isPublic: stmt.isPublic,
      line: stmt.line,
      column: stmt.column
    };

    this.symbolTable.define(symbol);
  }

  private checkNamespaceDeclaration(stmt: AST.NamespaceDeclaration): void {
    const symbol: Symbol = {
      name: stmt.name,
      type: 'namespace',
      scope: this.symbolTable.getCurrentScope(),
      line: stmt.line,
      column: stmt.column
    };

    this.symbolTable.define(symbol);

    // 네임스페이스 본체 검증
    this.symbolTable.enterScope();

    for (const statement of stmt.body) {
      this.checkStatement(statement);
    }

    this.symbolTable.exitScope();
  }

  private checkTypeDeclaration(stmt: AST.TypeDeclaration): void {
    const type = this.definitionToType(stmt.definition, stmt.name);
    this.definedTypes.set(stmt.name, type);

    const symbol: Symbol = {
      name: stmt.name,
      type: 'type',
      valueType: type,
      scope: this.symbolTable.getCurrentScope(),
      isPublic: stmt.isPublic,
      line: stmt.line,
      column: stmt.column
    };

    this.symbolTable.define(symbol);
  }

  private checkBlockStatement(block: AST.BlockStatement): void {
    for (const stmt of block.statements) {
      this.checkStatement(stmt);
    }
  }

  /**
   * 식 검증 및 타입 반환
   */
  private checkExpression(expr: AST.Expression): Type {
    switch (expr.type) {
      case 'BinaryExpression':
        return this.checkBinaryExpression(expr as AST.BinaryExpression);
      case 'UnaryExpression':
        return this.checkUnaryExpression(expr as AST.UnaryExpression);
      case 'CallExpression':
        return this.checkCallExpression(expr as AST.CallExpression);
      case 'MemberExpression':
        return this.checkMemberExpression(expr as AST.MemberExpression);
      case 'Identifier':
        return this.checkIdentifier(expr as AST.Identifier);
      case 'Literal':
        return this.checkLiteral(expr as AST.Literal);
      case 'ArrayLiteral':
        return this.checkArrayLiteral(expr as AST.ArrayLiteral);
      case 'ObjectLiteral':
        return this.checkObjectLiteral(expr as AST.ObjectLiteral);
      default:
        return { kind: 'primitive', name: '공집합' }; // 기본값
    }
  }

  private checkBinaryExpression(expr: AST.BinaryExpression): Type {
    const leftType = this.checkExpression(expr.left);
    const rightType = this.checkExpression(expr.right);

    switch (expr.operator) {
      case '+':
      case '-':
      case '*':
      case '/':
      case '%':
        // 산술 연산자: 숫자 타입 필요
        if (!this.isNumberType(leftType) || !this.isNumberType(rightType)) {
          this.error(`산술 연산자 ${expr.operator}는 숫자 타입이 필요합니다`);
        }
        return { kind: 'primitive', name: '숫자' };

      case '==':
      case '!=':
      case '<':
      case '<=':
      case '>':
      case '>=':
        // 비교 연산자: 참거짓 반환
        if (!this.isCompatible(leftType, rightType)) {
          this.error(`비교 불가능한 타입: ${this.typeToString(leftType)} vs ${this.typeToString(rightType)}`);
        }
        return { kind: 'primitive', name: '참거짓' };

      case '&&':
      case '||':
        // 논리 연산자: 참거짓 필요
        if (!this.isBoolType(leftType) || !this.isBoolType(rightType)) {
          this.error(`논리 연산자는 참거짓 타입이 필요합니다`);
        }
        return { kind: 'primitive', name: '참거짓' };

      case '=':
        // 할당: 좌측이 우측과 호환되어야 함
        if (!this.isCompatible(rightType, leftType)) {
          this.error(`할당 불가능: ${this.typeToString(rightType)}를 ${this.typeToString(leftType)}에 할당할 수 없음`);
        }
        return rightType;

      default:
        return { kind: 'primitive', name: '공집합' };
    }
  }

  private checkUnaryExpression(expr: AST.UnaryExpression): Type {
    const operandType = this.checkExpression(expr.operand);

    switch (expr.operator) {
      case '!':
        if (!this.isBoolType(operandType)) {
          this.error(`! 연산자는 참거짓 타입이 필요합니다`);
        }
        return { kind: 'primitive', name: '참거짓' };

      case '-':
      case '+':
        if (!this.isNumberType(operandType)) {
          this.error(`${expr.operator} 연산자는 숫자 타입이 필요합니다`);
        }
        return operandType;

      default:
        return operandType;
    }
  }

  private checkCallExpression(expr: AST.CallExpression): Type {
    const calleeType = this.checkExpression(expr.callee);

    // 호출 대상이 함수여야 함
    if (calleeType.kind !== 'function') {
      this.error(`함수 타입이 아닌 식을 호출할 수 없습니다`);
      return { kind: 'primitive', name: '공집합' };
    }

    const funcType = calleeType as FunctionType;

    // 인수 개수 확인
    if (expr.arguments.length !== funcType.parameterTypes.length) {
      this.error(
        `함수 호출 인수 개수 불일치: 예상 ${funcType.parameterTypes.length}, 받은 것 ${expr.arguments.length}`
      );
    }

    // 인수 타입 확인
    for (let i = 0; i < expr.arguments.length; i++) {
      const argType = this.checkExpression(expr.arguments[i]);
      const paramType = funcType.parameterTypes[i];

      if (!this.isCompatible(argType, paramType)) {
        this.error(
          `인수 ${i + 1} 타입 불일치: ${this.typeToString(argType)} vs ${this.typeToString(paramType)}`
        );
      }
    }

    return funcType.returnType;
  }

  private checkMemberExpression(expr: AST.MemberExpression): Type {
    const objectType = this.checkExpression(expr.object);

    if (objectType.kind === 'struct') {
      const structType = objectType as StructType;
      const propertyName = expr.property as string;
      const fieldType = structType.fields.get(propertyName);

      if (!fieldType) {
        this.error(`구조체 '${structType.name}'에 필드 '${propertyName}'가 없습니다`);
        return { kind: 'primitive', name: '공집합' };
      }

      return fieldType;
    } else if (objectType.kind === 'array') {
      if (!expr.isComputed) {
        this.error(`배열은 인덱스 접근이 필요합니다`);
      }
      return (objectType as ArrayType).elementType;
    }

    return { kind: 'primitive', name: '공집합' };
  }

  private checkIdentifier(expr: AST.Identifier): Type {
    const symbol = this.symbolTable.lookup(expr.name, this.symbolTable.getCurrentScope());

    if (!symbol) {
      this.error(`정의되지 않은 식별자: ${expr.name}`);
      return { kind: 'primitive', name: '공집합' };
    }

    return symbol.valueType || { kind: 'primitive', name: '공집합' };
  }

  private checkLiteral(expr: AST.Literal): Type {
    switch (expr.literalType) {
      case 'number':
        return { kind: 'primitive', name: '숫자' };
      case 'string':
        return { kind: 'primitive', name: '문자열' };
      case 'boolean':
        return { kind: 'primitive', name: '참거짓' };
      case 'null':
        return { kind: 'primitive', name: '공집합' };
      default:
        return { kind: 'primitive', name: '공집합' };
    }
  }

  private checkArrayLiteral(expr: AST.ArrayLiteral): Type {
    if (expr.elements.length === 0) {
      // 빈 배열: 추론 불가능
      return { kind: 'array', elementType: { kind: 'primitive', name: '공집합' } };
    }

    const firstType = this.checkExpression(expr.elements[0]);

    // 모든 원소가 같은 타입인지 확인
    for (let i = 1; i < expr.elements.length; i++) {
      const elemType = this.checkExpression(expr.elements[i]);
      if (!this.isCompatible(elemType, firstType)) {
        this.error(`배열 원소 타입 불일치: ${this.typeToString(firstType)} vs ${this.typeToString(elemType)}`);
      }
    }

    return { kind: 'array', elementType: firstType };
  }

  private checkObjectLiteral(expr: AST.ObjectLiteral): Type {
    const fields = new Map<string, Type>();

    for (const prop of expr.properties) {
      const valueType = this.checkExpression(prop.value);
      fields.set(prop.key, valueType);
    }

    return {
      kind: 'struct',
      name: '익명_구조체',
      fields
    };
  }

  // ===================== Helper Methods =====================

  private annotationToType(annotation: AST.TypeAnnotation): Type {
    if (annotation.isArray) {
      return {
        kind: 'array',
        elementType: annotation.elementType ? this.annotationToType(annotation.elementType) : { kind: 'primitive', name: '공집합' }
      };
    }

    if (annotation.isMap) {
      return {
        kind: 'map',
        keyType: annotation.keyType ? this.annotationToType(annotation.keyType) : { kind: 'primitive', name: '공집합' },
        valueType: annotation.valueType ? this.annotationToType(annotation.valueType) : { kind: 'primitive', name: '공집합' }
      };
    }

    const definedType = this.definedTypes.get(annotation.name);
    if (definedType) {
      return definedType;
    }

    return { kind: 'primitive', name: annotation.name };
  }

  private definitionToType(def: AST.TypeDefinition, name: string): Type {
    if (def.type === 'StructDef') {
      const structDef = def as AST.StructDef;
      const fields = new Map<string, Type>();

      for (const field of structDef.fields) {
        fields.set(field.name, this.annotationToType(field.fieldType));
      }

      return { kind: 'struct', name, fields };
    } else if (def.type === 'EnumDef') {
      const enumDef = def as AST.EnumDef;
      return {
        kind: 'enum',
        name,
        variants: enumDef.variants.map(v => v.name)
      };
    } else {
      // AliasDef
      const aliasDef = def as AST.AliasDef;
      return this.annotationToType(aliasDef.targetType);
    }
  }

  private isNumberType(type: Type): boolean {
    return type.kind === 'primitive' && (type.name === '숫자' || type.name === 'number');
  }

  private isBoolType(type: Type): boolean {
    return type.kind === 'primitive' && (type.name === '참거짓' || type.name === 'bool');
  }

  private isCompatible(fromType: Type, toType: Type): boolean {
    // 같은 타입
    if (JSON.stringify(fromType) === JSON.stringify(toType)) {
      return true;
    }

    // 기본 타입 호환성
    if (fromType.kind === 'primitive' && toType.kind === 'primitive') {
      const fromName = fromType.name;
      const toName = toType.name;

      // 영문/한글 매핑
      const aliases: { [key: string]: string[] } = {
        '숫자': ['number'],
        '문자열': ['string'],
        '참거짓': ['bool'],
        '공집합': ['void']
      };

      for (const [korean, englishList] of Object.entries(aliases)) {
        if ((fromName === korean || englishList.includes(fromName)) &&
            (toName === korean || englishList.includes(toName))) {
          return true;
        }
      }
    }

    return false;
  }

  private typeToString(type: Type): string {
    switch (type.kind) {
      case 'primitive':
        return (type as PrimitiveType).name;
      case 'array':
        return `배열<${this.typeToString((type as ArrayType).elementType)}>`;
      case 'map':
        const mapType = type as MapType;
        return `맵<${this.typeToString(mapType.keyType)}, ${this.typeToString(mapType.valueType)}>`;
      case 'struct':
        return `구조체_${(type as StructType).name}`;
      case 'enum':
        return `열거형_${(type as EnumType).name}`;
      case 'function':
        const funcType = type as FunctionType;
        const params = funcType.parameterTypes.map(t => this.typeToString(t)).join(', ');
        return `함수(${params}) -> ${this.typeToString(funcType.returnType)}`;
      default:
        return 'unknown';
    }
  }

  private error(message: string): void {
    this.errors.push(message);
  }
}

// ===================== Result Types =====================

export interface SemanticErrors {
  hasErrors: boolean;
  errors: string[];
}

export class SemanticAnalyzer {
  analyze(program: AST.Program): SemanticErrors {
    const typeChecker = new TypeChecker();
    return typeChecker.check(program);
  }
}
