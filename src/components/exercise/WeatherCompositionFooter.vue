<script setup>
import { inject } from 'vue'

/**
 * [props] : message — 상태바 문구
 */
defineProps({
  message: {
    type: String,
    required: true,
  },
})

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
