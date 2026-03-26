# 🇰🇷 FreeLang v2 – 한글 식별자 지원

**한국 개발자를 위한 프로그래밍 언어 (한글 변수명/함수명 지원)**

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Status](https://img.shields.io/badge/status-Development-yellow.svg)](#현재-상태)
[![Language](https://img.shields.io/badge/language-FreeLang%20v2-blue)](#)
[![Korean Support](https://img.shields.io/badge/korean-✅%20supported-brightgreen)](#-한글-식별자-예시)

---

## 💡 프로젝트란?

**FreeLang v2**를 기반으로 **한글 변수명/함수명 지원**을 추가한 프로그래밍 언어입니다.

```freelang
변수 이름 = "김철수"
변수 나이 = 30
변수 급여 = 5000000

함수 세금계산(월급: 숫자) → 숫자 {
  반환 월급 * 0.03
}

출력(이름 + "의 세금: " + 세금계산(급여))
```

**기존 FreeLang의 모든 기능을 유지하면서, 한글로 코드를 작성할 수 있습니다.**

---

## ✨ 특징

### 1️⃣ 한글 식별자 완벽 지원
```freelang
// 한글 변수명
변수 사용자이름 = "김철수"
변수 총매출액 = 1000000
변수 활성화여부 = 참

// 한글 함수명
함수 사용자검증(아이디: 문자열) → 참거짓 {
  변수 유효한가 = 아이디.len > 3
  반환 유효한가
}

// 한글 상수
상수 기본인증번호 = "123456"
```

### 2️⃣ 기존 FreeLang v2 완전 호환
- 영문 키워드 (`if`, `function`, `var` 등) 그대로 사용 가능
- 한글과 영문 혼합 코드 작성 가능
- 기존 v2 라이브러리 모두 사용 가능

### 3️⃣ 한국형 표준 라이브러리 (K-StdLib)
```freelang
// 암호화 (ARIA, SEED)
변수 암호화됨 = ARIA_암호화("개인정보", "키")

// 규제 준수 (PIPA, 주민번호 검증)
만약 RRN_유효한가("950101-1234567") {
  출력("유효한 주민등록번호")
}

// 2FA (TOTP/HOTP)
변수 코드 = TOTP_생성("비밀키")
```

### 4️⃣ 기존 FreeLang 기능
- Smart Bridge (모드 감지)
- Nexus (V→C 컴파일)
- 모듈 시스템 (import/export)
- 테스트 프레임워크

---

## 📊 현재 상태

### 개발 진행 현황

| 항목 | 상태 | 진행률 | 상세 |
|------|------|--------|------|
| **v2 부트스트랩** | 🟨 진행 중 | 69% | Anonymous Struct Literal, Struct Constructor 등 P1~P5 진행 |
| **한글 식별자** | ✅ 완성 | 100% | 렉서에서 한글(가-힣) 인식 가능 |
| **한글 문법** | 🟨 진행 중 | 50% | 한글 키워드 (변수, 함수, 반환, 만약 등) |
| **K-StdLib** | 🟨 진행 중 | 40% | Crypto (OTP, Encoding), Compliance (검증, 마스킹) |
| **npm 배포** | ⏳ 대기 | 0% | v2 부트스트랩 100% 완성 후 |

### 사용 가능한 것 ✅
- ✅ 한글 변수명/함수명 작성 가능
- ✅ 영문 키워드 (if, function, var 등)
- ✅ FreeLang v2 기본 기능 (부트스트랩 69% 통과)
- ✅ 한글 표준 라이브러리 설계

### 아직 개발 중인 것 🚧
- 🚧 v2 부트스트랩 나머지 31% (P1~P5)
- 🚧 한글 키워드 완전 지원
- 🚧 npm 설치 (개발 중, 현재는 git clone 필요)
- 🚧 자가호스팅 (FreeLang으로 FreeLang 컴파일)

### 로드맵 (예상)
```
Week 1 (2026-03-26~04-01)
  ├─ v2 부트스트랩 69% → 100%
  └─ 한글 식별자 렉서 지원 ✅ DONE

Week 2-3 (2026-04-02~04-15)
  ├─ 한글 키워드 완전 지원
  ├─ K-StdLib 확장 (암호화, 검증)
  └─ 테스트 커버리지 강화

Week 4 (2026-04-16~05-06)
  ├─ npm 배포 준비
  ├─ 문서 정리
  └─ 커뮤니티 베타 테스트
```

---

## 🚀 빠른 시작

### 1️⃣ 설치 (현재는 Git Clone 필요)
```bash
git clone https://github.com/kimjindol2025/freelang-korean.git
cd freelang-korean-independent

# 의존성 설치
npm install

# 개발 서버 시작
npm run dev
```

**npm 글로벌 설치는 아직 미지원입니다.** (v2 부트스트랩 100% 완성 후 배포 예정)

### 2️⃣ 한글 코드 작성해보기
```freelang
// test-korean.free

변수 이름 = "김철수"
변수 나이 = 30

함수 인사하기(사람이름: 문자열, 사람나이: 숫자) {
  출력(사람이름 + "님, 나이는 " + 사람나이 + "세입니다")
}

인사하기(이름, 나이)
```

### 3️⃣ 테스트 실행
```bash
# hello-korean 예시 실행
npm run test

# 한글 식별자 테스트
node _v2-source/dist/script-runner test-korean.free
```

---

## 📚 문서

- [독립 선언문](./K-FREELANG_INDEPENDENCE_DECLARATION.md)
- [한글 문법 (준비 중)](./docs/specifications/KOREAN_SYNTAX_v1.0.md)
- [K-StdLib 설명서 (준비 중)](./docs/specifications/K-STDLIB.md)
- [아키텍처 (준비 중)](./docs/architecture/ARCHITECTURE.md)

---

## 🤝 커뮤니티

- **GitHub**: https://github.com/kimjindol2025/freelang-korean
- **Gogs**: https://gogs.dclub.kr/kim/freelang-korean-independent
- **이슈 보고**: GitHub Issues (한글 지원)
- **토론**: Discussions (준비 중)

---

## 📄 라이선스

MIT License - 자유로운 사용/수정/배포 가능

---

## 🎯 목표

**한국 개발자를 위한 프로그래밍 언어**

- 🇰🇷 **한글로 코딩 가능** - 변수명, 함수명 모두 한글 지원
- 🔒 **보안 표준 내재화** - PIPA, SEED/ARIA 암호화 기본 제공
- 📚 **배우기 쉬운 언어** - 한국 개발자 입문자 친화적
- 🛠️ **실무 사용 가능** - FreeLang v2 기반으로 안정성 확보

---

## 📖 문서

- [기여 가이드](./CONTRIBUTING.md)
- [API 레퍼런스](./docs/API.md)
- [Discussion 가이드](./docs/discussions-guide.md)
- [한글 문법 설계 (진행 중)](./docs/specifications/KOREAN_SYNTAX.md)

---

## 🤝 도움말

### 버그 보고
[GitHub Issues](https://github.com/kimjindol2025/freelang-korean/issues)에서 버그를 보고해주세요.

### 기능 제안
[GitHub Discussions](https://github.com/kimjindol2025/freelang-korean/discussions)에서 아이디어를 제안해주세요.

### 개발자 커뮤니티
- **Gogs**: https://gogs.dclub.kr/kim/freelang-korean-independent
- **GitHub**: https://github.com/kimjindol2025/freelang-korean

---

**프로젝트 시작**: 2026-03-26
**현재 버전**: v2 (부트스트랩 69%)
**라이선스**: MIT
**개발자**: Kim (KimNexus) + Community
