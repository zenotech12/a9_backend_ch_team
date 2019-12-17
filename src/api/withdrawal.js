import request from '@/utils/request'

// 提现.列表
export function withdrawList(data) {
  return request({
    url: 'withdraw/req/list',
    method: 'post',
    data: data
  })
}

// 提现.批准
export function withdrawApprove(data) {
  return request({
    url: 'withdraw/req/approve',
    method: 'post',
    data: data
  })
}

// 提现.导出
export function withdrawExport(data) {
  return request({
    url: 'withdraw/req/export',
    method: 'post',
    data: data,
    responseType: 'blob'
  })
}
