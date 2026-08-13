/**
 * ============================================================================
 * index.js — Vue Router 라우트 정의
 * ============================================================================
 *
 * [역할]
 * URL 경로와 화면(View) 컴포넌트를 연결한다.
 * 홈은 즉시 로드하고, 나머지 페이지는 Lazy Loading으로 필요할 때만 불러온다.
 *
 * [동작 방식]
 * 1) routes 배열에 path / name / component 매핑
 * 2) () => import(...) 형태면 해당 청크를 방문 시점에 로드(코드 스플리팅)
 * 3) /:pathMatch(.*)* 는 매칭 실패 시 404(NotFound)로 보내는 Catch-all
 * 4) createWebHistory() 로 HTML5 History 모드 사용
 *
 */

import { createRouter, createWebHistory } from 'vue-router'
import WeatherHomeView from '../views/WeatherHomeView.vue'

const routes = [
  {
    path: '/',
    name: 'WeatherHome',
    // 홈은 진입 빈도가 높아 Eager Import (즉시 로드)
    component: WeatherHomeView,
  },
  {
    path: '/about',
    name: 'WeatherAbout',
    // Lazy Loading — 방문할 때만 청크를 가져옴
    component: () => import('../views/WeatherAboutView.vue'),
  },
  {
    path: '/weather/:cityId',
    name: 'WeatherDetail',
    // 동적 경로 파라미터(:cityId) + Lazy Loading
    component: () => import('../views/WeatherDetailView.vue'),
  },
  {
    path: '/guide',
    name: 'WeatherGuide',
    component: () => import('../views/WeatherGuideView.vue'),
  },
  {
    // Catch-all — 위에 정의되지 않은 모든 경로 → 404
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('../views/NotFoundView.vue'),
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
