<script setup>
/**
 * [props] : currentQuery — 부모의 searchQuery를 내려받아 표시
 * [emits] : update-query — 입력 시 검색어를 부모에게 전달
 */
defineEmits(['update-query'])

defineProps({
  currentQuery: {
    type: String,
    default: '',
  },
})
</script>

<template>
  <div class="search-inner">
    <input
      type="text"
      :value="currentQuery"
      @input="$emit('update-query', $event.target.value)"
      placeholder="검색할 도시 이름 입력"
    />
    <p class="search-hint">
      검색 중인 도시: <strong>{{ currentQuery || '전체' }}</strong>
    </p>
  </div>
</template>

<style scoped>
.search-inner input {
  padding: 8px;
  width: 90%;
  font-size: 14px;
  border: 1px solid #ced4da;
  border-radius: 4px;
  box-sizing: border-box;
}

.search-hint {
  margin: 8px 0 0;
  font-size: 13px;
  color: #555;
}
</style>
