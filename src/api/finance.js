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

