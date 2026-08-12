<script setup>
/**
 * [view] : /weather/:cityId
 * 기존 wd-panel 디자인 제거 → Composition 카드 + 상세 정보 패널
 */
import { computed, ref, watch, onMounted, inject } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import WeatherCompositionCard from '../components/exercise/WeatherCompositionCard.vue'
import WeatherDetailPanel from '../components/exercise/WeatherDetailPanel.vue'
import WeatherCityList from '../components/exercise/WeatherCityList.vue'
import {
  createWeatherList,
  findCityById,
  formatTodayLabel,
  getWeatherMeta,
} from '@/models/weatherModel.js'
import { useFavoriteStore } from '@/stores/favoriteStore'
import '@/assets/weather-composition.css'

const route = useRoute()
const router = useRouter()
const themeMode = inject('themeMode', { value: 'light' })

const weatherList = ref(createWeatherList())
const selectedCityId = ref(route.params.cityId)
const statusMessage = ref('')

// [기존] const favoriteCityId = ref(DEFAULT_FAVORITE_CITY_ID) + 로컬 favoriteCity computed
// [현재] favoriteStore 공유 — 홈에서 본 즐겨찾기와 상세가 동기화됨
const favoriteStore = useFavoriteStore()
const { favoriteCity } = storeToRefs(favoriteStore)

const selectedCity = computed(() => findCityById(weatherList.value, selectedCityId.value))

const weatherMeta = computed(() => getWeatherMeta(selectedCity.value))
const todayLabel = computed(() => formatTodayLabel())

const syncFromRoute = () => {
  const id = route.params.cityId
  selectedCityId.value = id
  const city = findCityById(weatherList.value, id)
  statusMessage.value = city ? `${city.name}이 선택되었습니다.` : '도시 정보를 찾을 수 없습니다.'
}

onMounted(syncFromRoute)
watch(() => route.params.cityId, syncFromRoute)

const selectCity = (city) => {
  selectedCityId.value = city.id
  statusMessage.value = `${city.name}이 선택되었습니다.`
  router.push('/weather/' + city.id)
}

const toggleFavorite = () => {
  if (!selectedCity.value) return
  // [기존] favoriteCityId.value = selectedCity.value.id
  favoriteStore.setFavorite(selectedCity.value.id)
  statusMessage.value = `${selectedCity.value.name}을(를) 즐겨찾기로 설정했습니다.`
}

const goHome = () => {
  router.push('/')
}
</script>

<template>
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
        <p>cityId에 해당하는 도시가 없습니다.</p>
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
