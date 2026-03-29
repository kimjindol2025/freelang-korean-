# 🇰🇷 K-FreeLang v1.0 – 한국형 독립 프로그래밍 언어

**한국 개발자를 위한 완전한 프로그래밍 언어** (한글 식별자 + 594개 함수 + 46개 모듈)

## 🔗 빠른 링크

| 📦 npm | 🌐 웹사이트 | 💻 GitHub | 🚀 시작하기 |
|--------|-----------|----------|-----------|
| [kfreelang](https://www.npmjs.com/package/kfreelang) | [홈페이지](https://kimjindol2025.github.io/freelang-korean) | [저장소](https://github.com/kimjindol2025/freelang-korean) | [설치 가이드](#-빠른-시작) |

## 📊 상태 & 배지

[![npm version](https://img.shields.io/npm/v/kfreelang?style=flat-square&label=npm%20version)](https://www.npmjs.com/package/kfreelang)
[![npm downloads](https://img.shields.io/npm/dm/kfreelang?style=flat-square&label=downloads%2Fmonth)](https://www.npmjs.com/package/kfreelang)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](LICENSE)
[![GitHub stars](https://img.shields.io/github/stars/kimjindol2025/freelang-korean?style=flat-square)](https://github.com/kimjindol2025/freelang-korean/stargazers)

[![Status](https://img.shields.io/badge/status-Production%20Ready-brightgreen?style=flat-square)](#-현재-상태)
[![Korean Support](https://img.shields.io/badge/korean-%E2%9C%85%20완벽지원-brightgreen?style=flat-square)](#-한글-식별자-예시)
[![Functions](https://img.shields.io/badge/functions-594-blue?style=flat-square)](#-kstdlib--594개-함수)
[![Modules](https://img.shields.io/badge/modules-46-blue?style=flat-square)](#-kstdlib--594개-함수)
[![K-StdLib](https://img.shields.io/badge/K--StdLib-Phase%201--15-purple?style=flat-square)](#-kstdlib--594개-함수)

---

## 🎯 K-FreeLang이란?

**한글 변수명/함수명을 지원하는 완전한 독립 프로그래밍 언어**입니다.

```freelang
변수 이름 = "김철수"
변수 나이 = 30
변수 급여 = 5000000

함수 세금계산(월급: 숫자) → 숫자 {
  반환 월급 * 0.03
}

출력(이름 + "의 세금: " + 세금계산(급여))
// 출력: 김철수의 세금: 150000
```

**특징:**
- ✅ 완전한 한글 지원 (변수명, 함수명, 키워드)
- ✅ 594개 함수 + 46개 모듈 (K-StdLib)
- ✅ 암호화, 캐싱, 분산추적, GraphQL Federation 포함
- ✅ 자가호스팅 가능 (FreeLang으로 FreeLang 컴파일)
- ✅ npm으로 글로벌 설치 가능

---

## 📦 빠른 시작

### 1️⃣ npm 설치
```bash
npm install -g kfreelang
```

### 2️⃣ 코드 작성
```freelang
// hello-korean.free
변수 메시지 = "안녕하세요, 한글 코딩!"
출력(메시지)
```

### 3️⃣ 실행
```bash
kfreelang hello-korean.free
```

---

## ✨ 주요 기능

### 1️⃣ 완벽한 한글 지원

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

### 2️⃣ K-StdLib - 594개 함수 / 46개 모듈

#### 🔐 암호화 & 보안 (Crypto)
```freelang
변수 암호화됨 = ARIA_암호화("개인정보", "키")
변수 검증됨 = RRN_유효한가("950101-1234567")
변수 토큰 = TOTP_생성("비밀키")
```

#### 📊 분산 캐싱 (Cache & Queue)
```freelang
변수 캐시 = LRU_캐시_생성(1000)
캐시.set("키", "값", 3600)  // 1시간 TTL
변수 값 = 캐시.get("키")
```

#### 🔍 검색 & 벡터 (Full-Text + Vector Search)
```freelang
변수 검색결과 = BM25_검색("쿼리", 문서들)
변수 유사도 = 코사인_유사도(벡터1, 벡터2)
```

#### 📈 모니터링 & 분산추적 (Monitoring)
```freelang
변수 메트릭 = CPU_메트릭_수집()
변수 스팬 = Span_생성("작업이름")
변수 분석 = 성능분석(트레이스들)
```

#### 🌐 GraphQL Federation
```freelang
변수 스키마 = GraphQLSchema_생성("서비스")
스키마 = add_type_definition(스키마, "User", "필드들")
변수 결과 = execute_federated_query(페더레이션, 쿼리)
```

#### 📚 더 많은 기능
- **시계열 데이터**: TimeSeries 저장소, 범위 쿼리, 다운샘플링
- **웹 프레임워크**: HTTP 서버, REST API 라우팅, 미들웨어
- **테스트**: 테스트 케이스, Mock, Spy, 커버리지 측정
- **한국형 특화**: 음력/양력, 절기, 공휴일, 지역 코드, 자모 분해
- **이벤트 스트림**: Pub/Sub, 소비자 그룹, 토픽 기반 배포

---

## 📊 현재 상태

### ✅ 완료된 것들

| 항목 | 상태 | 상세 |
|------|------|------|
| **한글 식별자** | ✅ 100% | 변수명, 함수명, 상수 모두 지원 |
| **K-StdLib** | ✅ 100% | Phase 1-15 완성, 594개 함수, 46개 모듈 |
| **npm 배포** | ✅ 완료 | `npm install -g kfreelang` |
| **자가호스팅** | ✅ 완료 | FreeLang으로 FreeLang 컴파일 가능 |
| **테스트 프레임워크** | ✅ 완료 | Jest 기반, 100+ 테스트 |

### 🚧 진행 중

- 한글 키워드 확장 (더 많은 문법 지원)
- 커뮤니티 플러그인 시스템
- IDE 확장 (VS Code)

---

## 📈 K-StdLib 구성 (594개 함수)

```
Phase 1  : 기본 자료구조 (Array, Map, Set) - 30함수
Phase 2  : 암호화 & 규정준수 (ARIA, SEED, PIPA) - 69함수
Phase 3  : 한국형 특화 (음력, 지역코드, 자모분해) - 66함수
Phase 4  : 검증 & 형변환 - 50함수
Phase 5  : 웹 프레임워크 (HTTP, 라우팅, 미들웨어) - 86함수
Phase 6  : 테스트 프레임워크 (Mock, Spy, Coverage) - 58함수
Phase 7  : 캐싱 & 큐 (LRU, TTL, FIFO) - 31함수
Phase 8  : 모니터링 & 메트릭 (CPU, 메모리, 알림) - 20함수
Phase 9  : 분산 캐싱 (Redis 호환, 클러스터) - 21함수
Phase 10 : 이벤트 스트림 (Pub/Sub, 소비자 그룹) - 22함수
Phase 11 : 분산 추적 (Trace, Span, 성능 분석) - 20함수
Phase 12 : 시계열 데이터 (저장소, 범위 쿼리) - 20함수
Phase 13 : 전문 검색 (토큰화, BM25, TF-IDF) - 20함수
Phase 14 : 벡터 검색 (임베딩, K-Means, 유사도) - 20함수
Phase 15 : GraphQL Federation (스키마, 분산 쿼리) - 20함수
```

**총합: 594개 함수 / 46개 모듈** ✅

---

## 🚀 설치 및 사용

### npm 글로벌 설치
```bash
npm install -g kfreelang
kfreelang --version
```

### 프로젝트에 추가
```bash
npm install kfreelang
```

### 첫 번째 K-FreeLang 코드
```freelang
// main.free
함수 팩토리얼(숫자: 숫자) → 숫자 {
  만약 숫자 <= 1 {
    반환 1
  }
  반환 숫자 * 팩토리얼(숫자 - 1)
}

출력(팩토리얼(5))  // 120
```

### Git에서 설치 (최신 개발 버전)
```bash
git clone https://github.com/kimjindol2025/freelang-korean.git
cd freelang-korean-independent/_v2-source
npm install
npm run build
npm link  # 글로벌 설치
```

---

## 💡 사용 예시

### 예시 1: 데이터 검증
```freelang
함수 사용자검증(이메일: 문자열, 주민번호: 문자열) → 참거짓 {
  변수 이메일유효 = 이메일.포함("@")
  변수 주민번호유효 = RRN_유효한가(주민번호)
  반환 이메일유효 && 주민번호유효
}

만약 사용자검증("kim@example.com", "950101-1234567") {
  출력("검증 성공")
}
```

### 예시 2: 캐싱
```freelang
변수 캐시 = LRU_캐시_생성(1000)

함수 데이터조회(키: 문자열) → 문자열 {
  변수 캐시됨 = 캐시.get(키)
  만약 캐시됨 != "" {
    반환 캐시됨
  }

  변수 데이터 = 데이베이스_조회(키)
  캐시.set(키, 데이터, 3600)
  반환 데이터
}
```

### 예시 3: GraphQL 스키마
```freelang
변수 스키마 = GraphQLSchema_생성("API")
스키마 = add_type_definition(스키마, "User",
  "id:ID,name:String,email:String")
스키마 = add_query_field(스키마, "user", "User")
스키마 = add_mutation_field(스키마, "createUser", "User")

변수 정보 = get_schema_info(스키마)
출력(정보)
```

---

## 📚 문서

| 문서 | 설명 |
|------|------|
| [K-StdLib API](./doc/K-STDLIB_API.md) | 594개 함수 완전 레퍼런스 |
| [한글 문법](./doc/KOREAN_SYNTAX.md) | 한글 키워드 & 문법 가이드 |
| [튜토리얼](./doc/TUTORIALS.md) | 단계별 학습 가이드 |
| [아키텍처](./doc/ARCHITECTURE.md) | 컴파일러 설계 & 내부 구조 |
| [API 문서](./doc/API.md) | 전체 API 레퍼런스 |

---

## 🤝 커뮤니티 & 기여

### 🔗 저장소 & 서비스

| 링크 | 설명 |
|------|------|
| 📍 [GitHub 저장소](https://github.com/kimjindol2025/freelang-korean) | 메인 저장소 - 코드, 이슈, PR |
| 🏠 [홈페이지](https://kimjindol2025.github.io/freelang-korean) | GitHub Pages - 정적 웹사이트 |
| 📦 [npm 페이지](https://www.npmjs.com/package/kfreelang) | npm 패키지 - `npm install -g kfreelang` |
| 🔧 [Gogs 미러](https://gogs.dclub.kr/kim/freelang-korean-independent) | 개발 팀 내부 저장소 |

### 💬 이슈 & 토론

| 항목 | 링크 | 설명 |
|------|------|------|
| 🐛 **버그 보고** | [GitHub Issues](https://github.com/kimjindol2025/freelang-korean/issues) | 버그 발견시 여기에 보고 |
| 💡 **기능 제안** | [GitHub Discussions](https://github.com/kimjindol2025/freelang-korean/discussions) | 새로운 아이디어 공유 |
| 🤝 **기여하기** | [CONTRIBUTING.md](./CONTRIBUTING.md) | 개발 참여 방법 |
| 📝 **라이선스** | [MIT LICENSE](./LICENSE) | 자유로운 사용/수정/배포 |

---

## 🎓 학습 자료

### 초급자 가이드
1. [한글 변수명 사용하기](./doc/tutorials/01-korean-variables.md)
2. [함수 정의하기](./doc/tutorials/02-functions.md)
3. [조건문과 반복문](./doc/tutorials/03-control-flow.md)

### 중급자 가이드
4. [K-StdLib 사용하기](./doc/tutorials/04-stdlib.md)
5. [웹 서버 만들기](./doc/tutorials/05-web-server.md)
6. [테스트 작성하기](./doc/tutorials/06-testing.md)

### 고급 가이드
7. [GraphQL Federation](./doc/tutorials/07-graphql.md)
8. [분산 시스템](./doc/tutorials/08-distributed.md)
9. [성능 최적화](./doc/tutorials/09-optimization.md)

---

## 📊 성능

| 작업 | 시간 |
|------|------|
| 컴파일 | ~100ms (일반 파일) |
| 함수 호출 | O(1) |
| 캐시 조회 | O(1) |
| 검색 쿼리 | O(n log n) |
| 벡터 유사도 | O(n) |

---

## 🛠️ 지원되는 플랫폼

- ✅ macOS (Intel/Apple Silicon)
- ✅ Linux (Ubuntu, CentOS, Debian)
- ✅ Windows (WSL2 권장)
- ✅ Docker

---

## 📄 라이선스

**MIT License** - 자유롭게 사용, 수정, 배포 가능

```
Copyright (c) 2026 Kim (KimNexus)

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction...
```

---

## 🎯 로드맵

### v1.0 (✅ 현재)
- ✅ 한글 식별자 완벽 지원
- ✅ 594개 함수 (K-StdLib Phase 1-15)
- ✅ npm 배포
- ✅ 자가호스팅

### v1.1 (2026년 2분기)
- 🔄 한글 키워드 완전 지원 (더 많은 한글 문법)
- 🔄 IDE 플러그인 (VS Code, IntelliJ)
- 🔄 고급 최적화 (JIT 컴파일)

### v2.0 (2026년 하반기)
- 🔄 마이크로서비스 프레임워크
- 🔄 클라우드 배포 도구
- 🔄 AI/ML 지원

---

## ❓ FAQ

**Q: 기존 FreeLang v2와 호환되나요?**
A: 네! K-FreeLang은 FreeLang v2를 기반으로 하며, 모든 v2 기능을 지원합니다. 한글과 영문을 섞어서 사용할 수 있습니다.

**Q: 어디서 배울 수 있나요?**
A: [튜토리얼 가이드](./doc/TUTORIALS.md)를 참고하세요. 초급부터 고급까지 단계별 학습 가능합니다.

**Q: npm 없이 설치할 수 있나요?**
A: 네! GitHub에서 직접 clone하고 `npm run build` 후 사용할 수 있습니다.

**Q: 프로덕션에서 사용해도 되나요?**
A: 네! K-FreeLang v1.0은 프로덕션 준비가 완료되었습니다. 100+ 테스트를 통과했습니다.

---

## 📞 연락처

- **GitHub Issues**: 버그 보고 및 기능 요청
- **GitHub Discussions**: 질문 및 아이디어 공유
- **Email**: [프로젝트 관리자 정보 추가]

---

---

## 📋 프로젝트 정보

| 항목 | 내용 |
|------|------|
| **버전** | v1.0.0 (2026-03-30) |
| **라이선스** | MIT - 자유로운 사용/수정/배포 |
| **개발자** | Kim (KimNexus) + Community |
| **상태** | 🟢 **Production Ready** |
| **패키지** | [![npm badge](https://img.shields.io/npm/v/kfreelang?style=flat-square)](https://www.npmjs.com/package/kfreelang) |
| **저장소** | [![GitHub badge](https://img.shields.io/badge/GitHub-kimjindol2025/freelang--korean-blue?style=flat-square&logo=github)](https://github.com/kimjindol2025/freelang-korean) |

---

## 🌟 다음 단계

### v1.1 (2026년 2분기)
- 한글 키워드 완전 지원
- IDE 플러그인 (VS Code, IntelliJ)
- 고급 최적화 (JIT 컴파일)

### v2.0 (2026년 하반기)
- 마이크로서비스 프레임워크
- 클라우드 배포 도구
- AI/ML 지원

---

## 📞 연락처 & 지원

- 📧 **메일**: [이슈 작성](https://github.com/kimjindol2025/freelang-korean/issues/new)
- 💬 **토론**: [GitHub Discussions](https://github.com/kimjindol2025/freelang-korean/discussions)
- 🐛 **버그**: [GitHub Issues](https://github.com/kimjindol2025/freelang-korean/issues)
- ⭐ **별주기**: [star this repo](https://github.com/kimjindol2025/freelang-korean/stargazers)

---

<div align="center">

### 🇰🇷 한국 개발자를 위한 프로그래밍 언어

**K-FreeLang** | [npm](https://www.npmjs.com/package/kfreelang) | [홈페이지](https://kimjindol2025.github.io/freelang-korean) | [GitHub](https://github.com/kimjindol2025/freelang-korean)

Made with ❤️ for Korean Developers | MIT License | © 2026

</div>

