<script setup>
/*
  ============================================================================
  WeatherCompositionEmpty.vue — Composition용 빈 결과 안내
  ============================================================================

  [역할]
  날씨 목록이 비었을 때 Composition 화면에 안내 문구를 보여준다.

  [동작 방식]
  props.text 또는 기본 문구를 그대로 표시한다.

  [분리한 이유]
  WeatherComposition 본문에서 빈 상태 UI만 분리해
  로딩/에러/목록 분기와 나란히 읽기 쉽게 한다.

*/

defineProps({
  text: {
    type: String,
    default: '검색 결과가 일치하는 도시가 없습니다.',
  },
})
</script>

<template>
  <p class="wc-empty">{{ text }}</p>
</template>

<style scoped>
.wc-empty {
  margin: 24px 0;
  text-align: center;
  font-size: 14px;
  color: #e74c3c;
}
</style>
