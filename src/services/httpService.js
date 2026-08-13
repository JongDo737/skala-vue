import axios from 'axios'

/**
 * [httpService] HTTP 메서드 모듈
 * GET / POST / PATCH / DELETE
 * 날씨·지오코딩 API는 get() 을 통해 호출한다.
 */

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
