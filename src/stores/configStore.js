/**
 * ============================================================================
 * configStore.js — 단위·테마 전역 설정 Store
 * ============================================================================
 *
 * [역할]
 * 온도 단위(℃/℉)와 테마(light/dark)를 Pinia에서 한곳에서 관리한다.
 *
 * [동작 방식]
 * 1) unit / themeMode 를 ref state 로 보관
 * 2) unitSymbol, isDark 는 computed getter
 * 3) toggleUnit / toggleTheme action 으로 값 전환
 * (예전에는 테마를 App.vue provide/inject 로 따로 두었음)
 *
 */

import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useConfigStore = defineStore('config', () => {
  // ── 단위 ──────────────────────────────────────────────
  const unit = ref('celsius') // state

  // getter: 현재 단위에 맞는 기호
  const unitSymbol = computed(() => {
    return unit.value === 'celsius' ? '℃' : '℉'
  })

  // action: celsius ↔ fahrenheit
  function toggleUnit() {
    unit.value = unit.value === 'celsius' ? 'fahrenheit' : 'celsius'
  }

  // ── 테마 ──────────────────────────────────────────────
  const themeMode = ref('light') // 'light' | 'dark'

  const isDark = computed(() => themeMode.value === 'dark')

  function toggleTheme() {
    themeMode.value = themeMode.value === 'light' ? 'dark' : 'light'
  }

  return {
    unit,
    unitSymbol,
    toggleUnit,
    themeMode,
    isDark,
    toggleTheme,
  }
})
