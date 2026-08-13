<script setup>
/*
  ============================================================================
  WeatherCard.vue — 도시 날씨 카드
  ============================================================================

  [역할]
  한 도시의 기온·상태를 보여주고, 카드 선택·상세보기 이벤트를 부모에 알린다.

  [동작 방식]
  - 카드 클릭 → select-card emit
  - 상세보기 버튼 → @click.stop 으로 버블링 차단 후 click-detail emit
  - v-if / v-else-if 로 날씨·기온 배지 표시

  [분리한 이유]
  목록 항목 UI를 반복 렌더(v-for)하기 쉽게 카드 단위로 분리한다.

*/

defineProps({
  cityItem: {
    type: Object,
    required: true,
  },
})

const emit = defineEmits(['select-card', 'click-detail'])
</script>

<template>
  <div
    class="weather-card"
    @click="emit('select-card', `${cityItem.name}이 선택되었습니다.`)"
  >
    <h4>{{ cityItem.name }} ({{ cityItem.status }})</h4>
    <p>
      현재 기온: {{ cityItem.temp }}°C
      <!-- v-if / v-else-if / v-else: 조건에 맞는 요소만 렌더 -->
      <span v-if="cityItem.status === '맑음'">맑음</span>
      <span v-else-if="cityItem.status === '비'">비</span>
      <span v-else-if="cityItem.status === '구름'">구름</span>
      <span v-else>{{ cityItem.status }}</span>
    </p>

    <span v-if="cityItem.temp >= 25" class="badge hot">더움 (25도 이상)</span>
    <span v-else class="badge cool">선선함 (25도 미만)</span>

    <!-- @click.stop: 버튼 클릭이 카드 @click(select-card)까지 올라가지 않게 차단 -->
    <button
      class="btn-detail"
      type="button"
      @click.stop="emit('click-detail', cityItem.name, cityItem.status)"
    >
      상세보기
    </button>
  </div>
</template>

<style scoped>
.weather-card {
  background: #fff;
  border: 1px solid #dee2e6;
  padding: 12px 100px 12px 12px;
  margin-bottom: 10px;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
}

.weather-card h4 {
  margin: 0 0 6px;
  font-size: 15px;
}

.weather-card p {
  margin: 0 0 8px;
  font-size: 13px;
  color: #555;
}

.badge {
  display: inline-block;
  padding: 4px 8px;
  font-size: 12px;
  border-radius: 4px;
  color: #fff;
}

.hot {
  background-color: #ff7675;
}

.cool {
  background-color: #74b9ff;
}

.btn-detail {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  padding: 6px 10px;
  cursor: pointer;
  border: 1px solid #ccc;
  border-radius: 4px;
  background: #fff;
  font-size: 12px;
}

.btn-detail:hover {
  border-color: #3498db;
  color: #3498db;
}
</style>
