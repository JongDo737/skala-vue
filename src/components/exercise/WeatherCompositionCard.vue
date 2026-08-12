<script setup>
import { inject, onMounted, onUpdated, onUnmounted } from 'vue'
import IconWeatherCard from '@/components/icons/IconWeatherCard.vue'

// [lifecycle] : setup 단계. 컴포넌트 인스턴스가 생성될 때 1회 실행
console.log('[lifecycle] WeatherCompositionCard setup')

/**
 * [props] : 부모가 내려준 도시/날짜/요약/아이콘
 * [emits] : 카드 클릭 시 select로 도시 객체를 부모에 전달
 */
const props = defineProps({
  city: {
    type: Object,
    required: true,
  },
  dateLabel: {
    type: String,
    required: true,
  },
  summary: {
    type: String,
    required: true,
  },
  icon: {
    type: String,
    required: true,
  },
})

const emit = defineEmits(['select'])

// [inject] : 부모가 provide한 테마 모드 (light / dark)
const themeMode = inject('themeMode', { value: 'light' })

// [lifecycle] : mount. DOM에 붙은 직후
onMounted(() => {
  console.log('[lifecycle] WeatherCompositionCard onMounted', props.city.name)
})

// [lifecycle] : update. props 변경 등으로 리렌더된 직후
onUpdated(() => {
  console.log('[lifecycle] WeatherCompositionCard onUpdated', props.city.name)
})

// [lifecycle] : unmount. 검색 결과 0개 등으로 카드가 화면에서 사라질 때
onUnmounted(() => {
  console.log('[lifecycle] WeatherCompositionCard onUnmounted')
})
</script>

<template>
  <div
    class="weather-card-shell"
    id="card"
    :class="themeMode"
    @click="emit('select', city)"
  >
    <IconWeatherCard />

    <div class="details">
      <div class="temp">{{ city.temp }}<span>c</span></div>
      <div class="right">
        <div class="date">{{ dateLabel }}</div>
        <div class="summary">{{ summary }}</div>
        <div class="city-name">{{ city.name }} / {{ city.status }}</div>
      </div>
    </div>

    <i class="wi weather-icon-badge" :class="icon" aria-hidden="true" />
  </div>
</template>
