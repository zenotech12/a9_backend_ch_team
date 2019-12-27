import request from '@/utils/request'

// 钱包详情
export function balanceDetail() {
  return request({
    url: 'purse/detail',
    method: 'get'
  })
}

// 收入(支出)明细
export function balanceLogs(data) {
  return request({
    url: 'balance-logs',
    method: 'get',
    params: data
  })
}

// 钱包.提现.查.列表
export function tixianList(data) {
  return request({
    url: 'withdraws',
    method: 'get',
    params: data
  })
}

// 钱包.提现
export function tixianAdd(data) {
  return request({
    url: 'withdraw',
    method: 'post',
    params: data
  })
}
