<script setup>
/**
 * [component] : 하단 상태바
 * props로 문구를 받아 표시 (Mockup의 status-bar를 컴포넌트로 분리)
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
