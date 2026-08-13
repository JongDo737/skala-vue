/**
 * ============================================================================
 * cityMapping.js — 한글/영문 도시명 매핑
 * ============================================================================
 *
 * [역할]
 * 사용자가 입력한 한글·영문 도시명을 OpenWeather API용 영문 query로 바꾸고,
 * 화면 표시용 한글 이름과 검색 추천 목록을 제공한다.
 *
 * [동작 방식]
 * 1) CITY_NAME_MAP 에 ko/en 쌍을 두고
 * 2) resolveCityQuery() 로 API 호출용 query 결정
 * 3) filterMappedCities() 로 입력어 기반 추천
 * 4) toKoreanCityName() 으로 영문 → 한글 표시명 변환
 *
 */

export const CITY_NAME_MAP = [
  { ko: '서울', en: 'Seoul' },
  { ko: '수원', en: 'Suwon' },
  { ko: '부산', en: 'Busan' },
  { ko: '인천', en: 'Incheon' },
  { ko: '대전', en: 'Daejeon' },
  { ko: '대구', en: 'Daegu' },
  { ko: '광주', en: 'Gwangju' },
  { ko: '울산', en: 'Ulsan' },
  { ko: '제주', en: 'Jeju' },
  { ko: '세종', en: 'Sejong' },
  { ko: '고양', en: 'Goyang' },
  { ko: '용인', en: 'Yongin' },
  { ko: '창원', en: 'Changwon' },
  { ko: '청주', en: 'Cheongju' },
  { ko: '전주', en: 'Jeonju' },
  { ko: '포항', en: 'Pohang' },
  { ko: '천안', en: 'Cheonan' },
  { ko: '김해', en: 'Gimhae' },
  { ko: '평택', en: 'Pyeongtaek' },
  { ko: '남양주', en: 'Namyangju' },
  { ko: '화성', en: 'Hwaseong' },
  { ko: '부천', en: 'Bucheon' },
  { ko: '안산', en: 'Ansan' },
  { ko: '안양', en: 'Anyang' },
  { ko: '시흥', en: 'Siheung' },
  { ko: '파주', en: 'Paju' },
  { ko: '김포', en: 'Gimpo' },
  { ko: '의정부', en: 'Uijeongbu' },
  { ko: '구미', en: 'Gumi' },
  { ko: '진주', en: 'Jinju' },
  { ko: '원주', en: 'Wonju' },
  { ko: '춘천', en: 'Chuncheon' },
  { ko: '강릉', en: 'Gangneung' },
  { ko: '속초', en: 'Sokcho' },
  { ko: '목포', en: 'Mokpo' },
  { ko: '여수', en: 'Yeosu' },
  { ko: '순천', en: 'Suncheon' },
  { ko: '군산', en: 'Gunsan' },
  { ko: '익산', en: 'Iksan' },
  { ko: '경주', en: 'Gyeongju' },
  { ko: '거제', en: 'Geoje' },
  { ko: '통영', en: 'Tongyeong' },
  { ko: '제주도', en: 'Jeju' },
  { ko: '하와이', en: 'Hawaii' },
  { ko: '호놀룰루', en: 'Honolulu' },
  { ko: '도쿄', en: 'Tokyo' },
  { ko: '오사카', en: 'Osaka' },
  { ko: '베이징', en: 'Beijing' },
  { ko: '상하이', en: 'Shanghai' },
  { ko: '뉴욕', en: 'New York' },
  { ko: '런던', en: 'London' },
  { ko: '파리', en: 'Paris' },
  { ko: '방콕', en: 'Bangkok' },
  { ko: '싱가포르', en: 'Singapore' },
]

/**
 * 한글이면 영문으로 변환, 이미 영문이면 그대로(또는 매핑 en 정규화)
 * @returns {{ query: string, ko: string|null, en: string, matched: boolean }}
 */
export function resolveCityQuery(input) {
  const raw = (input || '').trim()
  if (!raw) {
    return { query: '', ko: null, en: '', matched: false }
  }

  const lower = raw.toLowerCase()

  // 한글 키 정확/부분 매칭
  const byKo = CITY_NAME_MAP.find(
    (item) => item.ko === raw || item.ko.includes(raw) || raw.includes(item.ko),
  )
  if (byKo) {
    return { query: byKo.en, ko: byKo.ko, en: byKo.en, matched: true }
  }

  // 영문 키 매칭
  const byEn = CITY_NAME_MAP.find(
    (item) => item.en.toLowerCase() === lower || item.en.toLowerCase().includes(lower),
  )
  if (byEn) {
    return { query: byEn.en, ko: byEn.ko, en: byEn.en, matched: true }
  }

  // 매핑에 없으면 입력값 그대로 API/지오코딩에 사용
  return { query: raw, ko: null, en: raw, matched: false }
}

/** 매핑 데이터에서 한글/영문 추천 필터 */
export function filterMappedCities(input, limit = 8) {
  const raw = (input || '').trim()
  if (!raw) return []
  const lower = raw.toLowerCase()

  // slice로 추천 개수 제한 (자동완성 UX)
  return CITY_NAME_MAP.filter(
    (item) =>
      item.ko.includes(raw) ||
      item.en.toLowerCase().includes(lower) ||
      raw.includes(item.ko),
  ).slice(0, limit)
}

/** 영문 → 한글 (표시용) */
export function toKoreanCityName(enOrKo) {
  const raw = (enOrKo || '').trim()
  if (!raw) return raw
  // 이미 한글이면 변환 불필요
  if (/[가-힣]/.test(raw)) return raw

  const lower = raw.toLowerCase()
  const exact = CITY_NAME_MAP.find(
    (item) => item.en.toLowerCase() === lower || item.ko === raw,
  )
  if (exact) return exact.ko

  // "State of Hawaii" 처럼 부분 포함되는 경우
  const partial = CITY_NAME_MAP.find(
    (item) =>
      lower.includes(item.en.toLowerCase()) || item.en.toLowerCase().includes(lower),
  )
  return partial ? partial.ko : raw
}
