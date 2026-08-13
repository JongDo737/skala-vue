<script setup>
/*
  ============================================================================
  WeatherCompositionSearchBar.vue — Composition 도시 검색/추천
  ============================================================================

  [역할]
  검색 입력과 추천 목록 UI를 담당하고, 입력·선택 이벤트를 부모에 전달한다.

  [동작 방식]
  - :value + @input → update-query (한글 IME 조합 중 v-model 불안정·과도 호출 방지)
  - 추천 항목 클릭 → select-suggestion
  - inject('themeMode') 로 테마 클래스 적용
  - [기존] 힌트 문구(resultLabel 등) 표시 → [현재] 검색 입력 + 추천 목록만

  [분리한 이유]
  검색/추천 UI를 WeatherComposition의 API·타이머 로직과 분리한다.

*/

import { inject } from 'vue'

defineProps({
  currentQuery: {
    type: String,
    default: '',
  },
  suggestions: {
    type: Array,
    default: () => [],
  },
  isSuggestLoading: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['update-query', 'select-suggestion'])

const themeMode = inject('themeMode', { value: 'light' })

const onInput = (event) => {
  emit('update-query', event.target.value)
}

const onPick = (item) => {
  emit('select-suggestion', item)
}
</script>

<template>
  <div class="wc-search" :class="themeMode">
    <div class="wc-search-toolbar">
      <!-- 한글 IME: v-model 대신 :value + @input -->
      <input
        type="text"
        :value="currentQuery"
        @input="onInput"
        placeholder="도시 검색 (한글/영문)"
        autocomplete="off"
      />
    </div>

    <!-- v-if / v-else-if: 추천 목록 또는 로딩 문구 -->
    <ul v-if="suggestions.length > 0" class="wc-suggest-list">
      <!-- v-for + :key: 추천 항목 식별 (좌표·index 조합) -->
      <li
        v-for="(item, index) in suggestions"
        :key="`${item.en}-${item.lat}-${index}`"
        class="wc-suggest-item"
        @click="onPick(item)"
      >
        <span class="wc-suggest-name">{{ item.name }}</span>
        <span class="wc-suggest-meta">{{ item.label || item.en }}</span>
      </li>
    </ul>
    <p v-else-if="isSuggestLoading" class="wc-search-hint">도시 검색 중...</p>
  </div>
</template>

<style scoped>
.wc-search-toolbar {
  display: flex;
  flex-direction: column;
  gap: 8px;
  align-items: stretch;
}

.wc-search-toolbar input {
  width: 100%;
  box-sizing: border-box;
  padding: 8px 10px;
  border: 1px solid var(--wc-border, rgba(0, 0, 0, 0.08));
  border-radius: 8px;
  font-size: 13px;
  font-family: inherit;
  background: var(--wc-input-bg, rgba(255, 255, 255, 0.85));
  color: var(--wc-text, #333);
}

.wc-suggest-list {
  list-style: none;
  margin: 8px 0 0;
  padding: 0;
  border: 1px solid var(--wc-border, rgba(0, 0, 0, 0.08));
  border-radius: 8px;
  overflow: hidden;
  background: var(--wc-panel-bg, rgba(255, 255, 255, 0.95));
  max-height: 220px;
  overflow-y: auto;
}

.wc-suggest-item {
  display: flex;
  flex-direction: column;
  gap: 2px;
  padding: 8px 10px;
  cursor: pointer;
  border-bottom: 1px solid var(--wc-border, rgba(0, 0, 0, 0.06));
}

.wc-suggest-item:last-child {
  border-bottom: none;
}

.wc-suggest-item:hover {
  background: rgba(68, 68, 255, 0.08);
}

.wc-suggest-name {
  font-size: 13px;
  font-weight: 600;
  color: var(--wc-text, #333);
}

.wc-suggest-meta {
  font-size: 11px;
  color: var(--wc-muted, #666);
}

.wc-search-hint {
  margin: 8px 0 0;
  font-size: 11px;
  line-height: 1.45;
  color: var(--wc-muted, #666);
  word-break: keep-all;
}
</style>
