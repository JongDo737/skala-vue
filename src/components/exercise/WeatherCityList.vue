<script setup>
/*
  ============================================================================
  WeatherCityList.vue — 도시 목록(목차) 사이드
  ============================================================================

  [역할]
  캐시된 도시 목록을 보여주고, 클릭한 도시를 부모에 알린다.

  [동작 방식]
  - props.cities / selectedId 로 목록·선택 표시
  - 항목 클릭 시 select-city emit
  - inject('themeMode') 로 다크/라이트 클래스 적용

  [분리한 이유]
  Composition 화면의 좌측 목차 UI를 카드·상세 패널과 분리해 읽기 쉽게 한다.

*/

import { inject } from 'vue'

defineProps({
  cities: {
    type: Array,
    required: true,
  },
  selectedId: {
    type: String,
    required: true,
  },
})

const emit = defineEmits(['select-city'])
// inject: 조상이 provide 한 themeMode 사용 (없으면 기본 light)
const themeMode = inject('themeMode', { value: 'light' })
</script>

<template>
  <aside class="toc" :class="themeMode">
    <p class="toc-title">도시</p>
    <!-- v-if / v-else: 목록 유무에 따라 리스트 또는 빈 문구 -->
    <ul v-if="cities.length > 0">
      <!-- v-for + :key: 도시 id로 항목 식별 -->
      <li
        v-for="item in cities"
        :key="item.id"
        class="toc-item"
        :class="{ active: item.id === selectedId }"
        @click="emit('select-city', item)"
      >
        {{ item.name }}
      </li>
    </ul>
    <p v-else class="empty-cities">검색 결과가 일치하는 도시가 없습니다.</p>
  </aside>
</template>

<style scoped>
/* 레이아웃 색/간격은 weather-composition.css의 .toc* 를 사용 */
.toc {
  width: 100%;
}
</style>
