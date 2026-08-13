<script setup>
/*
  ============================================================================
  WeatherMockup.vue — 날씨 대시보드 단일 파일 목업
  ============================================================================

  [역할]
  컴포넌트 분리 전에 검색·목록·상태바를 한 파일에서 동작시켜 보는 연습용 목업이다.

  [동작 방식]
  1) weatherList를 v-for로 렌더
  2) :value/@input으로 searchQuery 갱신 (한글 입력 실습)
  3) 카드 클릭으로 selectedCityInfo 갱신, 상세는 @click.stop + alert

*/

import { ref } from 'vue'

// 4일차 API 연동을 대비한 가상의 백엔드 데이터 배열 (v-for 및 :key 실습용)
const weatherList = ref([
  { id: 'city_01', name: '서울', temp: 28, status: '맑음' },
  { id: 'city_02', name: '수원', temp: 24, status: '비' },
  { id: 'city_03', name: '부산', temp: 26, status: '구름' },
  { id: 'city_04', name: '인천', temp: 22, status: '비' },
  { id: 'city_05', name: '대전', temp: 20, status: '구름' },
  { id: 'city_06', name: '대구', temp: 24, status: '비' },
  { id: 'city_07', name: '광주', temp: 26, status: '구름' },
  { id: 'city_08', name: '울산', temp: 22, status: '비' },
])

// 검색어 및 알림창 제어용 데이터 (v-model 대용 한글 처리 및 이벤트 실습용)
const searchQuery = ref('')
const selectedCityInfo = ref('카드를 클릭하거나 검색해 보세요.')

// 알림 대행 함수 (window 객체 격리 우회)
const showDetail = (cityName, status) => {
  window.alert(`${cityName}의 현재 날씨는 [${status}] 상태입니다.`)
}
</script>

<template>
  <div class="dashboard-wrapper">
    <section class="search-box">
      <h3>🔍 도시 검색</h3>
      <!-- input type="text" v-model="searchQuery" placeholder="검색할 도시 이름 입력" / -->
      <!-- 한글 IME: v-model 대신 :value + @input -->
      <input type="text" :value="searchQuery" @input="(e) => (searchQuery = e.target.value)" placeholder="검색할 도시 이름 입력" />
      <p>
        검색 중인 도시: <strong>{{ searchQuery }}</strong>
      </p>
    </section>

    <section class="list-box">
      <h3>🏙️ 지역별 날씨 현황</h3>

      <!-- v-for + :key: 각 도시 카드 식별 -->
      <div v-for="item in weatherList" :key="item.id" class="weather-card" @click="selectedCityInfo = `${item.name}이 선택되었습니다.`">
        <h4>{{ item.name }} ({{ item.status }})</h4>

        <!-- 기온 상태 표시 (v-if를 이용한 status 값 조건식 표시) -->
        <p>
          현재 기온: {{ item.temp }}°C
          <span v-if="item.status === '맑음'">🌞</span>
          <span v-else-if="item.status === '비'">🌧️</span>
          <span v-else-if="item.status === '구름'">⛅</span>
        </p>
        <span v-if="item.temp >= 25" class="badge hot">더움</span>
        <span v-else class="badge cool">신선함</span>

        <!-- @click.stop: 상세 클릭이 카드 선택 이벤트로 전파되지 않게 -->
        <button class="btn-detail" @click.stop="showDetail(item.name, item.status)">상세보기</button>
      </div>
    </section>

    <div class="status-bar">
      {{ selectedCityInfo }}
    </div>
  </div>
</template>
