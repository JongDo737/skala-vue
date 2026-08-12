<script setup>
/**
 * [App] : 좌측(라우트+검색 슬롯) / 우측(RouterView)
 * 테마(light/dark)를 App에서 provide 해 라우터·내비까지 동일 적용
 */
import { ref, provide, computed } from 'vue'
import '@/assets/weather-app.css'

const themeMode = ref('light')
const toggleTheme = () => {
  themeMode.value = themeMode.value === 'light' ? 'dark' : 'light'
}

provide('themeMode', themeMode)
provide('toggleTheme', toggleTheme)

const shellClass = computed(() => ['weather-app-shell', themeMode.value])
</script>

<template>
  <div :class="shellClass">
    <header class="weather-app-header">
      <h1>과제 4: 라우터적용</h1>
      <button class="app-theme-btn" type="button" @click="toggleTheme">
        {{ themeMode === 'light' ? '다크모드' : '라이트모드' }}
      </button>
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
