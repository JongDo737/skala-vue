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

## 화면 스크린샷


| 화면     | 이미지 |
| ------ | --- |
| 홈 대시보드 | <img width="1348" height="599" alt="스크린샷 2026-08-12 오후 7 15 52" src="https://github.com/user-attachments/assets/864e6f25-2d91-40f9-a3c0-66bf528c8006" />  |
| 검색 추천  | <img width="225" height="373" alt="스크린샷 2026-08-12 오후 7 15 35" src="https://github.com/user-attachments/assets/1285b91e-2cc3-45c0-9ccf-add5ba8805e4" />  |
| 상세 페이지 | <img width="1349" height="599" alt="스크린샷 2026-08-12 오후 7 15 59" src="https://github.com/user-attachments/assets/4e3ea2b5-a1bb-466c-88a9-d988a9eebba5" />  |
| 다크모드   | <img width="1347" height="597" alt="스크린샷 2026-08-12 오후 7 16 07" src="https://github.com/user-attachments/assets/461337b6-dd24-40c3-b454-6cb9190bf4c6" />  |


참고 디자인 : [CodePen 날씨 카드 디자인](https://codepen.io/ste-vg/pen/GqaZbo)

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

처음에는 검색 input에 `v-model`을 걸어서 부모 `ref(searchQuery)`와 바로 묶었습니다.  
한글 IME로 “서울”을 칠 때 조합 중간 값이 `searchQuery`에 계속 올라가서, 자식 `emits('update-query')` → 부모 `onUpdateQuery` → Axios `get` (Geocoding)이 글자마다 나갔습니다.

그래서 `WeatherCompositionSearchBar`는 `v-model` 대신 `:value="currentQuery"` + `@input`으로 바꿨습니다.  
부모는 `props`로 내려주고, 입력값은 `emits`로만 올립니다.  
추천 호출은 `WeatherComposition`에서 `setTimeout` / `clearTimeout`으로 약 280ms 뒤에 `buildSuggestions`가 돌게 해서, Axios 요청 횟수를 줄였습니다.

### 2) 상세 진입 시 API가 한 번 더 나감

홈(`WeatherComposition`)에서 받은 도시를 Pinia `weatherStore.saveCity`로 넣어 두었는데도,  
상세(`WeatherDetailView`)에 들어가면 `useRoute().params.cityId`를 `watch` / `onMounted`로 보고 `fetchWeatherById`를 또 호출했습니다.

그래서 Store에 `resolveCityForDetail`을 두고, `storeToRefs`로 쓰는 `cities`에 이미 있으면 Axios를 생략하고, 없을 때만 `fetchWeatherById`를 타게 바꿨습니다.  
뷰는 `await weatherStore.resolveCityForDetail(cityId)`만 호출하면 됩니다.

### 3) 카드 문구가 전부 Cloudy처럼 보임

카드 문구를 `computed(() => getWeatherMeta(selectedCity))`로 뽑고 있었는데,  
안에서 영문 `main`만 보고 `Cloudy` 같은 고정 문자열을 넣고 있었습니다.  
그래서 템플릿 `{{ summary }}` / `{{ description }}`이 전부 비슷해 보였습니다.

Axios 요청 파라미터에 `lang: 'kr'`를 넣고, 응답의 `weather[0].description`과 `icon`을 `mapWeatherMain`에서 쓰도록 고쳤습니다.  
화면에는 그 결과를 `props`로 카드·패널에 내려 `v-if` / 바인딩으로 표시합니다.

### 4) 도시명이 영어로 저장/표시됨

OpenWeather 응답의 `name`이 `Hawaii`처럼 영어인 경우가 많아,  
`v-for`로 그리는 `WeatherCityList`와 상세 패널 `props.city.name`이 영문으로 남았습니다.

`cityMapping`의 `toKoreanCityName`으로 먼저 맞추고, 안 되면 Axios로 Reverse Geocoding을 한 뒤 `local_names.ko`를 `name`에 넣습니다.  
그 city 객체를 Pinia에 저장하면, 홈·상세가 같은 `storeToRefs` 상태를 쓰니 한글 표시가 같이 맞춰집니다.

### 5) `alert` vs 라우터

Hands-on 1에서는 상세 버튼에 `@click.stop` + `window.alert`를 썼습니다.  
Router 과제에서는 같은 버튼에서 `useRouter()`의 `router.push('/weather/' + id)`로 바꾸었습니다.

`@click.stop`은 그대로 두어 카드 전체 `@click`(선택/`emits`)과 겹치지 않게 했고,  
이동만 Vue Router programmatic navigation으로 처리했습니다.  
상세 쪽은 `App.vue`의 `RouterView` + `KeepAlive` 안에 들어가서, 필요하면 캐시된 뷰를 다시 씁니다.

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

