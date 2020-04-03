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

// 聊天机器人/帮助中心.查.列表
export function chatRobotReplies(param) {
  return request({
    url: 'chat-robot/replies',
    method: 'get',
    params: param
  })
}

// 聊天机器人/帮助中心.查.个
export function chatRobotRepliesInfo(id) {
  return request({
    url: 'chat-robot/replies/' + id,
    method: 'get'
  })
}

// 聊天机器人/帮助中心.添加消息
export function chatRobotRepliesAdd(data) {
  return request({
    url: 'chat-robot/replies',
    method: 'post',
    data: data
  })
}

// 聊天机器人/帮助中心.删除消息
export function chatRobotRepliesDel(id) {
  return request({
    url: 'chat-robot/replies/' + id,
    method: 'delete'
  })
}

// 聊天机器人/帮助中心.修改消息
export function chatRobotRepliesModify(id, data) {
  return request({
    url: 'chat-robot/replies/' + id,
    method: 'put',
    data: data
  })
}

// 客服.查.列表
export function customerServicesList(param) {
  return request({
    url: 'customer-services',
    method: 'get',
    params: param
  })
}

// 客服.改
export function customerServicesModify(id, data) {
  return request({
    url: 'customer-services/' + id,
    method: 'put',
    data: data
  })
}

// 客服.删
export function customerServicesDel(id) {
  return request({
    url: 'customer-services/' + id,
    method: 'delete'
  })
}

// 客服.增
export function customerServicesAdd(data) {
  return request({
    url: 'customer-services',
    method: 'post',
    data: data
  })
}

// 操作日志.查.列表
export function adminOptLog(param) {
  return request({
    url: 'log-options',
    method: 'get',
    params: param
  })
}

