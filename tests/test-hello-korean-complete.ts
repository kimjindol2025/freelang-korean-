/**
 * hello-korean-complete.free 완전 컴파일 테스트
 */

import { KoreanCompiler } from '../src/compiler/korean-compiler';
import * as fs from 'fs';
import * as path from 'path';

describe('hello-korean-complete.free - 완전 컴파일', () => {

  test('파일 로드 및 컴파일', () => {
    const filePath = path.join(__dirname, '../examples/hello-korean-complete.free');

    if (!fs.existsSync(filePath)) {
      console.warn('⚠️  파일 없음:', filePath);
      return;
    }

    const code = fs.readFileSync(filePath, 'utf-8');
    console.log(`\n📄 소스 코드: ${code.split('\n').length} 줄`);

    const compiler = new KoreanCompiler();
    const result = compiler.compile(code);

    console.log('\n========== 컴파일 결과 ==========');
    console.log(`✅ 성공: ${result.success}`);
    console.log(`📊 토큰: ${result.tokens?.length || 0}`);
    console.log(`📊 AST: ${result.ast?.statements.length || 0} 문장`);
    console.log(`📊 생성 코드: ${result.code?.split('\n').length || 0} 줄`);

    if (!result.success) {
      console.log(`\n❌ 에러 (${result.errors.length}개):`);
      result.errors.forEach(err => console.log(`  - ${err}`));
    }

    expect(result.success).toBe(true);
    expect(result.ast).toBeDefined();
    expect(result.code).toBeDefined();
    expect(result.ast!.statements.length).toBeGreaterThan(0);
  });

  test('생성된 코드 구조 검증', () => {
    const filePath = path.join(__dirname, '../examples/hello-korean-complete.free');

    if (!fs.existsSync(filePath)) {
      return;
    }

    const code = fs.readFileSync(filePath, 'utf-8');
    const compiler = new KoreanCompiler();
    const result = compiler.compile(code);

    expect(result.code).toContain('function');
    expect(result.code).toContain('const');
    expect(result.code).toContain('return');
  });

  test('주요 키워드 포함 확인', () => {
    const filePath = path.join(__dirname, '../examples/hello-korean-complete.free');

    if (!fs.existsSync(filePath)) {
      return;
    }

    const code = fs.readFileSync(filePath, 'utf-8');

    // 원본 코드 검증
    expect(code).toContain('사용');
    expect(code).toContain('모듈');
    expect(code).toContain('함수');
    expect(code).toContain('변수');
    expect(code).toContain('상수');
  });
});
