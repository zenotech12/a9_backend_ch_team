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
// 订单.详情
export function ordersInfo(id) {
  return request({
    url: 'orders/' + id,
    method: 'get'
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

// 评价.查.数量
export function evaluationsCount() {
  return request({
    url: 'evaluations-count',
    method: 'get'
  })
}

// 订单.货到付款确认
export function orderConfirm(id) {
  return request({
    url: 'orders/' + id + '/confirm',
    method: 'put'
  })
}

// 订单.认领
export function orderOwnerShipGet(id) {
  return request({
      url: 'orders/' +id +"/get-ownership",
      method:"post"
    })
}

// 订单.转让
export function orderOwnerShipTrans(id, data) {
  return request({
    url: 'orders/' + id + '/trans-ownership',
    method: "post",
    data:data
  })
}

// 订单.代购订单审核
export function orderPurchaseCheck(id, data) {
  return request({
    url: 'orders/' + id + '/purchase-check',
    method: 'put',
    data: data
  })
}

// 订单.添加物流记录
export function orderTransRecords(id, data) {
  return request({
    url: 'orders/' + id + '/trans-records',
    method: 'post',
    data: data
  })
}

// 仓库.库存信息.根据仓库区分组
export function warehouseGroupInven(data) {
  return request({
    url: 'warehouse-inventories-group-warehouse',
    method: 'get',
    params: data
  })
}

// 订单.取消
export function cancelGoods(id) {
  return request({
    url: 'orders/' + id + '/cancel',
    method: 'post',
  })
}

// 订单.设置商家备注
export function orderMerchantComment(id, data) {
  return request({
    url: 'orders/' + id + '/merchant-comment',
    method: 'put',
    data: data
  })
}
