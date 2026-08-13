/**
 * [model] 날씨 표시용 유틸
 * [기존] WEATHER_LIST mock 배열 → [현재] OpenWeather API 응답을 mapWeatherResponse 로 변환
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
  return new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  }).format(new Date())
}

/** 목록에 도시 upsert (id 기준) */
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
