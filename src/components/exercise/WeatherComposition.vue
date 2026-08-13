<script setup>
/*
  ============================================================================
  WeatherComposition.vue — Composition API 날씨 화면(부모)
  ============================================================================

  [역할]
  날씨 API·Pinia 스토어·검색 추천·라우터 이동을 묶는 Composition 화면의 부모다.
  검색 레일(Teleport)·도시 목록·카드·푸터 자식을 props/emits로 연결한다.

  [동작 방식]
  1) storeToRefs 로 weatherStore / favoriteStore 상태를 반응형으로 사용
  2) 마운트 시 서울·현재 위치 날씨 로드 (KeepAlive 캐시가 있으면 스킵)
  3) 검색어 debounce → 추천 목록 → 선택 시 API 조회 후 store 저장
  4) watch / watchEffect 로 상태·검색어 변화 추적
  5) 상세는 router.push 로 WeatherDetail 이동

*/

import {
  ref,
  computed,
  watch,
  watchEffect,
  inject,
  onMounted,
  onActivated,
  onDeactivated,
} from 'vue'
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import WeatherCompositionSection from './WeatherCompositionSection.vue'
import WeatherCompositionSearchBar from './WeatherCompositionSearchBar.vue'
import WeatherCompositionCard from './WeatherCompositionCard.vue'
import WeatherCityList from './WeatherCityList.vue'
import WeatherCompositionFooter from './WeatherCompositionFooter.vue'
import WeatherCompositionEmpty from './WeatherCompositionEmpty.vue'
import { formatTodayLabel, getWeatherMeta } from '@/models/weatherModel.js'
import { filterMappedCities } from '@/models/cityMapping.js'
import {
  fetchWeatherByCityName,
  fetchWeatherByCoords,
  fetchWeatherForCurrentLocation,
  searchGeoCities,
} from '@/services/weatherService.js'
import { useFavoriteStore } from '@/stores/favoriteStore'
import { useWeatherStore } from '@/stores/weatherStore'
import '@/assets/weather-composition.css'

console.log('[lifecycle] WeatherComposition setup')

const router = useRouter()
const weatherStore = useWeatherStore()
// storeToRefs: Pinia state를 구조 분해해도 반응성 유지
const { cities: weatherList, selectedCityId, statusMessage, selectedCity } =
  storeToRefs(weatherStore)

const searchQuery = ref('')
const isLoading = ref(false)
const loadError = ref('')
const suggestions = ref([])
const isSuggestLoading = ref(false)
let suggestTimer = null

const favoriteStore = useFavoriteStore()
const { favoriteCityId } = storeToRefs(favoriteStore)

// inject: App 등 조상이 provide 한 themeMode
const themeMode = inject('themeMode', ref('light'))

// computed: 선택 도시 메타(아이콘·요약·타입) 파생
const weatherMeta = computed(() => getWeatherMeta(selectedCity.value))
const weatherType = computed(() => weatherMeta.value.type)
const weatherIcon = computed(() => weatherMeta.value.icon)
const weatherSummary = computed(() => weatherMeta.value.summary)
const todayLabel = computed(() => formatTodayLabel())

const loadInitialCities = async () => {
  isLoading.value = true
  loadError.value = ''
  weatherStore.statusMessage = '서울·현재 위치 날씨를 불러오는 중...'

  try {
    const seoul = await fetchWeatherByCityName('서울')
    weatherStore.saveCity(seoul, `${seoul.name}이 선택되었습니다.`)
    favoriteStore.setFavorite(seoul)
  } catch (error) {
    console.error('[weather] 서울 조회 실패', error)
    loadError.value = '서울 날씨를 불러오지 못했습니다. 네트워크·API 키를 확인해 주세요.'
  }

  try {
    const here = await fetchWeatherForCurrentLocation()
    weatherStore.saveCity(here, `${here.name}(현재 위치)이 선택되었습니다.`)
  } catch (error) {
    console.warn('[weather] 현재 위치 조회 스킵', error)
    if (!loadError.value && selectedCity.value) {
      weatherStore.statusMessage = `${selectedCity.value.name}이 선택되었습니다. (위치 권한 없음 → 서울만 표시)`
    }
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  console.log('[lifecycle] WeatherComposition onMounted')
  // KeepAlive 재진입 시 이미 캐시가 있으면 재호출하지 않음
  if (weatherList.value.length === 0) {
    loadInitialCities()
  }
})

// KeepAlive: 활성화/비활성화에 맞춰 Teleport 검색 레일 표시
const railVisible = ref(true)
onActivated(() => {
  railVisible.value = true
})
onDeactivated(() => {
  railVisible.value = false
})

// watch: statusMessage 한 값만 추적
watch(statusMessage, (newInfo, oldInfo) => {
  console.log(`[watch] 상태바 문구 변경`)
  console.log(`  이전: "${oldInfo}"`)
  console.log(`  현재: "${newInfo}"`)
})

// watchEffect: 내부에서 읽은 searchQuery·weatherList 를 자동 추적
watchEffect(() => {
  console.log(`[watchEffect] 현재 검색어 '${searchQuery.value}' 추적 중`)
  console.log(`[watchEffect] 목록 개수: ${weatherList.value.length}`)
})

watch(selectedCityId, (newId) => {
  const city = weatherStore.getCachedCity(newId)
  const isFavorite = String(newId) === String(favoriteCityId.value)
  console.log(
    `[watch] 선택 도시: ${city?.name ?? newId} / 즐겨찾기: ${isFavorite ? 'O' : 'X'}`,
  )
})

const selectCity = (city) => {
  weatherStore.selectCity(city)
}

const goDetail = (cityId) => {
  const id = cityId || selectedCity.value?.id
  if (!id) return
  // [과제 초기] window.alert 로 상세 표시
  // [개선] Vue Router programmatic navigation — router.push('/weather/' + id)
  // 이미 weatherStore 에 저장된 데이터로 상세 이동 (추가 API 없음)
  router.push('/weather/' + id)
}

const buildSuggestions = async (query) => {
  const mapped = filterMappedCities(query).map((item) => ({
    name: item.ko,
    en: item.en,
    label: `${item.ko} / ${item.en}`,
    lat: null,
    lon: null,
    source: 'map',
  }))

  let geo = []
  try {
    isSuggestLoading.value = true
    geo = await searchGeoCities(query, 6)
    geo = geo.map((item) => ({ ...item, source: 'geo' }))
  } catch (error) {
    console.warn('[geo] 추천 검색 실패', error)
  } finally {
    isSuggestLoading.value = false
  }

  const merged = [...mapped]
  geo.forEach((g) => {
    const exists = merged.some(
      (m) => m.en.toLowerCase() === g.en.toLowerCase() || m.name === g.name,
    )
    if (!exists) merged.push(g)
  })
  suggestions.value = merged.slice(0, 10)
}

const onUpdateQuery = (val) => {
  searchQuery.value = val

  // debounce: 한글 입력 중 API를 매 글자마다 치지 않도록 지연
  if (suggestTimer) clearTimeout(suggestTimer)
  const query = val.trim()
  if (!query) {
    suggestions.value = []
    return
  }

  suggestTimer = setTimeout(() => {
    buildSuggestions(query)
  }, 280)
}

const onSelectSuggestion = async (item) => {
  searchQuery.value = item.name
  suggestions.value = []
  weatherStore.statusMessage = `${item.name} 날씨를 불러오는 중...`
  isLoading.value = true

  try {
    let city
    if (item.lat != null && item.lon != null) {
      city = await fetchWeatherByCoords(item.lat, item.lon, item.name)
    } else {
      city = await fetchWeatherByCityName(item.en || item.name)
    }
    weatherStore.saveCity(city, `${city.name}이 선택되었습니다.`)
  } catch (error) {
    console.error('[weather] 검색 도시 조회 실패', error)
    weatherStore.statusMessage = `'${item.name}' 날씨를 불러오지 못했습니다.`
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <!-- Teleport: 검색 UI를 레이아웃의 좌측 슬롯으로 이동 -->
  <Teleport to="#weather-left-search-slot">
    <div v-if="railVisible" class="weather-left-search" :class="themeMode">
      <WeatherCompositionSection title="도시 검색">
        <WeatherCompositionSearchBar
          :current-query="searchQuery"
          :suggestions="suggestions"
          :is-suggest-loading="isSuggestLoading"
          @update-query="onUpdateQuery"
          @select-suggestion="onSelectSuggestion"
        />
      </WeatherCompositionSection>
    </div>
  </Teleport>

  <div class="weather-composition" :class="themeMode">
    <div class="background">
      <div class="container" :class="[weatherType, themeMode]">
        <WeatherCompositionSection title="지역별 날씨 현황" class="wc-main-section">
          <!-- v-if / v-else-if / v-else: 로딩·에러·목록·빈 상태 분기 -->
          <p v-if="isLoading" class="layout-empty">날씨 데이터를 불러오는 중...</p>
          <p v-else-if="loadError && weatherList.length === 0" class="layout-empty">
            {{ loadError }}
          </p>

          <div class="layout layout--home" v-else-if="weatherList.length > 0 && selectedCity">
            <WeatherCityList
              :cities="weatherList"
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
          v-if="selectedCity || statusMessage"
          :message="statusMessage"
        />
      </div>
    </div>
  </div>
</template>
