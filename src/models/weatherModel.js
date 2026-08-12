/**
 * [model] 날씨 도시 / 상태 매핑 데이터
 * WeatherComposition, WeatherDetailView에서 공통으로 사용
 */

export const DEFAULT_FAVORITE_CITY_ID = 'city_01'

/** 도시별 날씨 목록 */
export const WEATHER_LIST = [
  { id: 'city_01', name: '서울', temp: 28, status: '맑음', humidity: 48, wind: 2.1 },
  { id: 'city_02', name: '수원', temp: 24, status: '비', humidity: 82, wind: 3.4 },
  { id: 'city_03', name: '부산', temp: 26, status: '구름', humidity: 61, wind: 4.0 },
  { id: 'city_04', name: '인천', temp: 22, status: '비', humidity: 79, wind: 5.2 },
  { id: 'city_05', name: '대전', temp: 20, status: '구름', humidity: 55, wind: 2.8 },
  { id: 'city_06', name: '대구', temp: 24, status: '비', humidity: 74, wind: 3.1 },
  { id: 'city_07', name: '광주', temp: 26, status: '구름', humidity: 58, wind: 2.5 },
  { id: 'city_08', name: '울산', temp: 22, status: '비', humidity: 77, wind: 3.8 },
  { id: 'city_09', name: '제주', temp: 19, status: '바람', humidity: 66, wind: 7.5 },
]

/** 날씨 상태 → 카드 타입 / 아이콘 / 영문 요약 */
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

/** 도시 id로 조회 */
export const findCityById = (cities, cityId) => {
  return cities.find((item) => item.id === cityId) || null
}

/** 선택 도시의 날씨 메타 정보 */
export const getWeatherMeta = (city) => {
  if (!city) return { ...EMPTY_WEATHER_META }
  return (
    WEATHER_STATUS_MAP[city.status] || {
      type: 'cloud',
      icon: 'wi-cloudy',
      summary: city.status,
    }
  )
}

/** 오늘 날짜 라벨 (영문) */
export const formatTodayLabel = () => {
  return new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  }).format(new Date())
}

/** 목록 복사본 (컴포넌트에서 ref로 감쌀 때 사용) */
export const createWeatherList = () => WEATHER_LIST.map((item) => ({ ...item }))
