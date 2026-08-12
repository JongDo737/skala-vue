<script setup>
/**
 * [App] : 좌측(라우트+검색 슬롯) / 우측(RouterView)
 *
 * [기존 테마]
 *   const themeMode = ref('light')
 *   const toggleTheme = () => { ... }
 *   provide('themeMode', themeMode)
 *   provide('toggleTheme', toggleTheme)
 *
 * [현재]
 *   useConfigStore()의 themeMode / toggleTheme 사용
 *   하위 컴포넌트 호환을 위해 provide는 유지 (inject('themeMode') 그대로 동작)
 *
 * UnitToggler: configStore.unit 토글 (섭씨/화씨)
 */
import { provide, computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useConfigStore } from '@/stores/configStore'
import UnitToggler from '@/components/exercise/UnitToggler.vue'
import '@/assets/weather-app.css'

const configStore = useConfigStore()
const { themeMode } = storeToRefs(configStore)

// [기존] App 로컬 ref provide → [현재] Store 값을 provide (inject 하위 컴포넌트 유지)
provide('themeMode', themeMode)
provide('toggleTheme', configStore.toggleTheme)

const shellClass = computed(() => ['weather-app-shell', themeMode.value])
</script>

<template>
  <div :class="shellClass">
    <header class="weather-app-header">
      <h1>과제 4: 라우터적용</h1>
      <div class="weather-app-header-actions">
        <!-- 단위 토글 (Pinia configStore) -->
        <UnitToggler />
        <!-- 테마 토글 (Pinia configStore.themeMode) -->
        <button class="app-theme-btn" type="button" @click="configStore.toggleTheme()">
          {{ themeMode === 'light' ? '다크모드' : '라이트모드' }}
        </button>
      </div>
    </header>

    <div class="weather-split-body">
      <aside class="weather-left-rail">
        <nav class="navigation-bar navigation-bar--rail">
          <RouterLink to="/" class="nav-item">날씨 대시보드</RouterLink>
          <RouterLink to="/about" class="nav-item">서비스 소개</RouterLink>
          <RouterLink to="/guide" class="nav-item">이용 가이드</RouterLink>
        </nav>

        <!-- 홈 Composition의 검색이 Teleport로 여기 붙음 -->
        <div id="weather-left-search-slot" class="weather-left-search-slot"></div>
      </aside>

      <main class="weather-route-stage">
        <RouterView v-slot="{ Component }">
          <KeepAlive include="WeatherHomeView">
            <component :is="Component" />
          </KeepAlive>
        </RouterView>
      </main>
    </div>
  </div>
</template>
