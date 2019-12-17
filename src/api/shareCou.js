import request from '@/utils/request'

// 优惠券配置.列表
export function couponList(data) {
  return request({
    url: 'config/coupon/list',
    method: 'post',
    data: data
  })
}

// 优惠券配置.添加/更新
export function couponUpsert(data) {
  return request({
    url: 'config/coupon/upsert',
    method: 'post',
    data: data
  })
}

// 优惠券配置.获取
export function couponInfo(id) {
  return request({
    url: 'config/coupon/info/' + id,
    method: 'get'
  })
}

// 优惠券配置.获取
export function couponDel(id) {
  return request({
    url: 'config/coupon/info/' + id,
    method: 'delete'
  })
}

// 分享.填手机号
export function shareRrecv(data) {
  return request({
    url: 'share/recv',
    method: 'post',
    data: data
  })
}
