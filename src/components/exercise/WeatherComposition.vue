<script setup>
import { ref, computed, watch, watchEffect, inject, onMounted, onActivated, onDeactivated } from 'vue'
import { useRouter } from 'vue-router'
import WeatherCompositionSection from './WeatherCompositionSection.vue'
import WeatherCompositionSearchBar from './WeatherCompositionSearchBar.vue'
import WeatherCompositionCard from './WeatherCompositionCard.vue'
import WeatherCityList from './WeatherCityList.vue'
import WeatherCompositionFooter from './WeatherCompositionFooter.vue'
import WeatherCompositionEmpty from './WeatherCompositionEmpty.vue'
import '@/assets/weather-composition.css'

// 디자인 참고 : Animated Weather Cards

console.log('[lifecycle] WeatherComposition setup')

const router = useRouter()

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

/* 테마는 App에서 provide — Composition/라우터 공통 사용 */
const themeMode = inject('themeMode', ref('light'))

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

/* KeepAlive 시에도 검색 레일이 다른 라우트에 남지 않도록 */
const railVisible = ref(true)
onActivated(() => {
  railVisible.value = true
})
onDeactivated(() => {
  railVisible.value = false
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

// [router] alert 대신 Programmatic Navigation
const goDetail = (cityId) => {
  const id = cityId || selectedCity.value?.id
  if (!id) return
  router.push('/weather/' + id)
}

const onUpdateQuery = (val) => {
  searchQuery.value = val
  searchTryCount.value += 1
}
</script>

<template>
  <!-- 검색은 App 좌측 레일로 Teleport (라우트와 같은 열) -->
  <Teleport to="#weather-left-search-slot">
    <div v-if="railVisible" class="weather-left-search" :class="themeMode">
      <WeatherCompositionSection title="도시 검색">
        <WeatherCompositionSearchBar
          :current-query="searchQuery"
          :result-label="searchResultLabel"
          :hot-count="hotCityCount"
          :try-count="searchTryCount"
          :favorite-name="favoriteCity.name"
          @update-query="onUpdateQuery"
        />
      </WeatherCompositionSection>
    </div>
  </Teleport>

  <div class="weather-composition" :class="themeMode">
    <div class="background">
      <div class="container" :class="[weatherType, themeMode]">
        <WeatherCompositionSection title="지역별 날씨 현황" class="wc-main-section">
          <div class="layout layout--home" v-if="filteredWeatherList.length > 0 && selectedCity">
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
                @select-card="selectCity"
                @click-detail="goDetail(selectedCity.id)"
              />
            </main>
          </div>

          <WeatherCompositionEmpty v-else />
        </WeatherCompositionSection>

        <WeatherCompositionFooter
          v-if="selectedCity"
          :message="selectedCityInfo"
        />
      </div>
    </div>
  </div>
</template>
