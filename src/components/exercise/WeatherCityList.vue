<script setup>
import { inject } from 'vue'

/**
 * [props] : cities(목록), selectedId(현재 선택)
 * [emits] : select-city — 도시 클릭 시 부모로 전달
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

// [inject] : 부모가 provide한 테마 모드
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

    <p v-else class="empty-cities">
      검색 결과가 일치하는 도시가 없습니다.
    </p>
  </aside>
</template>
