<script setup>
/**
 * ============================================================================
 * WeatherDetailView.vue — 도시 날씨 상세 뷰
 * ============================================================================
 *
 * [역할]
 * /weather/:cityId 상세 화면. 카드·상세 패널·도시 목록을 보여 주고
 * weatherStore 캐시를 우선해 불필요한 API 호출을 막는다.
 *
 * [동작 방식]
 * 1) route.params.cityId 변경을 watch / onMounted 로 감지
 * 2) resolveCityForDetail 로 캐시 hit/miss 처리
 * 3) 선택·즐겨찾기·홈 이동은 store + router 로 처리
 *
 */
import { computed, ref, watch, onMounted, inject } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import WeatherCompositionCard from '../components/exercise/WeatherCompositionCard.vue'
import WeatherDetailPanel from '../components/exercise/WeatherDetailPanel.vue'
import WeatherCityList from '../components/exercise/WeatherCityList.vue'
import { formatTodayLabel, getWeatherMeta } from '@/models/weatherModel.js'
import { useFavoriteStore } from '@/stores/favoriteStore'
import { useWeatherStore } from '@/stores/weatherStore'
import '@/assets/weather-composition.css'

const route = useRoute()
const router = useRouter()
// App에서 provide 한 테마 (없으면 light 기본값)
const themeMode = inject('themeMode', { value: 'light' })

const weatherStore = useWeatherStore()
// store 상태를 반응형으로 분해 (destructure 시 반응성 유지)
const { cities: weatherList, selectedCity, statusMessage } = storeToRefs(weatherStore)

const isLoading = ref(false)
const loadError = ref('')

const favoriteStore = useFavoriteStore()
const { favoriteCity } = storeToRefs(favoriteStore)

const weatherMeta = computed(() => getWeatherMeta(selectedCity.value))
const todayLabel = computed(() => formatTodayLabel())

const syncCity = async (cityId) => {
  if (!cityId) return
  isLoading.value = true
  loadError.value = ''

  // 캐시 우선 조회 (홈에서 이미 받은 도시는 API 생략)
  const result = await weatherStore.resolveCityForDetail(cityId)
  if (result.error && !result.city) {
    loadError.value = result.error
  } else if (result.fromCache) {
    statusMessage.value = `${result.city.name}이 선택되었습니다.`
  }

  isLoading.value = false
}

onMounted(() => syncCity(route.params.cityId))
// 같은 컴포넌트에서 cityId 만 바뀌는 경우 재동기화
watch(
  () => route.params.cityId,
  (id) => syncCity(id),
)

const selectCity = (city) => {
  weatherStore.selectCity(city)
  router.push('/weather/' + city.id)
}

const toggleFavorite = () => {
  if (!selectedCity.value) return
  favoriteStore.setFavorite(selectedCity.value)
  statusMessage.value = `${selectedCity.value.name}을(를) 즐겨찾기로 설정했습니다.`
}

const goHome = () => {
  router.push('/')
}
</script>

<template>
  <!--
    ============================================================================
    WeatherDetailView.vue — 상세 레이아웃
    ============================================================================
    [역할] 도시 목록 + 카드 + 상세 패널 3단 구성
    [동작 방식] selectedCity 가 있으면 본문, 없으면 로딩/에러 안내
  -->
  <div class="weather-composition weather-detail-view" :class="themeMode">
    <div class="background">
      <div
        class="container"
        :class="[weatherMeta.type, themeMode]"
        v-if="selectedCity"
      >
        <section class="wc-section wc-main-section">
          <header class="wc-section-title">
            <h3>지역별 날씨 현황 · 상세</h3>
          </header>
          <div class="wc-section-body">
            <div class="layout layout--detail">
              <WeatherCityList
                :cities="weatherList"
                :selected-id="selectedCity.id"
                @select-city="selectCity"
              />

              <main class="panel">
                <WeatherCompositionCard
                  :city="selectedCity"
                  :date-label="todayLabel"
                  :summary="weatherMeta.summary"
                  :icon="weatherMeta.icon"
                  detail-button-label="대시보드로"
                  @select-card="selectCity"
                  @click-detail="goHome"
                />
              </main>

              <WeatherDetailPanel
                :city="selectedCity"
                :favorite-name="favoriteCity.name"
                :date-label="todayLabel"
                :summary="weatherMeta.summary"
                @toggle-favorite="toggleFavorite"
              />
            </div>
          </div>
        </section>

        <div class="wc-footer" :class="themeMode">
          <div class="wc-status-bar">{{ statusMessage }}</div>
        </div>
      </div>

      <div v-else class="layout-empty">
        <p>{{ isLoading ? '불러오는 중...' : loadError || statusMessage }}</p>
        <button class="wc-back-btn" type="button" @click="goHome">대시보드로</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.weather-detail-view {
  width: 100%;
  height: 100%;
}

.wc-section {
  width: 100%;
  background: var(--wc-panel-bg, rgba(255, 255, 255, 0.85));
  border: 1px solid var(--wc-border, rgba(0, 0, 0, 0.08));
  border-radius: 10px;
  padding: 12px 14px;
  box-sizing: border-box;
}

.wc-section-title h3 {
  margin: 0 0 8px;
  font-size: 13px;
  font-weight: 600;
  color: var(--wc-muted, #666);
}

.wc-footer {
  display: flex;
  gap: 10px;
  align-items: stretch;
  flex-shrink: 0;
}

.wc-back-btn {
  flex-shrink: 0;
  padding: 8px 14px;
  border: 1px solid var(--wc-border, #ccc);
  border-radius: 8px;
  background: var(--wc-panel-bg, #fff);
  color: var(--wc-text, #333);
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
}

.wc-back-btn:hover {
  border-color: #4444ff;
  color: #4444ff;
}

.wc-status-bar {
  flex: 1;
  background: rgba(232, 245, 233, 0.95);
  padding: 8px 12px;
  text-align: center;
  color: #2e7d32;
  font-weight: bold;
  border-radius: 6px;
  font-size: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.dark .wc-status-bar {
  background: rgba(46, 125, 50, 0.25);
  color: #a5d6a7;
}

.layout-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  height: 100%;
  color: var(--wc-muted, #666);
}
</style>
