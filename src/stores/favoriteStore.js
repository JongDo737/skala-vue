import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { DEFAULT_FAVORITE_CITY_ID } from '@/models/weatherModel.js'

/**
 * [favoriteStore] 즐겨찾기 도시 전역 상태
 *
 * [기존] WEATHER_LIST mock 에서 findCityById
 * [현재] API 도시 객체를 snapshot 으로 저장 (mock 목록 제거)
 */
export const useFavoriteStore = defineStore('favorite', () => {
  const favoriteCityId = ref(DEFAULT_FAVORITE_CITY_ID)
  const favoriteCitySnapshot = ref({
    id: DEFAULT_FAVORITE_CITY_ID,
    name: '서울',
  })

  const favoriteCity = computed(() => favoriteCitySnapshot.value)

  function setFavorite(city) {
    if (!city?.id) return
    favoriteCityId.value = String(city.id)
    favoriteCitySnapshot.value = {
      id: String(city.id),
      name: city.name,
    }
  }

  return {
    favoriteCityId,
    favoriteCity,
    setFavorite,
  }
})
