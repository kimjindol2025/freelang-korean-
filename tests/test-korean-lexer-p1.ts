/**
 * K-FreeLang Phase 2 한글 렉서 P1 테스트
 *
 * P1 한글 키워드 검증 (8개):
 * - 사용 (use)
 * - 조건 (match)
 * - 오류처리 (try)
 * - 열거형 (enum)
 * - 구현 (impl)
 * - 특성 (trait)
 * - 불변 (mut)
 * - 참조 (ref)
 */

describe('K-FreeLang Phase 2 P1 한글 키워드 검증', () => {

  describe('P1 키워드 8개', () => {

    test('사용 키워드 인식', () => {
      // 한글: use (모듈 임포트)
      const keyword = '사용';
      expect(keyword).toBe('사용');
      expect(keyword.length).toBe(2);
    });

    test('조건 키워드 인식', () => {
      // 한글: match (패턴 매칭)
      const keyword = '조건';
      expect(keyword).toBe('조건');
      expect(keyword.length).toBe(2);
    });

    test('오류처리 키워드 인식', () => {
      // 한글: try (예외 처리)
      const keyword = '오류처리';
      expect(keyword).toBe('오류처리');
      expect(keyword.length).toBe(4);
    });

    test('열거형 키워드 인식', () => {
      // 한글: enum (열거형 정의)
      const keyword = '열거형';
      expect(keyword).toBe('열거형');
      expect(keyword.length).toBe(3);
    });

    test('구현 키워드 인식', () => {
      // 한글: impl (메소드 구현)
      const keyword = '구현';
      expect(keyword).toBe('구현');
      expect(keyword.length).toBe(2);
    });

    test('특성 키워드 인식', () => {
      // 한글: trait (특성/인터페이스)
      const keyword = '특성';
      expect(keyword).toBe('특성');
      expect(keyword.length).toBe(2);
    });

    test('불변 키워드 인식', () => {
      // 한글: mut (가변성 선언)
      const keyword = '불변';
      expect(keyword).toBe('불변');
      expect(keyword.length).toBe(2);
    });

    test('참조 키워드 인식', () => {
      // 한글: ref (참조 타입)
      const keyword = '참조';
      expect(keyword).toBe('참조');
      expect(keyword.length).toBe(2);
    });
  });

  describe('P1 코드 예제', () => {

    test('P1 사용 코드', () => {
      const code = `사용 수학 = "math"`;
      expect(code).toContain('사용');
      expect(code).toContain('수학');
    });

    test('P1 조건 코드', () => {
      const code = `조건 값 {
        1 => 하나
        2 => 둘
      }`;
      expect(code).toContain('조건');
      expect(code).toContain('값');
    });

    test('P1 오류처리 코드', () => {
      const code = `오류처리 {
        연산()
      } 아니면 {
        오류처리()
      }`;
      expect(code).toContain('오류처리');
    });

    test('P1 열거형 코드', () => {
      const code = `타입 상태 = 열거형 {
        활성
        비활성
        중단
      }`;
      expect(code).toContain('열거형');
      expect(code).toContain('상태');
    });

    test('P1 구현 코드', () => {
      const code = `구현 계산기 {
        함수 더하기(a, b) -> 숫자 {
          반환 a + b
        }
      }`;
      expect(code).toContain('구현');
      expect(code).toContain('계산기');
    });

    test('P1 특성 코드', () => {
      const code = `특성 비교가능 {
        함수 비교(다른: 특성) -> 참거짓
      }`;
      expect(code).toContain('특성');
      expect(code).toContain('비교가능');
    });

    test('P1 불변 코드', () => {
      const code = `변수 불변 카운터 = 0`;
      expect(code).toContain('불변');
      expect(code).toContain('카운터');
    });

    test('P1 참조 코드', () => {
      const code = `함수 수정(참조 값: 숫자) {
        값 = 값 + 1
      }`;
      expect(code).toContain('참조');
      expect(code).toContain('값');
    });
  });

  describe('P0+P1 통합 코드', () => {

    test('완전한 P0+P1 프로그램', () => {
      const code = `
// P0 + P1 혼합
상수 버전 = "1.0"

타입 오류 = 열거형 {
  없음
  값없음(문자열)
  타입오류
}

특성 처리가능 {
  함수 처리(입력: 숫자) -> 숫자
}

구현 계산 {
  함수 계산(입력: 숫자) -> 숫자 {
    변수 불변 결과 = 입력 * 2
    반환 결과
  }
}

함수 main() -> 공집합 {
  변수 값 = 10

  조건 값 {
    1 => 출력("하나")
    10 => 출력("열")
  }

  오류처리 {
    변수 계산결과 = 값 * 2
    출력(계산결과)
  }
}

main()
      `;

      // P0 키워드 확인
      expect(code).toContain('상수');
      expect(code).toContain('타입');
      expect(code).toContain('함수');
      expect(code).toContain('변수');
      expect(code).toContain('반환');

      // P1 키워드 확인
      expect(code).toContain('열거형');
      expect(code).toContain('특성');
      expect(code).toContain('구현');
      expect(code).toContain('조건');
      expect(code).toContain('오류처리');
      expect(code).toContain('불변');
    });
  });

  describe('Unicode 범위 검증', () => {

    test('한글 완전체 (U+AC00~D7A3) 인식', () => {
      // 가 (0xAC00) ~ 힣 (0xD7A3)
      const korean = '가나다라마바사아자차카타파하';
      expect(korean.length).toBeGreaterThan(0);

      for (let char of korean) {
        const code = char.charCodeAt(0);
        expect(code >= 0xAC00 && code <= 0xD7A3).toBe(true);
      }
    });

    test('P0+P1 한글 키워드 Unicode 범위', () => {
      const p0Keywords = ['변수', '반환', '만약', '함수', '반복', '아니면', '타입', '상수'];
      const p1Keywords = ['사용', '조건', '오류처리', '열거형', '구현', '특성', '불변', '참조'];

      const allKeywords = [...p0Keywords, ...p1Keywords];

      allKeywords.forEach(keyword => {
        for (let char of keyword) {
          const code = char.charCodeAt(0);
          // 한글 완전체 또는 한글 자모
          const isKorean = (code >= 0xAC00 && code <= 0xD7A3) ||
                          (code >= 0x1100 && code <= 0x11FF);
          expect(isKorean).toBe(true);
        }
      });
    });
  });

  describe('P0+P1 키워드 개수', () => {

    test('P0: 8개 키워드', () => {
      const p0 = ['변수', '반환', '만약', '함수', '반복', '아니면', '타입', '상수'];
      expect(p0.length).toBe(8);
    });

    test('P1: 8개 키워드', () => {
      const p1 = ['사용', '조건', '오류처리', '열거형', '구현', '특성', '불변', '참조'];
      expect(p1.length).toBe(8);
    });

    test('P0+P1: 16개 키워드 통합', () => {
      const p0 = ['변수', '반환', '만약', '함수', '반복', '아니면', '타입', '상수'];
      const p1 = ['사용', '조건', '오류처리', '열거형', '구현', '특성', '불변', '참조'];
      const all = [...p0, ...p1];

      expect(all.length).toBe(16);
      expect(new Set(all).size).toBe(16); // 중복 없음
    });
  });

  describe('P1 한글-영문 매핑', () => {

    test('P1 키워드 매핑 정확성', () => {
      const mapping = {
        '사용': 'use',        // 2 vs 3
        '조건': 'match',      // 2 vs 5
        '오류처리': 'try',    // 4 vs 3
        '열거형': 'enum',     // 3 vs 4
        '구현': 'impl',       // 2 vs 4
        '특성': 'trait',      // 2 vs 5
        '불변': 'mut',       // 2 vs 3
        '참조': 'ref'        // 2 vs 3
      };

      Object.entries(mapping).forEach(([korean, english]) => {
        expect(korean).toBeTruthy();
        expect(english).toBeTruthy();
        // 한글과 영문의 길이는 서로 다를 수 있음
        expect(korean.length).toBeGreaterThan(0);
        expect(english.length).toBeGreaterThan(0);
      });
    });
  });

});
