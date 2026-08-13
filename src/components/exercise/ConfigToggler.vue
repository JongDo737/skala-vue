<script setup>
/*
  ============================================================================
  ConfigToggler.vue — 설정 토글 버튼 (단위/테마)
  ============================================================================

  [역할]
  단위(섭씨/화씨) 또는 테마(라이트/다크) 전환 버튼을 하나로 재사용한다.

  [동작 방식]
  - props.type 이 'unit' | 'theme' 에 따라 라벨·토글 동작을 분기
  - Pinia configStore + storeToRefs 로 unit / themeMode 를 반응형으로 읽음
  - computed 로 버튼 문구를 계산

  [분리한 이유]
  UnitToggler / ThemeToggler 처럼 UI가 갈라지지 않게
  버튼 디자인은 이 파일 하나, 기능만 type으로 나눈다.

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
// storeToRefs: store 상태를 구조 분해해도 반응성 유지
const { unit, themeMode } = storeToRefs(configStore)

// computed: type·store 값에 따라 버튼 라벨 갱신
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
