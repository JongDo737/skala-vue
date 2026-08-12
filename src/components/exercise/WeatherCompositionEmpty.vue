<script setup>
/**
 * [component] : 검색 결과 없음 안내 (Composition용)
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
