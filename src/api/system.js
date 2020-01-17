import request from '@/utils/request'

// 管理账户.查.列表
export function adminAccountsList(data) {
  return request({
    url: 'admin-accounts',
    method: 'get'
  })
}

// 管理账户.增
export function adminAccountsUpsert(data) {
  return request({
    url: 'admin-accounts',
    method: 'post',
    data: data
  })
}

// 管理账户.查.个 详情
export function adminAccountsInfo(id) {
  return request({
    url: 'admin-accounts/' + id,
    method: 'get'
  })
}

// 管理账户.改
export function adminAccountsModify(id, data) {
  return request({
    url: 'admin-accounts/' + id,
    method: 'put',
    data: data
  })
}

// 管理账户.删
export function adminAccountsDel(id) {
  return request({
    url: 'admin-accounts/' + id,
    method: 'delete'
  })
}

// 邮费设置.添加
export function postagesAdd(data) {
  return request({
    url: 'postages',
    method: 'post',
    data: data
  })
}

// 邮费设置.修改
export function postagesModify(id, data) {
  return request({
    url: 'postages/' + id,
    method: 'put',
    data: data
  })
}

// 邮费设置.查.列表
export function postagesList(id) {
  return request({
    url: 'postages',
    method: 'get'
  })
}

// 管理账户.删
export function postagesDel(id) {
  return request({
    url: 'postages/' + id,
    method: 'delete'
  })
}

// 收货地址.查.列表
export function shippingAddressesList() {
  return request({
    url: 'shipping-addresses',
    method: 'get'
  })
}

// 收货地址.删
export function shippingAddressesDel(id) {
  return request({
    url: 'shipping-addresses/' + id,
    method: 'delete'
  })
}

// 收货地址.增
export function shippingAddressesAdd(data) {
  return request({
    url: 'shipping-addresses',
    method: 'post',
    data: data
  })
}

// 收货地址.改
export function shippingAddressesModify(id, data) {
  return request({
    url: 'shipping-addresses/' + id,
    method: 'put',
    data: data
  })
}
