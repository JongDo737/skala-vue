/**
 * ============================================================================
 * weatherStore.js — 날씨 목록·선택 캐시 Store
 * ============================================================================
 *
 * [역할]
 * API로 받은 도시 날씨를 cities에 캐시하고, 상세 페이지에서 재호출을 줄인다.
 *
 * [동작 방식]
 * 1) saveCity() 로 upsert + 선택 id 갱신
 * 2) getCachedCity() 로 캐시 조회
 * 3) resolveCityForDetail() 는 hit면 API 생략, miss일 때만 fetchWeatherById
 *
 */

import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { findCityById, upsertCity } from '@/models/weatherModel.js'
import { fetchWeatherById } from '@/services/weatherService.js'

export const useWeatherStore = defineStore('weather', () => {
  const cities = ref([]) // 검색/조회된 도시 캐시
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

    // 캐시 hit → 네트워크 호출 없이 바로 사용
    const cached = getCachedCity(cityId)
    if (cached) {
      selectedCityId.value = String(cached.id)
      statusMessage.value = `${cached.name}이 선택되었습니다. (캐시)`
      return { city: cached, fromCache: true, error: null }
    }

    // 캐시 miss → city id 로 API 조회 후 저장
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
