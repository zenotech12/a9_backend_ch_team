import request from '@/utils/request'

// 统计.数量统计
export function orderStat(data) {
  return request({
    url: 'statistics/count',
    method: 'get',
    params: data
  })
}

// 订单.列表
export function ordersList(data) {
  return request({
    url: 'orders',
    method: 'get',
    params: data
  })
}

// 订单.发货
export function ordersExpress(id, data) {
  return request({
    url: 'orders/' + id + '/express',
    method: 'post',
    data: data
  })
}

// 订单.改价
export function ordersPriceModify(id, data) {
  return request({
    url: 'orders/' + id + '/pay-price',
    method: 'put',
    data: data
  })
}

// 评价.查.列表
export function evalutionsList(data) {
  return request({
    url: 'evalutions',
    method: 'get',
    params: data
  })
}

// 评价.回复
export function evalutionsReply(id, data) {
  return request({
    url: 'evalutions/' + id + '/replies',
    method: 'post',
    data: data
  })
}

// 评价.批量.回复
export function batchEvalutionsReply(data) {
  return request({
    url: 'batch/evalutions/replies',
    method: 'post',
    data: data
  })
}

// 评价.查.个
export function evalutionsInfo(id) {
  return request({
    url: 'evalutions/' + id,
    method: 'get'
  })
}

// 退款/换货.列表
export function orderAfterSales(data) {
  return request({
    url: 'after-sales',
    method: 'get',
    params: data
  })
}

// 退款/换货.操作（批准/同意/拒绝）
export function orderAfterSalesOpt(id, data) {
  return request({
    url: 'after-sales/' + id + '/status',
    method: 'put',
    data: data
  })
}

export function exportOrder(data) {
  return request({
    url: 'orders-export',
    method: 'get',
    params: data
  })
}

export function changeMerchantComment(id, data) {
  return request({
    url: 'orders/' + id + '/merchant-comment',
    method: 'put',
    params: data
  })
}

export function changeShippingAddress(id, data) {
  return request({
    url: 'orders/' + id + '/shipping-address',
    method: 'put',
    params: data
  })
}

export function getOneOrdersInfo(id) {
  return request({
    url: 'orders/' + id,
    method: 'get'
  })
}

export function getExpressInfo(data) {
  return request({
    url: 'express/info',
    method: 'get',
    params: data
  })
}
// 订单.各个状态数
export function ordersCount(data) {
  return request({
    url: 'orders-count',
    method: 'get',
    params: data
  })
}

// 售后.数量获取
export function afterSalesCount(data) {
  return request({
    url: 'after-sales-count',
    method: 'get',
    params: data
  })
}
