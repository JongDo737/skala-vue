<script setup>
/**
 * [props] : cityItem — 선택된(목록의) 도시 객체
 * [emits] : select-card — 카드 클릭
 * [emits] : click-detail — 상세보기 클릭 (.stop으로 버블링 차단)
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
      <span v-if="cityItem.status === '맑음'">맑음</span>
      <span v-else-if="cityItem.status === '비'">비</span>
      <span v-else-if="cityItem.status === '구름'">구름</span>
      <span v-else>{{ cityItem.status }}</span>
    </p>

    <span v-if="cityItem.temp >= 25" class="badge hot">더움 (25도 이상)</span>
    <span v-else class="badge cool">선선함 (25도 미만)</span>

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
