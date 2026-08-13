<script setup>
/*
  ============================================================================
  WeatherEmptyResult.vue — 검색 결과 없음 안내
  ============================================================================

  [역할]
  필터 결과가 비었을 때 보여줄 안내 문구를 담당한다.

  [동작 방식]
  props.text 가 있으면 그 문구를, 없으면 기본 문구를 표시한다.

  [분리한 이유]
  Mockup에 있던 빈 결과 문구를 재사용 가능한 컴포넌트로 빼
  WeatherParent 템플릿을 가볍게 유지한다.

*/

defineProps({
  text: {
    type: String,
    default: '검색 결과와 일치하는 도시가 없습니다.',
  },
})
</script>

<template>
  <p class="empty-result">{{ text }}</p>
</template>

<style scoped>
.empty-result {
  text-align: center;
  color: #e74c3c;
  padding: 10px 0;
  margin: 0;
  font-size: 14px;
}
</style>
