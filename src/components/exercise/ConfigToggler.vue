<script setup>
/**
 * [ConfigToggler] 헤더 설정 토글 버튼 (단일 컴포넌트 재사용)
 *
 * [기존]
 * - UnitToggler.vue : 단위용 UI + 로직 따로
 * - App.vue 인라인 / ThemeToggler.vue : 테마용 UI + 로직 따로
 * → 버튼 디자인이 갈라지고 파일이 늘어남
 *
 * [리팩토링]
 * - 버튼 디자인은 이 파일 하나
 * - props.type 으로 기능만 분기 ('unit' | 'theme')
 * - App에서는 <ConfigToggler type="unit" /> / <ConfigToggler type="theme" /> 로 재사용
 */
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useConfigStore } from '@/stores/configStore'

const props = defineProps({
  /** 'unit' = 섭씨/화씨, 'theme' = 라이트/다크 */
  type: {
    type: String,
    required: true,
    validator: (value) => ['unit', 'theme'].includes(value),
  },
})

const configStore = useConfigStore()
const { unit, themeMode } = storeToRefs(configStore)

const buttonLabel = computed(() => {
  if (props.type === 'unit') {
    return unit.value === 'celsius' ? '화씨(℉)' : '섭씨(℃)'
  }
  // theme
  return themeMode.value === 'light' ? '다크모드' : '라이트모드'
})

const onToggle = () => {
  if (props.type === 'unit') {
    configStore.toggleUnit()
    return
  }
  configStore.toggleTheme()
}
</script>

<template>
  <button type="button" class="config-toggle-btn" @click="onToggle">
    {{ buttonLabel }}
  </button>
</template>

<style scoped>
.config-toggle-btn {
  flex-shrink: 0;
  padding: 7px 12px;
  border-radius: 8px;
  border: 1px solid var(--app-btn-border, #dde2e8);
  background: var(--app-btn-bg, #fff);
  color: var(--app-text, #2c3e50);
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
}

.config-toggle-btn:hover {
  border-color: var(--app-nav-active, #3498db);
  color: var(--app-nav-active, #3498db);
}
</style>
