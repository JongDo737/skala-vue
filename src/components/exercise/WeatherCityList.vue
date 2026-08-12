<script setup>
import { inject } from 'vue'

/**
 * [props] : cities, selectedId
 * [emits] : select-city
 */
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
const themeMode = inject('themeMode', { value: 'light' })
</script>

<template>
  <aside class="toc" :class="themeMode">
    <p class="toc-title">도시</p>
    <ul v-if="cities.length > 0">
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
