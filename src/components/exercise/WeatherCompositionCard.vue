<script setup>
import { computed, inject, onMounted, onUpdated, onUnmounted } from 'vue'
import { useConfigStore } from '@/stores/configStore'
import IconWeatherCard from '@/components/icons/IconWeatherCard.vue'

// [lifecycle] : setup
console.log('[lifecycle] WeatherCompositionCard setup')

/**
 * [props] : city, dateLabel, summary, icon — 선택 도시 표시
 * [emits] : select-card — 카드 선택
 * [emits] : click-detail — 상세보기
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
  showDetailButton: {
    type: Boolean,
    default: true,
  },
  detailButtonLabel: {
    type: String,
    default: '상세보기',
  },
})

const emit = defineEmits(['select-card', 'click-detail'])
const themeMode = inject('themeMode', { value: 'light' })
const configStore = useConfigStore()

// [기존] 템플릿에서 city.temp + 'c' 고정 표시
// [현재] configStore.unit 기준으로 섭씨/화씨 변환 후 unitSymbol 표시
const displayTemp = computed(() => {
  const rawTemp = props.city.temp // 원본은 섭씨
  if (configStore.unit === 'fahrenheit') {
    return Math.round((rawTemp * 9) / 5 + 32)
  }
  return rawTemp
})

onMounted(() => {
  console.log('[lifecycle] WeatherCompositionCard onMounted', props.city.name)
})

onUpdated(() => {
  console.log('[lifecycle] WeatherCompositionCard onUpdated', props.city.name)
})

onUnmounted(() => {
  console.log('[lifecycle] WeatherCompositionCard onUnmounted')
})
</script>

<template>
  <div
    class="weather-card-shell"
    id="card"
    :class="themeMode"
    @click="emit('select-card', city)"
  >
    <IconWeatherCard />

    <div class="details">
      <div class="temp">{{ displayTemp }}<span>{{ configStore.unitSymbol }}</span></div>
      <div class="right">
        <div class="date">{{ dateLabel }}</div>
        <div class="summary">{{ summary }}</div>
        <div class="city-name">{{ city.name }} / {{ city.status }}</div>
      </div>
    </div>

    <i class="wi weather-icon-badge" :class="icon" aria-hidden="true" />

    <button
      v-if="showDetailButton"
      class="wc-card-detail"
      type="button"
      @click.stop="emit('click-detail', city.name, city.status)"
    >
      {{ detailButtonLabel }}
    </button>
  </div>
</template>

<style scoped>
/* 카드 시각 스타일은 weather-composition.css의 .weather-card-shell 규칙을 사용 */
.wc-card-detail {
  position: absolute;
  left: 16px;
  bottom: 16px;
  z-index: 2;
  padding: 6px 10px;
  cursor: pointer;
  border: 1px solid rgba(255, 255, 255, 0.35);
  border-radius: 6px;
  background: rgba(255, 255, 255, 0.85);
  font-size: 12px;
  font-weight: 600;
  color: #333;
}

.wc-card-detail:hover {
  border-color: #4444ff;
  color: #4444ff;
}

.dark .wc-card-detail {
  background: rgba(20, 28, 48, 0.75);
  border-color: rgba(255, 255, 255, 0.25);
  color: #f2f5ff;
}
</style>
