<script setup>
/*
  ============================================================================
  WeatherCompositionCard.vue — Composition 선택 도시 카드
  ============================================================================

  [역할]
  선택된 도시의 기온·요약·아이콘을 보여주고,
  카드 선택·상세보기 이벤트를 부모에 전달한다.

  [동작 방식]
  - inject(themeMode) + configStore.unit 로 표시/단위 반영
  - computed(displayTemp) 로 섭씨/화씨 변환
  - 상세 버튼은 @click.stop 으로 select-card 버블링 방지
  - onMounted / onUpdated / onUnmounted 로 생명주기 로그

  [분리한 이유]
  카드 UI·단위 변환·생명주기 실습을 부모(WeatherComposition)에서 분리한다.

*/

import { computed, inject, onMounted, onUpdated, onUnmounted } from 'vue'
import { useConfigStore } from '@/stores/configStore'
import IconWeatherCard from '@/components/icons/IconWeatherCard.vue'

// [lifecycle] : setup
console.log('[lifecycle] WeatherCompositionCard setup')

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
// inject: 조상이 provide 한 테마
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
        <div class="city-name">{{ city.name }} / {{ city.description || city.status }}</div>
      </div>
    </div>

    <i class="wi weather-icon-badge" :class="icon" aria-hidden="true" />

    <!-- v-if: 상세 버튼 표시 여부 -->
    <button
      v-if="showDetailButton"
      class="wc-card-detail"
      type="button"
      @click.stop="emit('click-detail', city.name, city.status)"
    >
      <!-- @click.stop: 카드 select-card 버블링 방지 (과제 이벤트 수식어 요구) -->
      <!-- 상세 동작은 부모에서 alert → router.push 로 개선 -->
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
