import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

/**
 * [configStore] 앱 전역 설정 (단위 + 테마)
 *
 * [기존]
 * - 단위: 이 Store의 unit / unitSymbol / toggleUnit 만 사용
 * - 테마: App.vue에서 ref('light') + provide/inject 로 따로 관리
 *
 * [개선]
 * - 테마(themeMode)도 이 Store로 합침 → 단위·테마 설정을 한곳에서 관리
 */
export const useConfigStore = defineStore('config', () => {
  // ── 단위 (과제 기본 요구) ─────────────────────────────
  // 1. state: 단위를 저장 (초기값: 'celsius')
  const unit = ref('celsius')

  // 2. getters: 현재 단위에 맞는 기호 (℃ / ℉)
  const unitSymbol = computed(() => {
    return unit.value === 'celsius' ? '℃' : '℉'
  })

  // 3. actions: celsius ↔ fahrenheit 토글
  function toggleUnit() {
    unit.value = unit.value === 'celsius' ? 'fahrenheit' : 'celsius'
  }

  // ── 테마 (추가 Store 제안 2: configStore 확장) ────────
  // [기존] App.vue
  //   const themeMode = ref('light')
  //   const toggleTheme = () => { themeMode.value = ... }
  //   provide('themeMode', themeMode)
  //
  // [현재] Pinia state/getter/action 으로 이동
  const themeMode = ref('light') // 'light' | 'dark'

  const isDark = computed(() => themeMode.value === 'dark')

  function toggleTheme() {
    themeMode.value = themeMode.value === 'light' ? 'dark' : 'light'
  }

  return {
    // 단위
    unit,
    unitSymbol,
    toggleUnit,
    // 테마
    themeMode,
    isDark,
    toggleTheme,
  }
})
