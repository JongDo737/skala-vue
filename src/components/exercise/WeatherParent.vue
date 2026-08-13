<script setup>
import { ref, computed, watch, watchEffect } from 'vue'
import BaseDashboardCard from './BaseDashboardCard.vue'
import SearchBar from './SearchBar.vue'
import WeatherCard from './WeatherCard.vue'
import WeatherStatusBar from './WeatherStatusBar.vue'
import WeatherEmptyResult from './WeatherEmptyResult.vue'

// [1] 모든 반응형 데이터는 부모(WeatherParent)에 유지
const weatherList = ref([
  { id: 'city_01', name: '서울', temp: 28, status: '맑음' },
  { id: 'city_02', name: '수원', temp: 24, status: '비' },
  { id: 'city_03', name: '부산', temp: 26, status: '구름' },
  // Mockup에서 쓰던 도시 데이터를 확장
  { id: 'city_04', name: '인천', temp: 22, status: '비' },
  { id: 'city_05', name: '대전', temp: 20, status: '구름' },
  { id: 'city_06', name: '제주', temp: 19, status: '바람' },
])

const searchQuery = ref('')
const selectedCityInfo = ref('카드를 클릭하거나 검색해 보세요.')

const filteredWeatherList = computed(() => {
  const query = searchQuery.value.trim()
  if (!query) return weatherList.value
  return weatherList.value.filter((item) => item.name.includes(query))
})

watch(selectedCityInfo, (newInfo) => {
  console.log(`[watch] 상태바 문구 변경 -> "${newInfo}"`)
})

watchEffect(() => {
  console.log(`[watchEffect] 검색어 '${searchQuery.value}' 필터링`)
})

const showDetail = (cityName, status) => {
  window.alert(`${cityName}의 현재 날씨는 [${status}] 상태입니다.`)
}

const onUpdateQuery = (val) => {
  searchQuery.value = val
}

const onSelectCard = (msg) => {
  selectedCityInfo.value = msg
}
</script>

<template>
  <div class="dashboard-wrapper">
    <!--
      [2][참고] BaseDashboardCard의 slot 안에 SearchBar/WeatherCard를 넣어도
      컴파일은 WeatherParent 스코프라서 props/emits로 부모와 직접 통신한다.
    -->
    <BaseDashboardCard>
      <template #title>
        <h3>도시 검색</h3>
      </template>
      <!-- [3] SearchBar: props(currentQuery) / emits(update-query) -->
      <SearchBar :current-query="searchQuery" @update-query="onUpdateQuery" />
    </BaseDashboardCard>

    <BaseDashboardCard>
      <template #title>
        <h3>지역별 날씨 현황</h3>
      </template>

      <!-- [4] WeatherCard: props(cityItem) / emits(select-card, click-detail) -->
      <WeatherCard
        v-for="item in filteredWeatherList"
        :key="item.id"
        :city-item="item"
        @select-card="onSelectCard"
        @click-detail="showDetail"
      />

      <!-- [7] Mockup 안내 문구를 WeatherEmptyResult 컴포넌트로 추가 분리 -->
      <WeatherEmptyResult v-if="filteredWeatherList.length === 0" />
    </BaseDashboardCard>

    <!-- [7] Mockup status-bar를 WeatherStatusBar 컴포넌트로 추가 분리 -->
    <WeatherStatusBar :message="selectedCityInfo" />
  </div>
</template>

<style scoped>
.dashboard-wrapper {
  width: 600px;
  margin: 0 auto;
}
</style>
