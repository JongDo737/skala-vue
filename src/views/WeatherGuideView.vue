<script setup>
import { inject } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const themeMode = inject('themeMode', { value: 'light' })
</script>

<template>
  <div class="weather-route-page guide-page" :class="themeMode">
    <h3>날씨 대시보드 이용 가이드</h3>
    <hr />

    <ol class="guide-list">
      <li>홈(`/`)에서 도시를 검색·선택합니다.</li>
      <li>상세보기 버튼을 누르면 `/weather/:cityId` 상세 페이지로 이동합니다.</li>
      <li>소개(`/about`)에서 서비스 설명을 확인합니다.</li>
      <li>잘못된 주소는 Catch-all Route로 404 페이지가 뜹니다.</li>
    </ol>

    <div class="guide-actions">
      <button type="button" @click="router.push('/')">대시보드로 이동</button>
      <button type="button" class="secondary" @click="router.push('/about')">소개 보기</button>
    </div>
  </div>
</template>

<style scoped>
.guide-page h3 {
  margin: 0 0 8px;
}

.guide-list {
  line-height: 1.8;
  color: var(--app-text, #444);
  background: var(--app-bg, #fff);
  border: 1px solid var(--app-border, #e9ecef);
  border-radius: 8px;
  padding: 16px 16px 16px 36px;
  margin: 0;
}

.guide-actions {
  display: flex;
  gap: 8px;
  margin-top: 20px;
}

button {
  padding: 10px 14px;
  border: none;
  border-radius: 6px;
  background: #3498db;
  color: #fff;
  font-weight: 600;
  cursor: pointer;
}

button.secondary {
  background: #7f8c8d;
}

.guide-page.dark button.secondary {
  background: #5a6570;
}
</style>
