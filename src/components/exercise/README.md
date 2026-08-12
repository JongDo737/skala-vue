# 날씨 시스템 (Weather Composition) 적용 내용

과제용 날씨 UI에 적용한 Vue 학습 내용을 정리한 문서입니다.  
핵심 화면은 `WeatherComposition.vue`이며, Animated Weather Cards 디자인을 참고했습니다.

---

## 화면 구성

| 위치 | 역할 | 컴포넌트 |
|---|---|---|
| 상단 | 도시 검색 + 다크/라이트 토글 | `WeatherComposition` |
| 왼쪽 | 도시 목록 | `WeatherCityList` |
| 중간 | 날씨 카드 (SVG + 기온/날짜) | `WeatherCompositionCard` |
| 오른쪽 | 상세 정보 + 즐겨찾기 | `WeatherDetailPanel` |
| 하단 | 상세보기 버튼 + 상태바 | `WeatherComposition` |

검색어와 일치하는 도시가 없으면 카드/상세가 사라지고 안내 문구만 표시됩니다.

---

## 파일 구조

```
src/
├── assets/
│   └── weather-composition.css          # 레이아웃 + light/dark 테마
├── components/
│   ├── icons/
│   │   └── IconWeatherCard.vue          # 날씨 카드 SVG (태양/구름/비)
│   └── exercise/
│       ├── WeatherComposition.vue       # 부모 (상태, provide, 조립)
│       ├── WeatherCityList.vue          # 왼쪽 도시 리스트
│       ├── WeatherCompositionCard.vue   # 중간 날씨 카드
│       ├── WeatherDetailPanel.vue       # 오른쪽 상세 패널
│       ├── WeatherMockup.vue            # 과제 1 Mockup
│       ├── WeatherParent.vue            # 과제 3 컴포넌트 분리
│       └── WeatherCard.vue              # Parent용 카드
```

---

## 적용한 Vue 문법

### 1. 반응형 상태 (`ref`)

| 변수 | 역할 |
|---|---|
| `weatherList` | 지역별 날씨 원본 배열 |
| `searchQuery` | 도시 검색어 (`:value` + `@input`) |
| `selectedCityId` | 현재 선택된 도시 id |
| `selectedCityInfo` | 하단 상태바 문구 |
| `favoriteCityId` | 즐겨찾기 도시 id |
| `searchTryCount` | 검색 입력 횟수 |
| `themeMode` | `light` / `dark` 테마 |

### 2. Computed

| 변수 | 역할 |
|---|---|
| `filteredWeatherList` | 검색어가 포함된 도시만 필터링 (비면 원본) |
| `selectedCity` | 현재 선택 도시 객체 |
| `weatherMeta` / `weatherType` / `weatherIcon` / `weatherSummary` | status → 카드 스타일·아이콘·영문 요약 |
| `searchResultLabel` | 검색 결과 개수 문구 |
| `hotCityCount` | 25도 이상 도시 개수 |
| `favoriteCity` | 즐겨찾기 도시 객체 |
| `todayLabel` | 오늘 날짜 영문 라벨 |

### 3. Watch / WatchEffect

- `watch(selectedCityInfo)` — 상태바 문구 변경 시 콘솔 로그
- `watchEffect(searchQuery)` — 검색어 타이핑마다 추적 로그
- `watch(selectedCityId)` — 선택 도시와 즐겨찾기 비교 로그
- `watch(filteredWeatherList.length)` — 검색 결과 개수 변화 로그

### 4. Props & Emits (부모 ↔ 자식)

```
WeatherComposition
  ├─ WeatherCityList
  │    props: cities, selectedId
  │    emit: select-city
  ├─ WeatherCompositionCard
  │    props: city, dateLabel, summary, icon
  │    emit: select
  └─ WeatherDetailPanel
       props: city, favoriteName, dateLabel, summary
       emit: toggle-favorite
```

흐름:

1. 자식에서 클릭 → `emit`
2. 부모가 `selectedCityId` / `selectedCityInfo` 갱신
3. 갱신된 값이 다시 props로 내려가 카드·상세가 바뀜

### 5. Provide & Inject (다크/라이트)

- 부모 `WeatherComposition`에서 `provide('themeMode', themeMode)`, `provide('toggleTheme', toggleTheme)`
- 자식(`WeatherCityList`, `WeatherCompositionCard`, `WeatherDetailPanel`)에서 `inject('themeMode')`
- 검색창 옆 버튼으로 라이트/다크 전환
- CSS: `.weather-composition.light` / `.weather-composition.dark`

props로 테마를 일일이 넘기지 않아도 하위 컴포넌트까지 전달됩니다.

### 6. Lifecycle

`WeatherCompositionCard`에 집중 배치:

| 훅 | 시점 |
|---|---|
| `setup` (스크립트 실행) | 인스턴스 생성 시 1회 |
| `onMounted` | DOM에 붙은 직후 |
| `onUpdated` | props(도시) 변경 후 리렌더 |
| `onUnmounted` | 검색 결과 0개로 카드가 사라질 때 |

부모 `WeatherComposition`에는 `onMounted`만 짧게 둡니다.  
콘솔에서 `[lifecycle]` 로그로 확인할 수 있습니다.

---

## 기본 UI 요구사항 (1일차 계열)

- `v-for` + `:key`로 도시 목록 반복
- `v-if` / `v-else`로 기온 라벨 (25도 이상 더움 / 미만 선선함)
- `:value` + `@input`으로 한글 검색
- 도시 선택 시 상태바 문구 변경
- 상세보기 버튼 `@click.stop` → `window.alert`
- 본인 데이터(제주 등) + 디자인 Mockup 카드

---

## 데이터 예시

```js
{ id: 'city_01', name: '서울', temp: 28, status: '맑음', humidity: 48, wind: 2.1 }
```

`status`는 `statusMap`으로 매핑됩니다.

| status | type | icon | summary |
|---|---|---|---|
| 맑음 | sun | wi-day-sunny | Sunny |
| 비 | rain | wi-rain | Rain |
| 구름 | cloud | wi-cloudy | Cloudy |
| 바람 | wind | wi-strong-wind | Windy |

---

## 확인 방법

1. 앱에서 과제 2(날씨 컴포지션) 화면 열기
2. 브라우저 개발자 도구 콘솔 열기
3. 아래를 순서대로 확인해 보기

| 동작 | 확인 포인트 |
|---|---|
| 도시 클릭 | props/emits로 카드·상세·상태바 갱신, `onUpdated` 로그 |
| 검색어 입력 | `filteredWeatherList` 필터, `watchEffect` 로그 |
| 없는 도시 검색 | 카드 unmount → `onUnmounted` 로그 |
| 다크/라이트 토글 | provide/inject로 전체 테마 변경 |
| 즐겨찾기 / 상세보기 | emit → 부모 처리 |

---

## 관련 스타일

- [`src/assets/weather-composition.css`](../assets/weather-composition.css)
- weather-icons CDN, Lato 폰트 사용
- 과제 2 영역만 `.app-container:has(.weather-composition)`로 넓게 가운데 정렬
