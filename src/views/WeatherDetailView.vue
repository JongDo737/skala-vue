<script setup>
/**
 * [view] : /weather/:cityId
 * 기존 wd-panel 디자인 제거 → Composition 카드 + 상세 정보 패널
 */
import { computed, ref, watch, onMounted, inject } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import WeatherCompositionCard from '../components/exercise/WeatherCompositionCard.vue'
import WeatherDetailPanel from '../components/exercise/WeatherDetailPanel.vue'
import WeatherCityList from '../components/exercise/WeatherCityList.vue'
import '@/assets/weather-composition.css'

const route = useRoute()
const router = useRouter()
const themeMode = inject('themeMode', { value: 'light' })

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

const selectedCityId = ref(route.params.cityId)
const favoriteCityId = ref('city_01')
const statusMessage = ref('')

const selectedCity = computed(() => {
  return weatherList.value.find((item) => item.id === selectedCityId.value) || null
})

const favoriteCity = computed(() => {
  return weatherList.value.find((item) => item.id === favoriteCityId.value) || weatherList.value[0]
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

const todayLabel = computed(() =>
  new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  }).format(new Date()),
)

const syncFromRoute = () => {
  const id = route.params.cityId
  selectedCityId.value = id
  const city = weatherList.value.find((item) => item.id === id)
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
  favoriteCityId.value = selectedCity.value.id
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
