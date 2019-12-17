import request from '@/utils/request'

// 用户反馈列表
export function feedbackList(data) {
  return request({
    url: 'feedback/list',
    method: 'post',
    data: data
  })
}

// 用户列表
export function userList(data) {
  return request({
    url: 'user/list',
    method: 'post',
    data: data
  })
}

// 用户充电宝订单列表
export function chargebabyOrderList(data) {
  return request({
    url: 'chargebaby-order/list',
    method: 'post',
    data: data
  })
}

// 用户余额记录
export function consumptionList(data) {
  return request({
    url: 'consumption/list',
    method: 'post',
    data: data
  })
}
