<script setup>
import { inject } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const themeMode = inject('themeMode', { value: 'light' })

const handleGoHome = () => {
  router.push('/')
}
</script>

<template>
  <div class="weather-route-page about-page" :class="themeMode">
    <h3>서비스 소개</h3>
    <hr />

    <div class="description-box">
      <p>
        본 앱은 <strong>Vue 3</strong> 및 <strong>Vue Router 4</strong> 기반 실습용 기상 관측
        대시보드입니다.
      </p>
      <ul>
        <li><code>WeatherComposition</code> 기반 메인 대시보드</li>
        <li>상세보기는 <code>/weather/:cityId</code>로 이동</li>
        <li>Lazy Loading / Catch-all Route 적용</li>
      </ul>
    </div>

    <button type="button" class="home-btn" @click="handleGoHome">대시보드 홈으로 이동</button>
  </div>
</template>

<style scoped>
.about-page h3 {
  margin: 0 0 8px;
}

.description-box {
  background-color: var(--app-bg, #fff);
  padding: 16px;
  border-radius: 8px;
  line-height: 1.5;
  font-size: 14px;
  border: 1px solid var(--app-border, #e9ecef);
  color: var(--app-text, #2c3e50);
}

ul {
  padding-left: 20px;
  margin: 8px 0 0;
}

li {
  margin-bottom: 6px;
  color: var(--app-muted, #555);
}

code {
  background-color: #ffeaa7;
  padding: 2px 4px;
  border-radius: 4px;
  color: #d63031;
}

.about-page.dark code {
  background-color: rgba(255, 234, 167, 0.2);
  color: #ffd56a;
}

.home-btn {
  width: 100%;
  margin-top: 20px;
  padding: 10px;
  background-color: #3498db;
  color: white;
  border: none;
  border-radius: 4px;
  font-weight: bold;
  cursor: pointer;
}
</style>
