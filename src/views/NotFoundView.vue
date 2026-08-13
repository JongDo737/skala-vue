<script setup>
/**
 * ============================================================================
 * NotFoundView.vue — 404 Catch-all 뷰
 * ============================================================================
 *
 * [역할]
 * 정의되지 않은 URL에 진입했을 때 안내 화면을 보여 준다.
 * 라우터의 `/:pathMatch(.*)*` 에 연결된다.
 *
 * [동작 방식]
 * goHome() 이 name: 'WeatherHome' 으로 이동한다.
 * (path 문자열 대신 name 을 쓰면 경로 변경에도 덜 깨짐)
 *
 */
import { inject } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const themeMode = inject('themeMode', { value: 'light' })

const goHome = () => {
  // path 대신 name 으로 이동 (라우트 이름 기반 네비게이션)
  router.push({ name: 'WeatherHome' })
}
</script>

<template>
  <!--
    ============================================================================
    NotFoundView.vue — 페이지 없음
    ============================================================================
    [역할] 잘못된 주소 안내 + 홈 복귀 CTA
    [동작 방식] Catch-all 매칭 시 이 뷰가 렌더됨
  -->
  <div class="weather-route-page not-found-page" :class="themeMode">
    <div class="not-found-content">
      <div class="error-icon">☀️❓</div>
      <h2>페이지를 찾을 수 없습니다.</h2>
      <p>요청하신 주소가 존재하지 않거나,<br />아직 개발되지 않았습니다.</p>
      <button class="home-button" type="button" @click="goHome">날씨 메인으로 이동</button>
    </div>
  </div>
</template>

<style scoped>
.not-found-page {
  display: flex;
  justify-content: center;
  align-items: center;
}

.not-found-content {
  text-align: center;
  background-color: var(--app-bg, #ffffff);
  padding: 40px;
  border-radius: 16px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.08);
  border: 1px solid var(--app-border, #e9ecef);
  width: 100%;
  max-width: 520px;
}

.not-found-page.dark .not-found-content {
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.35);
}

.error-icon {
  font-size: 4rem;
  margin-bottom: 16px;
}

h2 {
  font-size: 1.6rem;
  font-weight: 700;
  color: var(--app-text, #343a40);
  margin-bottom: 12px;
}

p {
  font-size: 1rem;
  color: var(--app-muted, #6c757d);
  line-height: 1.6;
  margin-bottom: 28px;
}

.home-button {
  background-color: #007bff;
  color: white;
  border: none;
  padding: 12px 28px;
  font-size: 1rem;
  font-weight: 500;
  border-radius: 30px;
  cursor: pointer;
}

.home-button:hover {
  background-color: #0056b3;
}
</style>
