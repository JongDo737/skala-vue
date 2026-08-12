<script setup>
import { inject } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const themeMode = inject('themeMode', { value: 'light' })

const goHome = () => {
  router.push({ name: 'WeatherHome' })
}
</script>

<template>
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
