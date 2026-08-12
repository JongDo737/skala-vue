<script setup>
/**
 * [App] : 좌측(라우트+검색 슬롯) / 우측(RouterView)
 *
 * [기존]
 * - 단위: UnitToggler 컴포넌트
 * - 테마: App 인라인 <button> 또는 ThemeToggler 별도 파일
 * → UI·파일이 겹침
 *
 * [리팩토링]
 * - ConfigToggler 한 파일 + 같은 버튼 디자인
 * - type props 로 기능만 다르게 적용
 *   <ConfigToggler type="unit" />
 *   <ConfigToggler type="theme" />
 */
import { provide, computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useConfigStore } from '@/stores/configStore'
import ConfigToggler from '@/components/exercise/ConfigToggler.vue'
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
        <ConfigToggler type="unit" />
        <ConfigToggler type="theme" />
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
