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

// 优惠券设置.添加
export function couponAdd(data) {
  return request({
    url: 'coupon-settings',
    method: 'post',
    data: data
  })
}

// 优惠券设置.修改
export function couponModify(id, data) {
  return request({
    url: 'coupon-settings/' + id,
    method: 'put',
    data: data
  })
}

// 优惠券设置.查.列表
export function couponList(data) {
  return request({
    url: 'coupon-settings',
    method: 'get',
    params: data
  })
}

// 优惠券设置.查.个
export function couponInfo(id) {
  return request({
    url: 'coupon-settings/' + id,
    method: 'get'
  })
}

// 优惠券设置.删
export function couponDelete(id) {
  return request({
    url: 'coupon-settings/' + id,
    method: 'delete'
  })
}

// 红包设置.添加
export function redEnvelopeAdd(data) {
  return request({
    url: 'red-envelope-settings',
    method: 'post',
    data: data
  })
}

// 红包设置.改
export function redEnvelopeModify(id, data) {
  return request({
    url: 'red-envelope-settings/' + id,
    method: 'put',
    data: data
  })
}

// 红包设置.查.列表
export function redEnvelopeList(data) {
  return request({
    url: 'red-envelope-settings',
    method: 'get',
    params: data
  })
}

// 红包设置.查.个
export function redEnvelopeInfo(id) {
  return request({
    url: 'red-envelope-settings/' + id,
    method: 'get'
  })
}

// 红包设置.删
export function redEnvelopeDelete(id) {
  return request({
    url: 'red-envelope-settings/' + id,
    method: 'delete'
  })
}

// 数据统计相关
export function shopStat(data) {
  return request({
    url: 'statistics/count',
    method: 'get',
    params: data
  })
}

// 秒杀.增
export function panicBuysAdd(data) {
  return request({
    url: 'panic-buys',
    method: 'post',
    data: data
  })
}

// 秒杀.查.列表
export function panicBuysList(data) {
  return request({
    url: 'panic-buys',
    method: 'get',
    params: data
  })
}

// 秒杀.删
export function panicBuysDelete(id) {
  return request({
    url: 'panic-buys/' + id,
    method: 'delete'
  })
}

// 秒杀.查.个
export function panicBuysInfo(id) {
  return request({
    url: 'panic-buys/' + id,
    method: 'get'
  })
}

// 秒杀.改
export function panicBuysModify(id, data) {
  return request({
    url: 'panic-buys/' + id,
    method: 'put',
    data: data
  })
}

// 秒杀场次.查.列表
export function panicBuysTimes(id, data) {
  return request({
    url: 'panic-buy-times',
    method: 'get',
    params: { skip: 0, limit: 24 }
  })
}

// 拼购.设置
export function cobuySet(id, data) {
  return request({
    url: 'spus/' + id + '/cobuy',
    method: 'put',
    data: data
  })
}

