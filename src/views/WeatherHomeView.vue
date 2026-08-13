<script>
export default {
  name: 'WeatherHomeView',
}
</script>

<script setup>
/**
 * ============================================================================
 * WeatherHomeView.vue — 메인 대시보드 라우트 뷰
 * ============================================================================
 *
 * [역할]
 * '/' 경로의 진입 화면. WeatherComposition 대시보드를 그대로 렌더한다.
 *
 * [동작 방식]
 * 라우터가 이 뷰를 마운트하면 자식 컴포넌트(WeatherComposition)가
 * 검색·카드·상태바 UI를 담당한다. 이 파일은 레이아웃 래퍼 역할이다.
 *
 */
import WeatherComposition from '../components/exercise/WeatherComposition.vue'
</script>

<template>
  <!--
    ============================================================================
    WeatherHomeView.vue — 메인 대시보드
    ============================================================================
    [역할] 홈('/')에서 WeatherComposition 을 전체 영역으로 표시
    [동작 방식] 래퍼 div 안에 대시보드 컴포넌트 1개만 배치
  -->
  <div class="weather-home-fill">
    <WeatherComposition />
  </div>
</template>

<style scoped>
.weather-home-fill {
  width: 100%;
  height: 100%;
  min-height: 0;
  overflow: hidden;
}
</style>
