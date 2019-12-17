import request from '@/utils/request'

export function login(mobile, code) {
  return request({
    url: 'login',
    method: 'post',
    data: {
      mobile: mobile,
      code: code
    }
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

export function adminCode(data) {
  return request({
    url: 'admin/code',
    method: 'post',
    data: data
  })
}
