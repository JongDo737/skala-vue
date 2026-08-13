<script setup>
/*
  ============================================================================
  WeatherCompositionFooter.vue — Composition 하단 상태바
  ============================================================================

  [역할]
  선택/로딩 등 상태 문구를 하단 바에 표시한다.

  [동작 방식]
  - props.message 표시
  - inject('themeMode') 로 dark 스타일 분기

  [분리한 이유]
  푸터/상태바 UI를 메인 레이아웃에서 분리해
  WeatherComposition 템플릿을 단순하게 유지한다.

*/

import { inject } from 'vue'

defineProps({
  message: {
    type: String,
    required: true,
  },
})

// inject: App(또는 조상)이 provide 한 테마
const themeMode = inject('themeMode', { value: 'light' })
</script>

<template>
  <div class="wc-footer" :class="themeMode">
    <div class="wc-status-bar">{{ message }}</div>
  </div>
</template>

<style scoped>
.wc-footer {
  margin-top: 0;
  display: flex;
  flex-direction: row;
  gap: 10px;
  width: 100%;
  flex-shrink: 0;
  align-items: stretch;
}

.wc-status-bar {
  flex: 1;
  background: rgba(232, 245, 233, 0.95);
  padding: 8px 12px;
  text-align: center;
  color: #2e7d32;
  font-weight: bold;
  border-radius: 6px;
  box-sizing: border-box;
  font-size: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.wc-footer.dark .wc-status-bar {
  background: rgba(46, 125, 50, 0.25);
  color: #a5d6a7;
}
</style>
