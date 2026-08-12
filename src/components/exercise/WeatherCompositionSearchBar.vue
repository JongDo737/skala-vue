<script setup>
import { inject } from 'vue'

/**
 * [props] : currentQuery, resultLabel, hotCount, tryCount, favoriteName
 * [emits] : update-query — 검색어를 부모에게 전달
 */
defineProps({
  currentQuery: {
    type: String,
    default: '',
  },
  resultLabel: {
    type: String,
    default: '',
  },
  hotCount: {
    type: Number,
    default: 0,
  },
  tryCount: {
    type: Number,
    default: 0,
  },
  favoriteName: {
    type: String,
    default: '',
  },
})

const emit = defineEmits(['update-query'])

const themeMode = inject('themeMode', { value: 'light' })

const onInput = (event) => {
  emit('update-query', event.target.value)
}
</script>

<template>
  <div class="wc-search" :class="themeMode">
    <div class="wc-search-toolbar">
      <input
        type="text"
        :value="currentQuery"
        @input="onInput"
        placeholder="도시 검색"
      />
    </div>
    <p class="wc-search-hint">
      검색: <strong>{{ currentQuery || '전체' }}</strong>
      · {{ resultLabel }}
      · 더운 도시 {{ hotCount }}개
      · 입력 횟수 {{ tryCount }}
    </p>
    <p class="wc-search-hint">즐겨찾기: {{ favoriteName }}</p>
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

.wc-search-hint {
  margin: 8px 0 0;
  font-size: 11px;
  line-height: 1.45;
  color: var(--wc-muted, #666);
  word-break: keep-all;
}
</style>
