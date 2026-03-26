/**
 * K-FreeLang Code Generator
 * AST를 JavaScript 코드로 변환
 */

import * as AST from './korean-ast';

export class CodeGenerator {
  private output: string = '';
  private indentLevel: number = 0;
  private functionContext: Map<string, AST.FunctionDeclaration | AST.AsyncFunctionDeclaration> = new Map();
  private variableContext: Set<string> = new Set();

  /**
   * 프로그램을 JavaScript로 생성
   */
  generate(program: AST.Program): string {
    this.output = '';
    this.indentLevel = 0;

    // 기본 라이브러리 함수 정의
    this.emitBuiltins();

    // 프로그램 문장들 생성
    for (const statement of program.statements) {
      this.emitStatement(statement);
    }

    return this.output;
  }

  /**
   * 기본 내장 함수들
   */
  private emitBuiltins(): void {
    this.emit(`
// K-FreeLang Built-in Functions
const __freelang = {
  출력: function(...args) {
    console.log(...args.map(v => v === null ? '' : v));
  },

  타입: function(value) {
    if (value === null) return '공집합';
    if (typeof value === 'number') return '숫자';
    if (typeof value === 'string') return '문자열';
    if (typeof value === 'boolean') return '참거짓';
    if (Array.isArray(value)) return '배열';
    return '객체';
  },

  길이: function(value) {
    if (Array.isArray(value) || typeof value === 'string') {
      return value.length;
    }
    return 0;
  },

  푸시: function(arr, value) {
    arr.push(value);
    return arr;
  },

  팝: function(arr) {
    return arr.pop();
  },

  슬라이스: function(arr, start, end) {
    return arr.slice(start, end);
  },

  조인: function(arr, separator) {
    return arr.join(separator);
  }
};

// Alias for common function calls
const 출력 = __freelang.출력;
const 타입 = __freelang.타입;

`);
  }

  /**
   * 문장 생성
   */
  private emitStatement(stmt: AST.Statement): void {
    switch (stmt.type) {
      case 'VariableDeclaration':
        this.emitVariableDeclaration(stmt as AST.VariableDeclaration);
        break;
      case 'ConstantDeclaration':
        this.emitConstantDeclaration(stmt as AST.ConstantDeclaration);
        break;
      case 'FunctionDeclaration':
        this.emitFunctionDeclaration(stmt as AST.FunctionDeclaration);
        break;
      case 'AsyncFunctionDeclaration':
        this.emitAsyncFunctionDeclaration(stmt as AST.AsyncFunctionDeclaration);
        break;
      case 'ReturnStatement':
        this.emitReturnStatement(stmt as AST.ReturnStatement);
        break;
      case 'IfStatement':
        this.emitIfStatement(stmt as AST.IfStatement);
        break;
      case 'ForStatement':
        this.emitForStatement(stmt as AST.ForStatement);
        break;
      case 'WhileStatement':
        this.emitWhileStatement(stmt as AST.WhileStatement);
        break;
      case 'ExpressionStatement':
        this.emitExpressionStatement(stmt as AST.ExpressionStatement);
        break;
      case 'UseStatement':
        this.emitUseStatement(stmt as AST.UseStatement);
        break;
      case 'ModuleDeclaration':
        this.emitModuleDeclaration(stmt as AST.ModuleDeclaration);
        break;
      case 'TypeDeclaration':
        // 타입 선언은 코드 생성 불필요 (컴파일 타임 전용)
        break;
      case 'TryStatement':
        this.emitTryStatement(stmt as AST.TryStatement);
        break;
      case 'ThrowStatement':
        this.emitThrowStatement(stmt as AST.ThrowStatement);
        break;
      default:
        // 다른 statement 타입은 무시
        break;
    }
  }

  private emitVariableDeclaration(stmt: AST.VariableDeclaration): void {
    this.emit(`let ${stmt.name}`);

    if (stmt.initializer) {
      this.emit(` = `);
      this.emitExpression(stmt.initializer);
    }

    this.emit(`;`);
    this.emitNewline();
  }

  private emitConstantDeclaration(stmt: AST.ConstantDeclaration): void {
    this.emit(`const ${stmt.name} = `);
    this.emitExpression(stmt.initializer);
    this.emit(`;`);
    this.emitNewline();
  }

  private emitFunctionDeclaration(stmt: AST.FunctionDeclaration): void {
    this.functionContext.set(stmt.name, stmt);

    const params = stmt.parameters.map(p => p.name).join(', ');
    this.emit(`function ${stmt.name}(${params}) {`);
    this.emitNewline();

    this.indentLevel++;
    this.emitBlockStatement(stmt.body);
    this.indentLevel--;

    this.emit(`}`);
    this.emitNewline();
    this.emitNewline();
  }

  private emitAsyncFunctionDeclaration(stmt: AST.AsyncFunctionDeclaration): void {
    this.functionContext.set(stmt.name, stmt);

    const params = stmt.parameters.map(p => p.name).join(', ');
    this.emit(`async function ${stmt.name}(${params}) {`);
    this.emitNewline();

    this.indentLevel++;
    this.emitBlockStatement(stmt.body);
    this.indentLevel--;

    this.emit(`}`);
    this.emitNewline();
    this.emitNewline();
  }

  private emitReturnStatement(stmt: AST.ReturnStatement): void {
    this.emit(`return`);

    if (stmt.value) {
      this.emit(` `);
      this.emitExpression(stmt.value);
    }

    this.emit(`;`);
    this.emitNewline();
  }

  private emitIfStatement(stmt: AST.IfStatement): void {
    this.emit(`if (`);
    this.emitExpression(stmt.condition);
    this.emit(`) {`);
    this.emitNewline();

    this.indentLevel++;
    this.emitBlockStatement(stmt.thenBranch);
    this.indentLevel--;

    if (stmt.elseBranch) {
      this.emit(`} else `);

      if (stmt.elseBranch.type === 'IfStatement') {
        // else if
        this.backspace(); // 제거: }
        this.backspace(); // 제거: newline
        this.emit(`if (`);
        this.emitExpression((stmt.elseBranch as AST.IfStatement).condition);
        this.emit(`) {`);
        this.emitNewline();
        this.indentLevel++;
        this.emitBlockStatement((stmt.elseBranch as AST.IfStatement).thenBranch);
        this.indentLevel--;
        this.emit(`}`);
      } else {
        // else
        this.emit(`{`);
        this.emitNewline();
        this.indentLevel++;
        this.emitBlockStatement(stmt.elseBranch as AST.BlockStatement);
        this.indentLevel--;
        this.emit(`}`);
      }
    }

    this.emitNewline();
  }

  private emitForStatement(stmt: AST.ForStatement): void {
    this.emit(`for (`);

    if (stmt.initializer) {
      if (stmt.initializer.type === 'VariableDeclaration') {
        const varDecl = stmt.initializer as AST.VariableDeclaration;
        this.emit(`let ${varDecl.name}`);
        if (varDecl.initializer) {
          this.emit(` = `);
          this.emitExpression(varDecl.initializer);
        }
      } else {
        this.emitExpression(stmt.initializer as AST.Expression);
      }
    }

    this.emit(`; `);

    if (stmt.condition) {
      this.emitExpression(stmt.condition);
    }

    this.emit(`; `);

    if (stmt.update) {
      this.emitExpression(stmt.update);
    }

    this.emit(`) {`);
    this.emitNewline();

    this.indentLevel++;
    this.emitBlockStatement(stmt.body);
    this.indentLevel--;

    this.emit(`}`);
    this.emitNewline();
  }

  private emitWhileStatement(stmt: AST.WhileStatement): void {
    this.emit(`while (`);
    this.emitExpression(stmt.condition);
    this.emit(`) {`);
    this.emitNewline();

    this.indentLevel++;
    this.emitBlockStatement(stmt.body);
    this.indentLevel--;

    this.emit(`}`);
    this.emitNewline();
  }

  private emitExpressionStatement(stmt: AST.ExpressionStatement): void {
    this.emitExpression(stmt.expression);
    this.emit(`;`);
    this.emitNewline();
  }

  private emitUseStatement(stmt: AST.UseStatement): void {
    // 모듈 임포트: use 모듈이름 = "경로"
    // JavaScript로: const 모듈이름 = require("경로") 또는 동적 로드
    this.emit(`const ${stmt.module} = (() => {`);
    this.emitNewline();
    this.indentLevel++;

    // 경로 검증 및 동적 로드
    this.emit(`try {`);
    this.emitNewline();
    this.indentLevel++;

    // 파일 경로 표준화 (상대경로 → ./ 추가)
    const path = stmt.path.startsWith('.') ? stmt.path : `./${stmt.path}`;
    this.emit(`return require('${path}');`);
    this.emitNewline();

    this.indentLevel--;
    this.emit(`} catch (error) {`);
    this.emitNewline();
    this.indentLevel++;

    this.emit(`console.error('모듈 로드 실패: ${stmt.module} (${path})', error);`);
    this.emitNewline();
    this.emit(`return {};`);
    this.emitNewline();

    this.indentLevel--;
    this.emit(`}`);
    this.emitNewline();

    this.indentLevel--;
    this.emit(`})();`);
    this.emitNewline();
  }

  private emitModuleDeclaration(stmt: AST.ModuleDeclaration): void {
    this.emit(`const ${stmt.name} = {`);
    this.emitNewline();

    this.indentLevel++;

    for (const statement of stmt.body) {
      if (statement.type === 'FunctionDeclaration') {
        const fnDecl = statement as AST.FunctionDeclaration;
        const params = fnDecl.parameters.map(p => p.name).join(', ');
        this.emit(`${fnDecl.name}: function(${params}) {`);
        this.emitNewline();

        this.indentLevel++;
        this.emitBlockStatement(fnDecl.body);
        this.indentLevel--;

        this.emit(`},`);
        this.emitNewline();
      } else if (statement.type === 'VariableDeclaration') {
        const varDecl = statement as AST.VariableDeclaration;
        this.emit(`${varDecl.name}: `);
        if (varDecl.initializer) {
          this.emitExpression(varDecl.initializer);
        }
        this.emit(`,`);
        this.emitNewline();
      }
    }

    this.indentLevel--;
    this.emit(`};`);
    this.emitNewline();
    this.emitNewline();
  }

  private emitTryStatement(stmt: AST.TryStatement): void {
    this.emit(`try {`);
    this.emitNewline();

    this.indentLevel++;
    this.emitBlockStatement(stmt.tryBlock);
    this.indentLevel--;

    if (stmt.catchBlock) {
      this.emit(`} catch (error) {`);
      this.emitNewline();

      this.indentLevel++;
      this.emitBlockStatement(stmt.catchBlock);
      this.indentLevel--;
    }

    this.emit(`}`);
    this.emitNewline();
  }

  private emitThrowStatement(stmt: AST.ThrowStatement): void {
    this.emit(`throw `);
    this.emitExpression(stmt.error);
    this.emit(`;`);
    this.emitNewline();
  }

  private emitBlockStatement(block: AST.BlockStatement): void {
    for (const statement of block.statements) {
      this.emitStatement(statement);
    }
  }

  /**
   * 식 생성
   */
  private emitExpression(expr: AST.Expression): void {
    switch (expr.type) {
      case 'BinaryExpression':
        this.emitBinaryExpression(expr as AST.BinaryExpression);
        break;
      case 'UnaryExpression':
        this.emitUnaryExpression(expr as AST.UnaryExpression);
        break;
      case 'CallExpression':
        this.emitCallExpression(expr as AST.CallExpression);
        break;
      case 'MemberExpression':
        this.emitMemberExpression(expr as AST.MemberExpression);
        break;
      case 'Identifier':
        this.emitIdentifier(expr as AST.Identifier);
        break;
      case 'Literal':
        this.emitLiteral(expr as AST.Literal);
        break;
      case 'ArrayLiteral':
        this.emitArrayLiteral(expr as AST.ArrayLiteral);
        break;
      case 'ObjectLiteral':
        this.emitObjectLiteral(expr as AST.ObjectLiteral);
        break;
      case 'AwaitExpression':
        this.emitAwaitExpression(expr as AST.AwaitExpression);
        break;
      default:
        this.emit(`undefined`);
    }
  }

  private emitBinaryExpression(expr: AST.BinaryExpression): void {
    this.emitExpression(expr.left);
    this.emit(` ${expr.operator} `);
    this.emitExpression(expr.right);
  }

  private emitUnaryExpression(expr: AST.UnaryExpression): void {
    if (expr.isPrefix) {
      this.emit(`${expr.operator}`);
      this.emitExpression(expr.operand);
    } else {
      this.emitExpression(expr.operand);
      this.emit(`${expr.operator}`);
    }
  }

  private emitCallExpression(expr: AST.CallExpression): void {
    this.emitExpression(expr.callee);
    this.emit(`(`);

    for (let i = 0; i < expr.arguments.length; i++) {
      if (i > 0) this.emit(`, `);
      this.emitExpression(expr.arguments[i]);
    }

    this.emit(`)`);
  }

  private emitMemberExpression(expr: AST.MemberExpression): void {
    this.emitExpression(expr.object);

    if (expr.isComputed) {
      this.emit(`[`);
      this.emitExpression(expr.property as AST.Expression);
      this.emit(`]`);
    } else {
      // 빌트인 메서드 매핑: K-FreeLang → JavaScript
      const property = expr.property as string;
      const builtInMethods: { [key: string]: string } = {
        // 길이/크기 (배열, 문자열, 맵)
        'len': 'length',
        'size': 'length',

        // 배열 메서드 (K-FreeLang 이름 → JS 이름)
        '추가': 'push',
        '제거': 'pop',
        '첫제거': 'shift',
        '앞추가': 'unshift',
        '합치기': 'concat',
        '결합': 'join',
        '역순': 'reverse',
        '정렬': 'sort',
        '매핑': 'map',
        '필터': 'filter',
        '축약': 'reduce',
        '찾기': 'find',
        '포함': 'includes',
        '위치': 'indexOf',

        // 문자열 메서드
        '대문자': 'toUpperCase',
        '소문자': 'toLowerCase',
        '공백제거': 'trim',
        '부분': 'substring',
        '분할': 'split',
        '바꾸기': 'replace',
        '반복': 'repeat',
      };

      const mappedProperty = builtInMethods[property] || property;
      this.emit(`.${mappedProperty}`);
    }
  }

  private emitIdentifier(expr: AST.Identifier): void {
    this.emit(expr.name);
  }

  private emitLiteral(expr: AST.Literal): void {
    if (expr.literalType === 'string') {
      // 문자열 이스케이프 처리
      const escaped = String(expr.value)
        .replace(/\\/g, '\\\\')
        .replace(/"/g, '\\"')
        .replace(/\n/g, '\\n')
        .replace(/\t/g, '\\t');
      this.emit(`"${escaped}"`);
    } else if (expr.literalType === 'boolean') {
      // 참거짓 → true/false
      if (expr.value === 'true' || expr.value === '참') {
        this.emit(`true`);
      } else {
        this.emit(`false`);
      }
    } else if (expr.literalType === 'null') {
      this.emit(`null`);
    } else {
      // 숫자
      this.emit(String(expr.value));
    }
  }

  private emitArrayLiteral(expr: AST.ArrayLiteral): void {
    this.emit(`[`);

    for (let i = 0; i < expr.elements.length; i++) {
      if (i > 0) this.emit(`, `);
      this.emitExpression(expr.elements[i]);
    }

    this.emit(`]`);
  }

  private emitObjectLiteral(expr: AST.ObjectLiteral): void {
    this.emit(`{`);

    for (let i = 0; i < expr.properties.length; i++) {
      if (i > 0) this.emit(`, `);

      const prop = expr.properties[i];
      this.emit(`${prop.key}: `);
      this.emitExpression(prop.value);
    }

    this.emit(`}`);
  }

  private emitAwaitExpression(expr: AST.AwaitExpression): void {
    this.emit(`await `);
    this.emitExpression(expr.expression);
  }

  // ===================== Helper Methods =====================

  private emit(text: string): void {
    this.output += text;
  }

  private emitNewline(): void {
    this.output += '\n';
    this.output += '  '.repeat(this.indentLevel);
  }

  private backspace(): void {
    this.output = this.output.slice(0, -1);
  }
}

export default CodeGenerator;
