/**
 * ============================================================================
 * weatherService.js — OpenWeather API 연동
 * ============================================================================
 *
 * [역할]
 * OpenWeather Current Weather / Geocoding API를 호출하고,
 * 응답을 화면용 city 객체로 변환한다. API 키는 Vite env에서 읽는다.
 *
 * [동작 방식]
 * 1) VITE_OPENWEATHER_API_KEY 로 인증 파라미터 구성
 * 2) resolveCityQuery 로 한글 입력을 영문 q 로 변환 후 GET
 * 3) mapWeatherResponse / mapWeatherMain 으로 UI 모델 매핑
 * 4) 필요 시 reverse geocoding 으로 한글 도시명 보정
 *
 */

import { get } from '@/services/httpService.js'
import { resolveCityQuery, toKoreanCityName } from '@/models/cityMapping.js'

// Vite 환경변수 — .env 의 VITE_ 접두사 변수만 클라이언트에 노출됨
const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY
const BASE_WEATHER = 'https://api.openweathermap.org/data/2.5/weather'
const BASE_GEO = 'https://api.openweathermap.org/geo/1.0'

if (!API_KEY) {
  console.warn(
    '[weatherService] VITE_OPENWEATHER_API_KEY 가 없습니다. 프로젝트 루트 .env 를 확인하세요.',
  )
}

const defaultParams = {
  appid: API_KEY,
  units: 'metric', // 섭씨
  lang: 'kr', // 설명 문구 한글
}

const hasHangul = (text) => /[가-힣]/.test(text || '')

/**
 * OpenWeather main/icon/description → 앱 상태 키
 * icon 코드가 main 보다 안정적이라 우선 사용 (01=맑음, 02~04=구름, 09~11=비 …)
 */
export function mapWeatherMain(main = '', description = '', icon = '') {
  const iconPrefix = String(icon || '').slice(0, 2)

  if (iconPrefix === '01') return '맑음'
  if (['02', '03', '04'].includes(iconPrefix)) return '구름'
  if (['09', '10', '11'].includes(iconPrefix)) return '비'
  if (iconPrefix === '13') return '구름' // 눈 → 카드 타입은 cloud 계열
  if (iconPrefix === '50') return '구름' // 안개

  // icon 없을 때 main 문자열 폴백
  const key = (main || '').toLowerCase()
  if (key === 'clear') return '맑음'
  if (key === 'clouds') return '구름'
  if (key === 'rain' || key === 'drizzle' || key === 'thunderstorm') return '비'
  if (key === 'snow') return '구름'
  if (key === 'mist' || key === 'fog' || key === 'haze' || key === 'smoke' || key === 'dust' || key === 'sand') {
    return '구름'
  }
  if (key === 'squall' || key === 'tornado') return '바람'

  if (description.includes('맑')) return '맑음'
  if (description.includes('비') || description.includes('뇌우')) return '비'
  if (description.includes('구름') || description.includes('흐림') || description.includes('안개')) {
    return '구름'
  }

  return '구름'
}

/** API 응답 → 화면용 city 객체 */
export function mapWeatherResponse(data, displayName = null) {
  const weather0 = data.weather?.[0] || {}
  const status = mapWeatherMain(weather0.main, weather0.description, weather0.icon)
  const name = displayName || toKoreanCityName(data.name) || data.name || '알 수 없음'

  return {
    id: String(data.id),
    name,
    queryName: data.name,
    temp: Math.round(data.main?.temp ?? 0),
    feelsLike: Math.round(data.main?.feels_like ?? 0),
    tempMin: Math.round(data.main?.temp_min ?? 0),
    tempMax: Math.round(data.main?.temp_max ?? 0),
    status,
    humidity: data.main?.humidity ?? 0,
    pressure: data.main?.pressure ?? 0,
    wind: Number((data.wind?.speed ?? 0).toFixed(1)),
    windDeg: data.wind?.deg ?? null,
    visibility: data.visibility ?? 0,
    clouds: data.clouds?.all ?? 0,
    country: data.sys?.country || '',
    lat: data.coord?.lat,
    lon: data.coord?.lon,
    description: weather0.description || status,
    mainEn: weather0.main || '',
    iconCode: weather0.icon || '',
  }
}

/** 영문 name 이면 reverse geocoding 으로 한글 표시명 보정 */
export async function ensureKoreanCityName(city) {
  if (!city) return city
  if (hasHangul(city.name)) return city

  const mapped = toKoreanCityName(city.name)
  if (hasHangul(mapped) && mapped !== city.name) {
    return { ...city, name: mapped }
  }

  if (city.lat == null || city.lon == null) return city

  try {
    const place = await reverseGeo(city.lat, city.lon)
    if (place?.name && hasHangul(place.name)) {
      return { ...city, name: place.name }
    }
    // local_names 없어도 en 표기 대신 "영문명 (국가)" 정도는 유지
    if (place?.en) {
      return { ...city, name: place.name || place.en }
    }
  } catch (error) {
    console.warn('[weather] 한글 도시명 보정 실패', error)
  }

  return city
}

/** 도시명(한글/영문)으로 현재 날씨 — resolveCityQuery 후 GET */
export async function fetchWeatherByCityName(input) {
  const { query, ko } = resolveCityQuery(input)
  if (!query) throw new Error('도시명이 비어 있습니다.')

  const data = await get(BASE_WEATHER, {
    params: {
      ...defaultParams,
      q: query,
    },
  })

  const preferred = hasHangul(input) ? input.trim() : ko
  let city = mapWeatherResponse(data, preferred && hasHangul(preferred) ? preferred : null)
  city = await ensureKoreanCityName(city)
  return city
}

/** 좌표로 현재 날씨 GET */
export async function fetchWeatherByCoords(lat, lon, displayName = null) {
  const data = await get(BASE_WEATHER, {
    params: {
      ...defaultParams,
      lat,
      lon,
    },
  })
  let city = mapWeatherResponse(
    data,
    displayName && hasHangul(displayName) ? displayName : null,
  )
  city = await ensureKoreanCityName(city)
  return city
}

/** OpenWeather city id 로 조회 GET */
export async function fetchWeatherById(cityId) {
  const data = await get(BASE_WEATHER, {
    params: {
      ...defaultParams,
      id: cityId,
    },
  })
  let city = mapWeatherResponse(data)
  city = await ensureKoreanCityName(city)
  return city
}

/** Geocoding 직접 검색 (한글/영문 추천용) GET */
export async function searchGeoCities(input, limit = 6) {
  const { query } = resolveCityQuery(input)
  const q = query || input?.trim()
  if (!q) return []

  const list = await get(`${BASE_GEO}/direct`, {
    params: {
      q,
      limit,
      appid: API_KEY,
    },
  })

  return (list || []).map((item) => {
    const koName = item.local_names?.ko || toKoreanCityName(item.name)
    const displayName = hasHangul(koName) ? koName : item.name
    return {
      name: displayName,
      en: item.name,
      country: item.country,
      state: item.state || '',
      lat: item.lat,
      lon: item.lon,
      label: [displayName, item.state, item.country].filter(Boolean).join(', '),
    }
  })
}

/** 역지오코딩 — 현재 위치 지명 GET */
export async function reverseGeo(lat, lon) {
  const list = await get(`${BASE_GEO}/reverse`, {
    params: {
      lat,
      lon,
      limit: 1,
      appid: API_KEY,
    },
  })
  const item = list?.[0]
  if (!item) return null
  const koName = item.local_names?.ko || toKoreanCityName(item.name)
  return {
    name: hasHangul(koName) ? koName : item.name,
    en: item.name,
    lat: item.lat,
    lon: item.lon,
  }
}

/** 브라우저 Geolocation → 좌표 Promise */
export function getCurrentPosition() {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('이 브라우저는 위치 정보를 지원하지 않습니다.'))
      return
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        resolve({
          lat: pos.coords.latitude,
          lon: pos.coords.longitude,
        })
      },
      (err) => reject(err),
      { enableHighAccuracy: false, timeout: 8000, maximumAge: 60000 },
    )
  })
}

/** 현재 위치 → 역지오코딩 → 날씨 */
export async function fetchWeatherForCurrentLocation() {
  const { lat, lon } = await getCurrentPosition()
  const place = await reverseGeo(lat, lon)
  return fetchWeatherByCoords(lat, lon, place?.name || null)
}
