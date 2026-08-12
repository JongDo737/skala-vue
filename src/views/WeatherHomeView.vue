<script>
export default {
  name: 'WeatherHomeView',
}
</script>

<script setup>
/**
 * [view] : '/' 메인 대시보드
 * 기존 WeatherComposition UI를 그대로 유지한다.
 */
import WeatherComposition from '../components/exercise/WeatherComposition.vue'
</script>

<template>
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
