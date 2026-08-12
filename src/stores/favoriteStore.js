import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import {
  DEFAULT_FAVORITE_CITY_ID,
  WEATHER_LIST,
  findCityById,
} from '@/models/weatherModel.js'

/**
 * [favoriteStore] 즐겨찾기 도시 전역 상태 (추가 Store 제안 1)
 *
 * [기존]
 * - WeatherComposition.vue: const favoriteCityId = ref(DEFAULT_FAVORITE_CITY_ID)
 * - WeatherDetailView.vue:  const favoriteCityId = ref(DEFAULT_FAVORITE_CITY_ID)
 * → 컴포넌트마다 따로 두어서, 상세에서 즐겨찾기를 바꿔도 홈과 값이 안 맞음
 *
 * [개선]
 * - 즐겨찾기 id를 Pinia로 공유 → 메인/상세/검색 힌트가 같은 값을 봄
 */
export const useFavoriteStore = defineStore('favorite', () => {
  // state: 즐겨찾기 도시 id
  const favoriteCityId = ref(DEFAULT_FAVORITE_CITY_ID)

  // getters: id에 해당하는 도시 객체 (모델 데이터 기준)
  const favoriteCity = computed(() => {
    return findCityById(WEATHER_LIST, favoriteCityId.value) || WEATHER_LIST[0]
  })

  // actions: 즐겨찾기 설정
  function setFavorite(cityId) {
    if (!cityId) return
    favoriteCityId.value = cityId
  }

  return {
    favoriteCityId,
    favoriteCity,
    setFavorite,
  }
})
