# 날씨 대시보드 (skala-vue)

Vue 3 + Vue Router + Pinia + Axios 기반 날씨 대시보드 실습 프로젝트입니다.  
OpenWeatherMap API로 실제 날씨를 불러오고, 검색·단위 전환·라이트/다크·상세 라우팅까지 한 흐름으로 구성했습니다.

---

## 설명

- **홈(**`/`**)**: 서울 + 현재 위치(권한 허용 시) 날씨 선호출, 도시 검색(한글/영문 추천), 카드 UI
- **상세(**`/weather/:cityId`**)**: 선택 도시 상세 관측 정보 (캐시 우선)
- **소개(**`/about`**)**, **가이드(**`/guide`**)**, **404** 라우트
- **헤더**: 섭씨/화씨·라이트/다크 토글 (`ConfigToggler`)
- 학습 단계별 컴포넌트(`WeatherMockup`, `WeatherParent` 등)는 `src/components/exercise/`에 유지

---

## 실행 방법

### 1) 의존성 설치

```bash
npm install
```

### 2) 환경 변수 (.env)

```bash
cp .env.example .env
```

`.env` 예시:

```env
VITE_OPENWEATHER_API_KEY=발급받은_키
```



### 3) 개발 서버

```bash
npm run dev
```

---



## 파일 구조

```text
.
├── .env.example                 # OpenWeather API 키 예시 (실제 키는 .env)
├── index.html
├── package.json
├── vite.config.js
├── public/
│   └── favicon.ico
└── src/
    ├── main.js                  # createApp, pinia, router, Element Plus
    ├── App.vue                  # RouterLink 내비 + RouterView + ConfigToggler
    ├── assets/
    │   ├── main.css             # 전역 진입 CSS
    │   ├── base.css
    │   ├── exercise.css         # Hands-on 공통 스타일
    │   ├── weather-app.css      # App 셸·헤더·테마
    │   └── weather-composition.css  # Composition 대시보드 레이아웃
    ├── router/
    │   └── index.js             # routes, Lazy Loading, Catch-all
    ├── models/
    │   ├── cityMapping.js       # 한글↔영문 도시 매핑, resolveCityQuery
    │   └── weatherModel.js      # 표시 유틸, getWeatherMeta, upsert
    ├── services/
    │   ├── httpService.js       # GET / POST / PATCH / DELETE
    │   └── weatherService.js    # OpenWeather (httpService.get 사용)
    ├── stores/
    │   ├── configStore.js       # unit / themeMode
    │   ├── favoriteStore.js     # 즐겨찾기
    │   └── weatherStore.js      # 날씨 목록 캐시 (홈↔상세 공유)
    ├── components/
    │   ├── icons/
    │   │   └── IconWeatherCard.vue
    │   └── exercise/
    │       ├── WeatherComposition.vue              # 메인 대시보드 부모
    │       ├── WeatherCompositionSearchBar.vue     # 검색 + 추천
    │       ├── WeatherCompositionSection.vue       # 공통 섹션(slot)
    │       ├── WeatherCompositionCard.vue          # 선택 도시 카드
    │       ├── WeatherCompositionEmpty.vue         # 결과 없음
    │       ├── WeatherCompositionFooter.vue        # 하단 상태바
    │       ├── WeatherCityList.vue                 # 도시 목록(v-for)
    │       ├── WeatherDetailPanel.vue              # 상세 정보 패널
    │       ├── ConfigToggler.vue                   # 단위/테마 토글
    │       ├── WeatherMockup.vue                   # Hands-on 1 Mockup
    │       ├── WeatherParent.vue                   # Hands-on 3 부모
    │       ├── BaseDashboardCard.vue               # slot 공통 카드 틀
    │       ├── SearchBar.vue                       # Hands-on 검색 입력
    │       ├── WeatherCard.vue                     # Hands-on 도시 카드
    │       ├── WeatherStatusBar.vue                # Hands-on 상태바
    │       └── WeatherEmptyResult.vue              # Hands-on 빈 결과
    └── views/
        ├── WeatherHomeView.vue      # /
        ├── WeatherDetailView.vue    # /weather/:cityId
        ├── WeatherAboutView.vue     # /about
        ├── WeatherGuideView.vue     # /guide
        └── NotFoundView.vue         # Catch-all
```

---



## 화면 스크린샷


| 화면     | 이미지 |
| ------ | --- |
| 홈 대시보드 | 홈   |
| 검색 추천  | 검색  |
| 상세 페이지 | 상세  |
| 다크모드   | 다크  |


---



## 구현 기능

- 도시 목록 `v-for` 렌더링 (`:key="id"`)
- 기온 기준 체감 라벨 `v-if` (25도씨 기준)
- 검색 `:value` + `@input` (한글 입력 안정화)
- 카드 클릭 → 상태바 메시지 / 상세 버튼 `@click.stop` + `router.push`
- `computed` / `watch` / `watchEffect` 활용
- 컴포넌트 분리 + `props` / `emits` / `slot`
- Vue Router (Lazy Loading, 동적 경로, Catch-all, Programmatic Navigation)
- Pinia `configStore` (섭씨/화씨) + `favoriteStore` + `weatherStore`
- OpenWeather **Current Weather** + **Geocoding** + 브라우저 **Geolocation**
- 상세 진입 시 **캐시 우선**으로 API 중복 호출 감소
- 라이트/다크 테마 (`configStore.themeMode` + provide 호환)
- Element Plus 전역 등록 (`main.js`)

---



## 과제 체크리스트



### Hands-on 1 (기초: v-for / v-if / 입력 / 이벤트)

- [x] 배열 렌더링 (`v-for`) + `:key`에 id 바인딩  
  → `WeatherCityList.vue`
- [x] 조건부 렌더링 (`v-if`) 체감 라벨 (더움 / 선선함)  
  → `WeatherDetailPanel.vue`
- [x] 양방향에 해당하는 검색 입력 (`:value`, `@input`) + 한글 검색  
  → `WeatherCompositionSearchBar.vue`  
- [x] 카드 클릭 시 상태바 `"{도시}이 선택되었습니다."`
- [x] 상세보기 버튼 버블링 방지 (`@click.stop`)  
- [x] 본인 Mockup 추가 (`WeatherMockup.vue` 등)



### Hands-on 2 (Composition: ref / computed / watch)

- [x] `searchQuery`, 선택 상태, 날씨 목록 반응형 관리  
  → 현재는 API + `weatherStore`로 확장
- [x] 검색/필터 로직 (`computed` 등)  
- [x] `watch(selectedCityInfo/statusMessage)` 콘솔 로그
- [x] `watchEffect`로 검색어 추적 로그
- [x] 결과 없음 안내 (`WeatherCompositionEmpty`)
- [x] 추가 반응형/Computed/Watcher (추천 debounce, 캐시 여부 등)



### Hands-on 3 (Component 분리)

- [x] `WeatherParent.vue` — 반응형 데이터 유지
- [x] `BaseDashboardCard.vue` — slot 공통 레이아웃
- [x] `SearchBar.vue` — props / `update-query` emits
- [x] `WeatherCard.vue` — props / `select-card`, `click-detail` emits
- [x] 컴포넌트별 `<style scoped>`
- [x] 추가 분리 — Composition 계열 (`WeatherComposition*`, `WeatherCityList`, `WeatherDetailPanel` 등)



### Hands-on 4 (Router)

- [x] Lazy Loading + Catch-all Route
- [x] `App.vue` — `RouterLink` + `RouterView` (+ `KeepAlive`)
- [x] `WeatherHomeView` — 메인 대시보드  
- [x] 상세보기 `router.push('/weather/' + id)` (alert 제거)
- [x] `WeatherDetailView` — `:cityId` 동적 매칭  
- [x] `WeatherAboutView`
- [x] 추가 view — `WeatherGuideView` (`/guide`)



### Hands-on 5 (Pinia)

- [x] `configStore`: `unit` / `unitSymbol` / `toggleUnit`
- [x] 대시보드 상단 단위 토글 UI  
- [x] 메인/상세 `displayTemp` 단위 반영
- [x] 추가 Store — `favoriteStore`, `weatherStore`, `configStore.themeMode`



### Hands-on 6 (Axios / 외부 API)

- [x] Axios 설치 및 `httpService` 모듈화
- [x] OpenWeather **Current Weather** 적용
- [x] OpenWeather **Geocoding** (검색 추천 / reverse)
- [x] 기타 — 브라우저 **Geolocation** (현재 위치)



### Hands-on 7 (외부 UI Library)

- [x] Element Plus 설치 및 `main.js` 전역 등록  



### Source 품질 / Build

- [ ] ESLint Error 0 확인 후 제출 (`npm run lint`)
- [x] API 키 `.env` 관리 + `.gitignore` 제외 (`.env.example` 제공)
- [ ] `npm run build` 후 본인 서버 호스팅 확인

---



## 수업 Q&A (교수님께 질문한 내용)



### 1) `ref`를 `const`로 선언하는 이유

**질문**  
동적으로 변하는 값인데 왜 `const`를 쓰나요?

**답변**  
`const`는 Heap에 있는 **참조(주소) 자체가 바뀌는 것**을 막는 것이지, 객체 안의 값이 바뀌는 것까지 막지는 않습니다.  
즉 `ref` 객체의 **내부 데이터(**`value`**)가 변경**되는 것과는 별개입니다.

---



### 2) JWT를 비정상 사용자에게 즉시 비활성화할 수 있는지

**질문**  
JWT는 클라이언트에 제공되는데, 비정상 사용자라면 토큰을 즉시 비활성화·종료시키는 방법이 있을까요?

**답변**  
**즉시 무효화하는 완벽한 방법은 사실상 없다.**  
대신 Access Token 유효 시간을 5~10분처럼 짧게 두고, Refresh Token을 서버에 저장해 두었다가 그 시점에 차단하는 식으로 처리한다.  
JWT 특성상 **즉시 대응하기엔 무리가 있는 시스템**이다.

---



### 3) 양방향 바인딩(`v-model`)에 대한 생각

**질문**  
양방향 바인딩 개념과, Model 값을 바꾼다는 말이 쉽게 다가오지 않는다. 정확히 어떤 의미인지 알고 싶다.

**정리**  
기존 JS에서는 input이 바뀌면 `querySelector`로 요소를 잡고, 이벤트 기반으로 값을 읽어야 했다.  
반면 Vue에서는 `ref`와 `v-model`을 쓰면, 그 반복적인 이벤트 바인딩 없이도 **데이터가 화면과 맞춰 바뀐다**는 의미에 가깝다.  
수업 PDF에 자세히 없더라도, 더 나아가 **부모·자식 컴포넌트 간 데이터 바인딩**도 지원한다.

**내 생각**  
그렇다면 Vue는 컴포넌트를 쓰고 연결하기 위해 상당히 최적화된 시스템이라고 이해했다.

---



### 4) 실무에서 Body/데이터를 항상 암호화하는지

**질문**  
실무에서도 데이터나 Body에 대해 항상 암호화를 하나요?

**답변**  
데이터에 따라 다르다. 개인정보처럼 민감한 데이터는 암호화해서 제공한다.  
또한 서버는 서버끼리 내부 통신을 하는 경우가 많다. 요청을 받은 뒤, 실제 데이터를 처리하는 쪽으로 넘기는 식이다.  
(리버스 프록시로 앞단에서 받고, 내부 서비스로 넘기는 구조로 이해했다.)

---



## 어려웠던 점과 트러블슈팅



### 1) 한글 검색과 `v-model`

`v-model`로 검색을 묶어 보니, 한글 IME 조합 중에 값이 어중간하게 올라가거나 추천 API가 너무 자주 나갔습니다.  
과제 요구인 `:value` **+** `@input` 으로 되돌리고, Geocoding은 **debounce(280ms)** 로 호출 횟수를 줄였습니다.

### 2) 상세 진입 시 API가 한 번 더 나감

홈에서 이미 받아 둔 도시를 상세에서 `fetchWeatherById`로 다시 불렀습니다.  
`weatherStore`에 첫 응답을 저장하고, 상세는 **캐시 hit 시 API 생략**하도록 바꿨습니다.

### 3) 카드 문구가 전부 Cloudy처럼 보임

`summary`를 영문 고정 매핑(`Cloudy`)만 쓰고 있었습니다.  
OpenWeather `lang=kr`의 `description` 과 **icon 코드**로 상태를 판별·표시하도록 수정했습니다.

### 4) 도시명이 영어로 저장/표시됨

API `name`이 영어인 경우가 많아 (예: Hawaii) 목록·상세가 영문으로 남았습니다.  
`cityMapping` + **reverse geocoding(**`local_names.ko`**)** 으로 한글 표시명을 보정했습니다.

### 5) `alert` vs 라우터

1일차 과제는 `window.alert`였지만, 라우터 과제와 겹치고 UX가 끊겨  
`@click.stop`은 유지한 채 동작만 `router.push` 로 바꿨습니다.

### 6) API 키 하드코딩

실습 중에는 코드에 키를 두었으나, 제출 기준에 맞춰  
`.env` **+** `import.meta.env.VITE_OPENWEATHER_API_KEY` 로 옮기고 `.gitignore`에 `.env`를 넣었습니다.

---



## 사용한 OpenWeather API 요약


| API               | Endpoint            | 용도           |
| ----------------- | ------------------- | ------------ |
| Current Weather   | `/data/2.5/weather` | 도시명/좌표/id 날씨 |
| Geocoding Direct  | `/geo/1.0/direct`   | 검색 추천        |
| Geocoding Reverse | `/geo/1.0/reverse`  | 현재 위치·한글 도시명 |


공통: `units=metric`, `lang=kr`  
호출: `weatherService` → `httpService.get()`

---



## 참고

- Vue 3 Composition API
- Vue Router 4
- Pinia
- Axios
- Element Plus
- OpenWeatherMap

