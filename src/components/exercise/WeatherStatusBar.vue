<script setup>
/*
  ============================================================================
  WeatherStatusBar.vue — 하단 상태바
  ============================================================================

  [역할]
  부모가 넘긴 상태 문구(message)를 하단 바에 표시한다.

  [동작 방식]
  props.message 를 그대로 렌더한다. 로컬 상태는 없다.

  [분리한 이유]
  Mockup의 status-bar를 컴포넌트로 분리해
  선택 결과 표시 UI를 부모와 느슨하게 연결한다.

*/

defineProps({
  message: {
    type: String,
    required: true,
  },
})
</script>

<template>
  <div class="status-bar">
    {{ message }}
  </div>
</template>

<style scoped>
.status-bar {
  background: #e8f5e9;
  padding: 10px;
  text-align: center;
  color: #2e7d32;
  font-weight: bold;
  border-radius: 6px;
}
</style>
