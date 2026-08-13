/**
 * ============================================================================
 * favoriteStore.js — 즐겨찾기 도시 Store
 * ============================================================================
 *
 * [역할]
 * 사용자가 고른 즐겨찾기 도시 id와 이름 snapshot을 전역으로 보관한다.
 *
 * [동작 방식]
 * 1) 초기값으로 서울(DEFAULT_FAVORITE_CITY_ID) snapshot 설정
 * 2) setFavorite(city) 호출 시 id/name 을 갱신
 * 3) favoriteCity computed 로 snapshot을 읽기 전용처럼 노출
 * (기존 mock 목록 조회 → 현재는 API 도시 객체를 직접 저장)
 *
 */

import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { DEFAULT_FAVORITE_CITY_ID } from '@/models/weatherModel.js'

export const useFavoriteStore = defineStore('favorite', () => {
  const favoriteCityId = ref(DEFAULT_FAVORITE_CITY_ID)
  // id + name 만 보관해 목록/API와 느슨하게 연결
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
