<script setup>
/*
  ============================================================================
  WeatherDetailPanel.vue — 도시 상세 정보 패널
  ============================================================================

  [역할]
  선택 도시의 OpenWeather 상세 필드와 즐겨찾기 버튼을 보여준다.

  [동작 방식]
  - props.city 의 습도·풍속·가시거리 등을 표시
  - computed 로 단위 변환 기온·가시거리·풍향 문구 계산
  - 즐겨찾기 클릭 시 toggle-favorite emit
  - inject(themeMode) 로 테마 클래스 적용

  [분리한 이유]
  상세 필드 나열 UI를 Composition/Detail 뷰에서 재사용하기 쉽게 분리한다.

*/

import { computed, inject } from 'vue'
import { useConfigStore } from '@/stores/configStore'

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

// computed: 단위 설정에 따라 기온 표시값 갱신
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
          <!-- v-if / v-else: 섭씨 기준 체감 배지 -->
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
