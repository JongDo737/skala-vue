/**
 * ============================================================================
 * main.js — 앱 진입점 (부트스트랩)
 * ============================================================================
 *
 * [역할]
 * Vue 앱을 생성하고, 전역 플러그인(Pinia, Router, Element Plus)을 등록한 뒤
 * #app DOM에 마운트한다.
 *
 * [동작 방식]
 * 1) createApp(App) 으로 루트 인스턴스 생성
 * 2) app.use() 로 Pinia(상태), Router(라우팅), ElementPlus(UI) 등록
 * 3) app.mount('#app') 으로 화면 렌더링 시작
 *
 */

import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router/index.js'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

// 루트 컴포넌트로 앱 인스턴스 생성
const app = createApp(App)

app.use(createPinia()) // 전역 상태 관리
app.use(router) // 클라이언트 사이드 라우팅
app.use(ElementPlus) // UI 컴포넌트 라이브러리

app.mount('#app')
