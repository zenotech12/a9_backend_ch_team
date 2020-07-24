import request from '@/utils/request'

// 统计.新用户统计(时间)
export function statisticsUserNewTime(data) {
  return request({
    url: 'statistics/user/new/time',
    method: 'post',
    data: data
  })
}

// 统计.商品浏览统计
export function statisticsGoodsBrowse(data) {
  return request({
    url: 'statistics/goods/browse',
    method: 'post',
    data: data
  })
}

// 统计.用户消费统计(时间)
export function statisticsUserConsumeTime(data) {
  return request({
    url: 'statistics/user/consume/time',
    method: 'post',
    data: data
  })
}

// 统计.数量统计v2
export function statisticsCountV2(data) {
  return request({
    url: 'statistics/v2/count',
    method: 'get',
    params: data
  })
}
// 统计.排行榜
export function rankingList(data) {
  return request({
    url: 'statistics/spu/ranking-list',
    method: 'get',
    params: data
  })
}
