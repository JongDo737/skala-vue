<script setup>
/**
 * [component] : 검색 결과 없음 안내
 * Mockup의 빈 결과 문구를 재사용 가능한 컴포넌트로 분리
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
