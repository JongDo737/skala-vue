<script setup>
/*
  ============================================================================
  SearchBar.vue — 도시 검색 입력
  ============================================================================

  [역할]
  부모의 searchQuery를 받아 표시하고, 입력 변경을 부모로 올린다.

  [동작 방식]
  - props.currentQuery 를 :value 로 표시
  - @input 에서 update-query emit → 부모가 searchQuery를 갱신

  [분리한 이유]
  검색 UI만 따로 두면 WeatherParent는 상태·필터 로직에 집중할 수 있다.

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
    <!-- 한글 조합 중 중간 값이 어긋나지 않도록 v-model 대신 :value + @input -->
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
