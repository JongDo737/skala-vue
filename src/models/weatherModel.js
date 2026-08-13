/**
 * ============================================================================
 * weatherModel.js — 날씨 표시용 모델/유틸
 * ============================================================================
 *
 * [역할]
 * API 응답을 화면에 쓰기 위한 메타(아이콘·타입·요약)와
 * 목록 upsert, 날짜 라벨 등 순수 유틸을 모은다.
 * (기존 mock WEATHER_LIST 대신 API 데이터를 다루는 쪽으로 역할이 바뀜)
 *
 * [동작 방식]
 * 1) WEATHER_STATUS_MAP 으로 status → 카드 type/icon/summary 매핑
 * 2) getWeatherMeta() 가 description을 우선해 요약 문구를 결정
 * 3) upsertCity() 로 id 기준 목록 갱신(있으면 merge, 없으면 push)
 *
 */

export const DEFAULT_FAVORITE_CITY_ID = '1835848' // Seoul (OpenWeather city id)

/** 날씨 상태 → 카드 타입 / 아이콘 / 영문 요약(폴백) */
export const WEATHER_STATUS_MAP = {
  맑음: { type: 'sun', icon: 'wi-day-sunny', summary: 'Sunny' },
  비: { type: 'rain', icon: 'wi-rain', summary: 'Rain' },
  구름: { type: 'cloud', icon: 'wi-cloudy', summary: 'Cloudy' },
  바람: { type: 'wind', icon: 'wi-strong-wind', summary: 'Windy' },
}

export const EMPTY_WEATHER_META = {
  type: 'cloud',
  icon: 'wi-cloudy',
  summary: '',
}

export const findCityById = (cities, cityId) => {
  // id 타입(number/string)이 달라도 비교되도록 String으로 통일
  return cities.find((item) => String(item.id) === String(cityId)) || null
}

/**
 * 카드/상세용 메타
 * summary 는 API 한글 description 을 우선 사용해 "전부 Cloudy"처럼 보이지 않게 함
 */
export const getWeatherMeta = (city) => {
  if (!city) return { ...EMPTY_WEATHER_META }

  const mapped = WEATHER_STATUS_MAP[city.status]
  if (mapped) {
    return {
      ...mapped,
      summary: city.description || city.status || mapped.summary,
    }
  }

  return {
    type: 'cloud',
    icon: 'wi-cloudy',
    summary: city.description || city.status || '',
  }
}

export const formatTodayLabel = () => {
  // 브라우저 로케일 포맷터로 "Thursday, August 13" 형태 라벨 생성
  return new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  }).format(new Date())
}

/** 목록에 도시 upsert (id 기준) — 원본 배열을 직접 수정하지 않음 */
export const upsertCity = (list, city) => {
  const next = [...list]
  const idx = next.findIndex((item) => String(item.id) === String(city.id))
  if (idx >= 0) {
    next[idx] = { ...next[idx], ...city }
  } else {
    next.push(city)
  }
  return next
}
