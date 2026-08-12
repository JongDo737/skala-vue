<script setup>
import { ref, computed, watch, watchEffect, provide, onMounted } from 'vue'
import WeatherCompositionSection from './WeatherCompositionSection.vue'
import WeatherCompositionSearchBar from './WeatherCompositionSearchBar.vue'
import WeatherCompositionCard from './WeatherCompositionCard.vue'
import WeatherCityList from './WeatherCityList.vue'
import WeatherDetailPanel from './WeatherDetailPanel.vue'
import WeatherCompositionFooter from './WeatherCompositionFooter.vue'
import WeatherCompositionEmpty from './WeatherCompositionEmpty.vue'
import '@/assets/weather-composition.css'

// 디자인 참고 : Animated Weather Cards

console.log('[lifecycle] WeatherComposition setup')

// [1] 모든 반응형 데이터는 부모(WeatherComposition)에 유지
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

const statusMap = {
  맑음: { type: 'sun', icon: 'wi-day-sunny', summary: 'Sunny' },
  비: { type: 'rain', icon: 'wi-rain', summary: 'Rain' },
  구름: { type: 'cloud', icon: 'wi-cloudy', summary: 'Cloudy' },
  바람: { type: 'wind', icon: 'wi-strong-wind', summary: 'Windy' },
}

const searchQuery = ref('')
const selectedCityId = ref(weatherList.value[0].id)
const selectedCityInfo = ref(`${weatherList.value[0].name}이 선택되었습니다.`)
const favoriteCityId = ref('city_01')
const searchTryCount = ref(0)

const themeMode = ref('light')
const toggleTheme = () => {
  themeMode.value = themeMode.value === 'light' ? 'dark' : 'light'
}
provide('themeMode', themeMode)
provide('toggleTheme', toggleTheme)

const filteredWeatherList = computed(() => {
  const query = searchQuery.value.trim()
  if (!query) return weatherList.value
  return weatherList.value.filter((item) => item.name.includes(query))
})

const searchResultLabel = computed(() => {
  const query = searchQuery.value.trim()
  if (!query) return `전체 ${weatherList.value.length}개 도시`
  return `"${query}" 검색 결과 ${filteredWeatherList.value.length}개`
})

const hotCityCount = computed(() => {
  return filteredWeatherList.value.filter((item) => item.temp >= 25).length
})

const favoriteCity = computed(() => {
  return weatherList.value.find((item) => item.id === favoriteCityId.value) || weatherList.value[0]
})

const selectedCity = computed(() => {
  return (
    filteredWeatherList.value.find((item) => item.id === selectedCityId.value) ||
    filteredWeatherList.value[0] ||
    null
  )
})

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

const todayLabel = computed(() =>
  new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  }).format(new Date()),
)

onMounted(() => {
  console.log('[lifecycle] WeatherComposition onMounted')
})

watch(selectedCityInfo, (newInfo, oldInfo) => {
  console.log(`[watch] 상태바 문구 변경`)
  console.log(`  이전: "${oldInfo}"`)
  console.log(`  현재: "${newInfo}"`)
})

watchEffect(() => {
  console.log(`[watchEffect] 현재 검색어 '${searchQuery.value}' 추적 중`)
  console.log(`[watchEffect] 필터 결과 개수: ${filteredWeatherList.value.length}`)
})

watch(selectedCityId, (newId) => {
  const city = weatherList.value.find((item) => item.id === newId)
  const isFavorite = newId === favoriteCityId.value
  console.log(
    `[watch] 선택 도시: ${city?.name ?? newId} / 즐겨찾기: ${isFavorite ? 'O' : 'X'}`,
  )
})

watch(
  () => filteredWeatherList.value.length,
  (newCount, oldCount) => {
    console.log(`[watch] 검색 결과 개수 ${oldCount} → ${newCount}`)
  },
)

const selectCity = (city) => {
  selectedCityId.value = city.id
  selectedCityInfo.value = `${city.name}이 선택되었습니다.`
}

const showDetail = (cityName, status) => {
  window.alert(`${cityName}의 현재 날씨는 [${status}] 상태입니다.`)
}

const onUpdateQuery = (val) => {
  searchQuery.value = val
  searchTryCount.value += 1
}

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
        <!--
          [2] WeatherCompositionSection + slot
          부모가 SearchBar를 주입. Slot 안 자식도 부모와 props/emits로 직접 통신.
        -->
        <WeatherCompositionSection title="도시 검색">
          <!-- [3] SearchBar: props / emits(update-query, toggle-theme) -->
          <WeatherCompositionSearchBar
            :current-query="searchQuery"
            :result-label="searchResultLabel"
            :hot-count="hotCityCount"
            :try-count="searchTryCount"
            :favorite-name="favoriteCity.name"
            @update-query="onUpdateQuery"
            @toggle-theme="toggleTheme"
          />
        </WeatherCompositionSection>

        <!-- [2] 리스트/카드/상세를 slot으로 묶는 공통 섹션 -->
        <WeatherCompositionSection title="지역별 날씨 현황">
          <div class="layout" v-if="filteredWeatherList.length > 0 && selectedCity">
            <WeatherCityList
              :cities="filteredWeatherList"
              :selected-id="selectedCity.id"
              @select-city="selectCity"
            />

            <main class="panel">
              <!-- [4] Card: props(city...) / emits(select-card, click-detail) -->
              <WeatherCompositionCard
                :city="selectedCity"
                :date-label="todayLabel"
                :summary="weatherSummary"
                :icon="weatherIcon"
                @select-card="selectCity"
                @click-detail="showDetail"
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

          <!-- [7] Empty 컴포넌트 추가 분리 -->
          <WeatherCompositionEmpty v-else />
        </WeatherCompositionSection>

        <!-- [7] Footer(상태바+상세보기) 추가 분리 -->
        <WeatherCompositionFooter
          v-if="selectedCity"
          :message="selectedCityInfo"
          :city-name="selectedCity.name"
          :status="selectedCity.status"
          @click-detail="showDetail"
        />
      </div>
    </div>
  </div>
</template>
