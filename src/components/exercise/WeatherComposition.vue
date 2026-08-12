<script setup>
import { ref, computed, watch, watchEffect, provide, onMounted } from 'vue'
import WeatherCompositionCard from './WeatherCompositionCard.vue'
import WeatherCityList from './WeatherCityList.vue'
import WeatherDetailPanel from './WeatherDetailPanel.vue'
import '@/assets/weather-composition.css'

// 디자인 참고 : Animated Weather Cards

// [lifecycle] : 부모 setup. 스크립트가 실행되는 시점
console.log('[lifecycle] WeatherComposition setup')

// [ref] : 지역별 날씨 원본 데이터. 왼쪽 목록/검색 필터의 기준 배열로 사용
const weatherList = ref([
  { id: 'city_01', name: '서울', temp: 28, status: '맑음', humidity: 48, wind: 2.1 },
  { id: 'city_02', name: '수원', temp: 24, status: '비', humidity: 82, wind: 3.4 },
  { id: 'city_03', name: '부산', temp: 26, status: '구름', humidity: 61, wind: 4.0 },
  { id: 'city_04', name: '인천', temp: 22, status: '비', humidity: 79, wind: 5.2 },
  { id: 'city_05', name: '대전', temp: 20, status: '구름', humidity: 55, wind: 2.8 },
  { id: 'city_06', name: '대구', temp: 24, status: '비', humidity: 74, wind: 3.1 },
  { id: 'city_07', name: '광주', temp: 26, status: '구름', humidity: 58, wind: 2.5 },
  { id: 'city_08', name: '울산', temp: 22, status: '비', humidity: 77, wind: 3.8 },
  { id: 'city_09', name: '제주', temp: 19, status: '바람', humidity: 66, wind: 7.5 },
])

// [const] : 날씨 status를 type/icon/summary로 한 번에 매핑. 카드 클래스·아이콘·영문 요약에 사용
const statusMap = {
  맑음: { type: 'sun', icon: 'wi-day-sunny', summary: 'Sunny' },
  비: { type: 'rain', icon: 'wi-rain', summary: 'Rain' },
  구름: { type: 'cloud', icon: 'wi-cloudy', summary: 'Cloudy' },
  바람: { type: 'wind', icon: 'wi-strong-wind', summary: 'Windy' },
}

// [ref] : 도시 검색어 상태. input :value/@input 과 필터 계산에 사용
const searchQuery = ref('')

// [ref] : 현재 선택된 도시 id. 중간 카드/오른쪽 상세 패널 연동에 사용
const selectedCityId = ref(weatherList.value[0].id)

// [ref] : 상태바 문구. 도시 선택/즐겨찾기 시 갱신, watch 감시 대상
const selectedCityInfo = ref(`${weatherList.value[0].name}이 선택되었습니다.`)

// [ref] : 즐겨찾기 도시 id. 상세 패널 표시와 비교 로그에 사용
const favoriteCityId = ref('city_01')

// [ref] : 검색 입력 횟수. 타이핑할 때마다 증가해 화면에 표시
const searchTryCount = ref(0)

// [provide] : 테마 모드 (light / dark). 자식들이 inject로 받아 사용
const themeMode = ref('light')

const toggleTheme = () => {
  themeMode.value = themeMode.value === 'light' ? 'dark' : 'light'
}

provide('themeMode', themeMode)
provide('toggleTheme', toggleTheme)

// [computed] : 검색어로 도시 목록을 필터링. 왼쪽 리스트와 결과 안내 문구에 사용
const filteredWeatherList = computed(() => {
  const query = searchQuery.value.trim()
  if (!query) return weatherList.value
  return weatherList.value.filter((item) => item.name.includes(query))
})

// [computed] : 검색 결과 개수 문구 생성. 검색창 아래 힌트 텍스트에 사용
const searchResultLabel = computed(() => {
  const query = searchQuery.value.trim()
  if (!query) return `전체 ${weatherList.value.length}개 도시`
  return `"${query}" 검색 결과 ${filteredWeatherList.value.length}개`
})

// [computed] : 필터된 목록 중 25도 이상 도시 개수. 검색창 아래 통계 표시에 사용
const hotCityCount = computed(() => {
  return filteredWeatherList.value.filter((item) => item.temp >= 25).length
})

// [computed] : 즐겨찾기 id에 해당하는 도시 객체. 상세 패널/힌트에 사용
const favoriteCity = computed(() => {
  return weatherList.value.find((item) => item.id === favoriteCityId.value) || weatherList.value[0]
})

// [computed] : 현재 선택된 도시 객체. 카드·상세·상세보기 버튼의 공통 데이터로 사용
const selectedCity = computed(() => {
  return (
    filteredWeatherList.value.find((item) => item.id === selectedCityId.value) ||
    filteredWeatherList.value[0] ||
    null
  )
})

// [computed] : 선택 도시 status로 CSS type/아이콘/영문 요약을 꺼냄. 카드 UI에 사용
const weatherMeta = computed(() => {
  if (!selectedCity.value) {
    return { type: 'cloud', icon: 'wi-cloudy', summary: '' }
  }
  return (
    statusMap[selectedCity.value.status] || {
      type: 'cloud',
      icon: 'wi-cloudy',
      summary: selectedCity.value.status,
    }
  )
})

const weatherType = computed(() => weatherMeta.value.type)
const weatherIcon = computed(() => weatherMeta.value.icon)
const weatherSummary = computed(() => weatherMeta.value.summary)

// [computed] : 오늘 날짜 영문 라벨. 카드/상세 날짜 표시에 사용
const todayLabel = computed(() =>
  new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  }).format(new Date()),
)

// [lifecycle] : 부모 mount. DOM에 붙은 직후
onMounted(() => {
  console.log('[lifecycle] WeatherComposition onMounted')
})

// [watch] : selectedCityInfo 변경 감지. 상태바 문구가 바뀔 때 콘솔 로그 출력
watch(selectedCityInfo, (newInfo, oldInfo) => {
  console.log(`[watch] 상태바 문구 변경`)
  console.log(`  이전: "${oldInfo}"`)
  console.log(`  현재: "${newInfo}"`)
})

// [watchEffect] : searchQuery 의존성 자동 추적. 검색어 타이핑마다 콘솔 로그 출력
watchEffect(() => {
  console.log(`[watchEffect] 현재 검색어 '${searchQuery.value}' 추적 중`)
  console.log(`[watchEffect] 필터 결과 개수: ${filteredWeatherList.value.length}`)
})

// [watch] : selectedCityId 변경 감지. 선택 도시와 즐겨찾기 비교 로그 출력
watch(selectedCityId, (newId) => {
  const city = weatherList.value.find((item) => item.id === newId)
  const isFavorite = newId === favoriteCityId.value
  console.log(
    `[watch] 선택 도시: ${city?.name ?? newId} / 즐겨찾기: ${isFavorite ? 'O' : 'X'}`,
  )
})

// [watch] : 검색 결과 개수 변경 감지. 필터 결과가 바뀔 때 콘솔 로그 출력
watch(
  () => filteredWeatherList.value.length,
  (newCount, oldCount) => {
    console.log(`[watch] 검색 결과 개수 ${oldCount} → ${newCount}`)
  },
)

// [fn] : 도시 선택. selectedCityId/selectedCityInfo를 갱신해 카드·상태바에 반영
const selectCity = (city) => {
  selectedCityId.value = city.id
  selectedCityInfo.value = `${city.name}이 선택되었습니다.`
}

// [fn] : 상세보기 alert. 하단 버튼 클릭 시 선택 도시 날씨 안내
const showDetail = (cityName, status) => {
  window.alert(`${cityName}의 현재 날씨는 [${status}] 상태입니다.`)
}

// [fn] : 검색 input 핸들러. searchQuery 갱신 + 입력 횟수 증가
const onSearchInput = (event) => {
  searchQuery.value = event.target.value
  searchTryCount.value += 1
}

// [fn] : 현재 선택 도시를 즐겨찾기로 설정. favoriteCityId와 상태바 문구 갱신
const toggleFavorite = () => {
  if (!selectedCity.value) return
  favoriteCityId.value = selectedCity.value.id
  selectedCityInfo.value = `${selectedCity.value.name}을(를) 즐겨찾기로 설정했습니다.`
}
</script>

<template>
  <div class="weather-composition" :class="themeMode">
    <div class="background">
      <div class="container" :class="[weatherType, themeMode]">
        <!-- [template] : 검색 입력 + 테마 토글 -->
        <div class="search-row">
          <div class="search-toolbar">
            <input
              type="text"
              :value="searchQuery"
              @input="onSearchInput"
              placeholder="도시 검색"
            />
            <!-- [provide] : 테마 토글. 자식은 inject('themeMode')로 같은 상태를 받음 -->
            <button class="btn-theme" type="button" @click="toggleTheme">
              {{ themeMode === 'light' ? '다크모드' : '라이트모드' }}
            </button>
          </div>
          <p class="search-hint">
            검색: <strong v-text="searchQuery || '전체'"></strong>
            · {{ searchResultLabel }}
            · 더운 도시 {{ hotCityCount }}개
            · 입력 횟수 {{ searchTryCount }}
            · 테마 {{ themeMode }}
          </p>
          <p class="search-hint">즐겨찾기: {{ favoriteCity.name }}</p>
        </div>

        <!--
          [props/emits]
          - WeatherCityList: cities/selectedId ↓ , select-city ↑
          - WeatherCompositionCard: city/summary/icon ↓ , select ↑
          - WeatherDetailPanel: city/favorite ↓ , toggle-favorite ↑
          검색 결과 0개면 카드가 사라져 onUnmounted 확인 가능
        -->
        <div class="layout" v-if="filteredWeatherList.length > 0 && selectedCity">
          <WeatherCityList
            :cities="filteredWeatherList"
            :selected-id="selectedCity.id"
            @select-city="selectCity"
          />

          <main class="panel">
            <WeatherCompositionCard
              :city="selectedCity"
              :date-label="todayLabel"
              :summary="weatherSummary"
              :icon="weatherIcon"
              @select="selectCity"
            />
          </main>

          <WeatherDetailPanel
            :city="selectedCity"
            :favorite-name="favoriteCity.name"
            :date-label="todayLabel"
            :summary="weatherSummary"
            @toggle-favorite="toggleFavorite"
          />
        </div>

        <p v-else class="empty-cities layout-empty">
          검색 결과가 일치하는 도시가 없습니다.
        </p>

        <!-- [template] : 하단 상세보기 + 상태바 -->
        <div class="footer-actions" v-if="selectedCity">
          <button
            class="btn-detail"
            type="button"
            @click.stop="showDetail(selectedCity.name, selectedCity.status)"
          >
            상세보기
          </button>
          <div class="status-bar">{{ selectedCityInfo }}</div>
        </div>
      </div>
    </div>
  </div>
</template>
