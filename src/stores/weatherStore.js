import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { findCityById, upsertCity } from '@/models/weatherModel.js'
import { fetchWeatherById } from '@/services/weatherService.js'

/**
 * [weatherStore] 날씨 목록·선택 상태 캐시
 *
 * [기존 문제]
 * - 홈에서 API로 받은 뒤, 상세(/weather/:id) 진입 시 fetchWeatherById 를 다시 호출
 *
 * [최적화]
 * - 첫 응답을 cities 에 저장
 * - 상세는 캐시 hit 시 API 생략, miss 일 때만 GET
 */
export const useWeatherStore = defineStore('weather', () => {
  const cities = ref([])
  const selectedCityId = ref('')
  const statusMessage = ref('')

  const selectedCity = computed(() => {
    return findCityById(cities.value, selectedCityId.value) || cities.value[0] || null
  })

  function saveCity(city, message = '') {
    if (!city?.id) return
    cities.value = upsertCity(cities.value, city)
    selectedCityId.value = String(city.id)
    if (message) statusMessage.value = message
  }

  function selectCity(city, message = '') {
    if (!city?.id) return
    selectedCityId.value = String(city.id)
    statusMessage.value = message || `${city.name}이 선택되었습니다.`
  }

  function getCachedCity(cityId) {
    return findCityById(cities.value, cityId)
  }

  /**
   * 상세 진입용: 캐시 우선, 없을 때만 API
   * @returns {{ city: object|null, fromCache: boolean, error: string|null }}
   */
  async function resolveCityForDetail(cityId) {
    if (!cityId) {
      return { city: null, fromCache: false, error: 'cityId가 없습니다.' }
    }

    const cached = getCachedCity(cityId)
    if (cached) {
      selectedCityId.value = String(cached.id)
      statusMessage.value = `${cached.name}이 선택되었습니다. (캐시)`
      return { city: cached, fromCache: true, error: null }
    }

    try {
      const city = await fetchWeatherById(cityId)
      saveCity(city, `${city.name}이 선택되었습니다.`)
      return { city, fromCache: false, error: null }
    } catch (error) {
      console.error('[weatherStore] 상세 API 실패', error)
      statusMessage.value = '도시 날씨를 불러오지 못했습니다.'
      return { city: null, fromCache: false, error: statusMessage.value }
    }
  }

  return {
    cities,
    selectedCityId,
    statusMessage,
    selectedCity,
    saveCity,
    selectCity,
    getCachedCity,
    resolveCityForDetail,
  }
})
