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

