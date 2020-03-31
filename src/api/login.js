import request from '@/utils/request'

export function login(data) {
  return request({
    url: 'login',
    method: 'post',
    data: data
  })
}

export function getInfo(token) {
  return request({
    url: '/user/info',
    method: 'get',
    params: { token }
  })
}

export function logout() {
  return request({
    url: '/user/logout',
    method: 'post'
  })
}

// 发送验证码
export function mobileCode(data) {
  return request({
    url: 'mobile/code',
    method: 'post',
    data: data
  })
}

export function imInfo() {
  return request({
    url: 'im-info',
    method: 'get'
  })
}
