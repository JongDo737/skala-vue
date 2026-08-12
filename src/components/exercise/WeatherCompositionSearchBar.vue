<script setup>
import { inject } from 'vue'

/**
 * [props] : currentQuery, resultLabel, hotCount, tryCount, favoriteName
 * [emits] : update-query — 검색어를 부모에게 전달
 * [emits] : toggle-theme — 테마 토글 요청
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

const emit = defineEmits(['update-query', 'toggle-theme'])

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
      <button class="wc-btn-theme" type="button" @click="emit('toggle-theme')">
        {{ themeMode === 'light' ? '다크모드' : '라이트모드' }}
      </button>
    </div>
    <p class="wc-search-hint">
      검색: <strong>{{ currentQuery || '전체' }}</strong>
      · {{ resultLabel }}
      · 더운 도시 {{ hotCount }}개
      · 입력 횟수 {{ tryCount }}
      · 테마 {{ themeMode }}
    </p>
    <p class="wc-search-hint">즐겨찾기: {{ favoriteName }}</p>
  </div>
</template>

<style scoped>
.wc-search-toolbar {
  display: flex;
  gap: 10px;
  align-items: center;
}

.wc-search-toolbar input {
  flex: 1;
  width: 100%;
  box-sizing: border-box;
  padding: 8px 12px;
  border: 1px solid var(--wc-border, rgba(0, 0, 0, 0.08));
  border-radius: 8px;
  font-size: 13px;
  font-family: inherit;
  background: var(--wc-input-bg, rgba(255, 255, 255, 0.85));
  color: var(--wc-text, #333);
}

.wc-btn-theme {
  flex-shrink: 0;
  padding: 8px 12px;
  border: 1px solid var(--wc-border, rgba(0, 0, 0, 0.08));
  border-radius: 8px;
  background: var(--wc-panel-bg, rgba(255, 255, 255, 0.85));
  color: var(--wc-text, #333);
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
}

.wc-btn-theme:hover {
  border-color: #4444ff;
  color: #4444ff;
}

.wc-search-hint {
  margin: 6px 0 0;
  font-size: 12px;
  color: var(--wc-muted, #666);
}
</style>
