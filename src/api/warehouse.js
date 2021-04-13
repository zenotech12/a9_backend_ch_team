import request from '@/utils/request'

// 仓库列表
export function warehousesList(data) {
  return request({
    url: 'warehouses',
    method: 'get',
    params: data
  })
}

// 仓库详情
export function warehousesInfo(id) {
  return request({
    url: 'warehouses/' + id,
    method: 'get'
  })
}

// 仓库添加
export function warehousesAdd(data) {
  return request({
    url: 'warehouses',
    method: 'post',
    data: data
  })
}

// 仓库修改
export function warehousesModify(id, data) {
  return request({
    url: 'warehouses/' + id,
    method: 'put',
    data: data
  })
}

// 仓库删除
export function warehousesDel(id) {
  return request({
    url: 'warehouses/' + id,
    method: 'delete'
  })
}

// 供应商列表
export function suppliersList(data) {
  return request({
    url: 'suppliers',
    method: 'get',
    params: data
  })
}

// 供应商添加
export function suppliersAdd(data) {
  return request({
    url: 'suppliers',
    method: 'post',
    data: data
  })
}

// 供应商修改
export function suppliersModify(id, data) {
  return request({
    url: 'suppliers/' + id,
    method: 'put',
    data: data
  })
}

// 供应商详情
export function suppliersInfo(id) {
  return request({
    url: 'suppliers/' + id,
    method: 'get'
  })
}

// 供应商删除
export function suppliersDel(id) {
  return request({
    url: 'suppliers/' + id,
    method: 'delete'
  })
}

// 采购单列表
export function purchaseList(data) {
  return request({
    url: 'warehouse-purchases',
    method: 'get',
    params: data
  })
}

// 采购单详情
export function purchaseInfo(id) {
  return request({
    url: 'warehouse-purchases/' + id,
    method: 'get'
  })
}

// 采购单添加
export function purchaseAdd(data) {
  return request({
    url: 'warehouse-purchases',
    method: 'post',
    data: data
  })
}

// 采购单修改
export function purchaseModify(id, data) {
  return request({
    url: 'warehouse-purchases/' + id,
    method: 'put',
    data: data
  })
}

// 付款单列表
export function paysList(data) {
  return request({
    url: 'warehouse-purchase-pays',
    method: 'get',
    params: data
  })
}

// 获取单个付款单
export function singlepaysList(id, data) {
  return request({
    url: 'warehouse-purchase-pays/' + id,
    method: 'get',
    params: data
  })
}

// 付款单添加
export function AddpaysList(data) {
  return request({
    url: 'warehouse-purchase-pays',
    method: 'post',
    data: data
  })
}

// 付款单修改
export function modifypaysList(id, data) {
  return request({
    url: 'warehouse-purchase-pays/' + id,
    method: 'put',
    data: data
  })
}

// 采购单.支付完毕
export function Paymentcomplete(id, data) {
  return request({
    url: 'warehouse-purchases/' + id + '/pay-complete',
    method: 'put',
    data: data
  })
}