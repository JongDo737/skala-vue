<script setup>
import { computed, inject } from 'vue'
import { useConfigStore } from '@/stores/configStore'

/**
 * [props] : city, favoriteName, dateLabel, summary
 * [emits] : toggle-favorite
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

// [기존] {{ city.temp }}°C 고정
// [현재] configStore 단위에 맞춰 displayTemp + unitSymbol
const displayTemp = computed(() => {
  const rawTemp = props.city.temp // 원본은 섭씨
  if (configStore.unit === 'fahrenheit') {
    return Math.round((rawTemp * 9) / 5 + 32)
  }
  return rawTemp
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
        <dt>날짜</dt>
        <dd>{{ dateLabel }}</dd>
      </div>
      <div>
        <dt>날씨</dt>
        <dd>{{ city.status }} ({{ summary }})</dd>
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
        <dt>풍속</dt>
        <dd>{{ city.wind }} m/s</dd>
      </div>
      <div>
        <dt>체감</dt>
        <dd>
          <!-- 체감 기준은 원본 섭씨 온도 기준 유지 -->
          <span v-if="city.temp >= 25" class="badge hot">더움 (25도 이상)</span>
          <span v-else class="badge cool">선선함 (25도 미만)</span>
        </dd>
      </div>
      <div>
        <dt>즐겨찾기</dt>
        <dd>{{ favoriteName }}</dd>
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
