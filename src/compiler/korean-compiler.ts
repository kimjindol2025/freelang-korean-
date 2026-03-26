/**
 * K-FreeLang Compiler - Complete Pipeline
 * Lexer → Parser → Semantic Analyzer → Code Generator
 */

import { KoreanLexer } from './korean-lexer';
import { KoreanParser } from './korean-parser';
import { SemanticAnalyzer, SemanticErrors } from './korean-semantic';
import { CodeGenerator } from './korean-codegen';
import * as AST from './korean-ast';

export interface CompilationResult {
  success: boolean;
  tokens?: any[];
  ast?: AST.Program;
  semanticErrors?: SemanticErrors;
  code?: string;
  errors: string[];
}

export class KoreanCompiler {
  private debug: boolean = false;

  constructor(debug: boolean = false) {
    this.debug = debug;
  }

  /**
   * 전체 컴파일 파이프라인
   */
  compile(code: string): CompilationResult {
    const result: CompilationResult = {
      success: false,
      errors: []
    };

    try {
      // ==================== Stage 1: Lexing ====================
      if (this.debug) console.log('[Lexer] Tokenizing code...');

      const lexer = new KoreanLexer(code);
      const tokens = lexer.tokenize();

      if (this.debug) console.log(`[Lexer] ✓ Generated ${tokens.length} tokens`);

      result.tokens = tokens;

      // ==================== Stage 2: Parsing ====================
      if (this.debug) console.log('[Parser] Building AST...');

      const parser = new KoreanParser(code);
      const ast = parser.parse();

      if (this.debug) console.log(`[Parser] ✓ Generated AST with ${ast.statements.length} statements`);

      result.ast = ast;

      // ==================== Stage 3: Semantic Analysis ====================
      if (this.debug) console.log('[Semantic Analyzer] Checking types and symbols...');

      const analyzer = new SemanticAnalyzer();
      const semanticErrors = analyzer.analyze(ast);

      if (this.debug) {
        if (semanticErrors.hasErrors) {
          console.log(`[Semantic Analyzer] ✗ Found ${semanticErrors.errors.length} errors`);
          semanticErrors.errors.forEach(err => console.log(`  - ${err}`));
        } else {
          console.log(`[Semantic Analyzer] ✓ No errors`);
        }
      }

      result.semanticErrors = semanticErrors;

      if (semanticErrors.hasErrors) {
        result.errors = semanticErrors.errors;
        return result;
      }

      // ==================== Stage 4: Code Generation ====================
      if (this.debug) console.log('[Code Generator] Generating JavaScript...');

      const codegen = new CodeGenerator();
      const generatedCode = codegen.generate(ast);

      if (this.debug) {
        console.log(`[Code Generator] ✓ Generated ${generatedCode.split('\n').length} lines of code`);
      }

      result.code = generatedCode;
      result.success = true;

      return result;
    } catch (error: any) {
      result.errors.push(error.message);
      if (this.debug) console.error('[Compiler Error]', error.message);
      return result;
    }
  }

  /**
   * 컴파일하고 즉시 실행
   */
  execute(code: string): any {
    const result = this.compile(code);

    if (!result.success || !result.code) {
      throw new Error(`Compilation failed:\n${result.errors.join('\n')}`);
    }

    // JavaScript 코드 실행
    try {
      // eslint-disable-next-line no-eval
      return eval(result.code);
    } catch (e: any) {
      throw new Error(`Runtime error: ${e.message}`);
    }
  }

  /**
   * 컴파일 결과 출력 (디버그용)
   */
  printResult(result: CompilationResult): void {
    console.log('\n========== Compilation Result ==========\n');

    if (result.success) {
      console.log('✅ Compilation succeeded!\n');
      console.log('Generated JavaScript Code:');
      console.log('----------------------------');
      console.log(result.code);
      console.log('----------------------------\n');
    } else {
      console.log('❌ Compilation failed!\n');
      console.log('Errors:');
      result.errors.forEach(err => console.log(`  - ${err}`));
    }
  }
}

export default KoreanCompiler;
