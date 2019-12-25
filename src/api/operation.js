import request from '@/utils/request'

// 广告/推荐.删
export function adDelete(id) {
  return request({
    url: 'recommends/' + id,
    method: 'delete'
  })
}

// 广告/推荐.增
export function adAdd(data) {
  return request({
    url: 'recommends',
    method: 'post',
    data: data
  })
}

// 广告/推荐.改
export function adModify(id, data) {
  return request({
    url: 'recommends/' + id,
    method: 'put',
    data: data
  })
}

// 广告/推荐.查.列表
export function adList(data) {
  return request({
    url: 'recommends',
    method: 'get',
    params: data
  })
}

// 广告/推荐.查.个
export function adInfo(id) {
  return request({
    url: 'recommends/' + id,
    method: 'get'
  })
}

// 商家自己信息.获取
export function shopInfo() {
  return request({
    url: 'profile',
    method: 'get'
  })
}

// 商家自己信息.修改
export function shopModify(data) {
  return request({
    url: 'profile',
    method: 'put',
    data: data
  })
}

