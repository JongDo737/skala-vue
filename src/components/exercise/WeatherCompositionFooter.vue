<script setup>
import { inject } from 'vue'

/**
 * [props] : message — 상태바 문구
 * [emits] : click-detail — 상세보기 버튼 클릭
 */
defineProps({
  message: {
    type: String,
    required: true,
  },
  cityName: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    required: true,
  },
})

const emit = defineEmits(['click-detail'])
const themeMode = inject('themeMode', { value: 'light' })
</script>

<template>
  <div class="wc-footer" :class="themeMode">
    <button
      class="wc-btn-detail"
      type="button"
      @click.stop="emit('click-detail', cityName, status)"
    >
      상세보기
    </button>
    <div class="wc-status-bar">{{ message }}</div>
  </div>
</template>

<style scoped>
.wc-footer {
  margin-top: 16px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 100%;
}

.wc-btn-detail {
  width: 100%;
  padding: 12px 14px;
  cursor: pointer;
  border: 1px solid var(--wc-border, #ccc);
  border-radius: 8px;
  background: var(--wc-panel-bg, rgba(255, 255, 255, 0.95));
  font-size: 14px;
  font-weight: 600;
  color: var(--wc-text, #333);
  box-sizing: border-box;
}

.wc-btn-detail:hover {
  border-color: #4444ff;
  color: #4444ff;
}

.wc-status-bar {
  width: 100%;
  background: rgba(232, 245, 233, 0.95);
  padding: 10px;
  text-align: center;
  color: #2e7d32;
  font-weight: bold;
  border-radius: 6px;
  box-sizing: border-box;
  font-size: 13px;
}

.wc-footer.dark .wc-status-bar {
  background: rgba(46, 125, 50, 0.25);
  color: #a5d6a7;
}
</style>
