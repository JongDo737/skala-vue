/**
 * ============================================================================
 * httpService.js — HTTP 공통 클라이언트 (GET/POST/PATCH/DELETE)
 * ============================================================================
 *
 * [역할]
 * axios 인스턴스를 감싸 REST 메서드별 헬퍼를 제공한다.
 * 날씨·지오코딩 API는 주로 get() 을 통해 호출한다.
 *
 * [동작 방식]
 * 1) axios.create 로 timeout이 있는 client 생성
 * 2) get/post/patch/del 이 response.data 만 반환해 호출부를 단순화
 * 3) httpService 객체와 default export 로 묶어서 import 편의 제공
 *
 */

import axios from 'axios'

// 공통 axios 인스턴스 (요청 타임아웃 12초)
const client = axios.create({
  timeout: 12000,
})

export async function get(url, config = {}) {
  const response = await client.get(url, config)
  return response.data
}

export async function post(url, body = {}, config = {}) {
  const response = await client.post(url, body, config)
  return response.data
}

export async function patch(url, body = {}, config = {}) {
  const response = await client.patch(url, body, config)
  return response.data
}

// delete는 예약어라 함수명은 del, export 키는 delete
export async function del(url, config = {}) {
  const response = await client.delete(url, config)
  return response.data
}

export const httpService = {
  get,
  post,
  patch,
  delete: del,
}

export default httpService
