<script setup>
import { inject } from 'vue'

/**
 * [props] : city, favoriteName, dateLabel, summary
 * [emits] : toggle-favorite — 즐겨찾기 버튼 클릭 시 부모로 전달
 */
defineProps({
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

// [inject] : 부모가 provide한 테마 모드
const themeMode = inject('themeMode', { value: 'light' })
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
        <dd>{{ city.temp }}°C</dd>
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
