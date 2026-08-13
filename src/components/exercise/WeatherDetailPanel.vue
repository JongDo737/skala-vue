<script setup>
import { computed, inject } from 'vue'
import { useConfigStore } from '@/stores/configStore'

/**
 * [props] : city, favoriteName, dateLabel, summary
 * [emits] : toggle-favorite
 *
 * 상세 필드는 OpenWeather API(main/wind/clouds/visibility …) 기준으로 표시
 */
const props = defineProps({
  city: {
    type: Object,
    required: true,
  },
  favoriteName: {
    type: String,
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
})

const emit = defineEmits(['toggle-favorite'])
const themeMode = inject('themeMode', { value: 'light' })
const configStore = useConfigStore()

const toDisplayTemp = (celsius) => {
  const raw = Number(celsius) || 0
  if (configStore.unit === 'fahrenheit') {
    return Math.round((raw * 9) / 5 + 32)
  }
  return Math.round(raw)
}

const displayTemp = computed(() => toDisplayTemp(props.city.temp))

const visibilityKm = computed(() => {
  const meters = props.city.visibility
  if (meters == null) return '-'
  return `${(meters / 1000).toFixed(1)} km`
})

const windDegText = computed(() => {
  const deg = props.city.windDeg
  if (deg == null) return '-'
  return `${deg}°`
})
</script>

<template>
  <aside class="detail-panel" :class="themeMode">
    <p class="detail-title">상세 정보</p>
    <dl class="detail-list">
      <div>
        <dt>도시</dt>
        <dd>{{ city.name }}</dd>
      </div>
      <div>
        <dt>국가</dt>
        <dd>{{ city.country || '-' }}</dd>
      </div>
      <div>
        <dt>날짜</dt>
        <dd>{{ dateLabel }}</dd>
      </div>
      <div>
        <dt>날씨</dt>
        <dd>{{ city.description || city.status }}</dd>
      </div>
      <div>
        <dt>기온</dt>
        <dd>{{ displayTemp }}{{ configStore.unitSymbol }}</dd>
      </div>
      <div>
        <dt>습도</dt>
        <dd>{{ city.humidity }}%</dd>
      </div>
      <div>
        <dt>기압</dt>
        <dd>{{ city.pressure ?? '-' }} hPa</dd>
      </div>
      <div>
        <dt>풍속</dt>
        <dd>{{ city.wind }} m/s</dd>
      </div>
      <div>
        <dt>풍향</dt>
        <dd>{{ windDegText }}</dd>
      </div>
      <div>
        <dt>구름량</dt>
        <dd>{{ city.clouds ?? '-' }}%</dd>
      </div>
      <div>
        <dt>가시거리</dt>
        <dd>{{ visibilityKm }}</dd>
      </div>
      <div>
        <dt>체감</dt>
        <dd>
          <span v-if="city.temp >= 25" class="badge hot">더움 (25℃ 이상)</span>
          <span v-else class="badge cool">선선함 (25℃ 미만)</span>
        </dd>
      </div>
    </dl>

    <button class="btn-favorite" type="button" @click="emit('toggle-favorite')">
      현재 도시를 즐겨찾기
    </button>
  </aside>
</template>

<style scoped>
.detail-panel {
  width: 100%;
}
</style>
