import request from '@/utils/request'

// 广告/推荐.删
export function adDelete(id) {
  return request({
    url: 'recommends/' + id,
    method: 'delete'
  })
}

// 广告.批量删除
export function adBatchDelete(ids) {
  return request({
    url: 'batch/recommends',
    method: 'delete',
    params: { ids: JSON.stringify(ids) }
  })
}

// 广告.批量添加
export function adBatchAdd(data) {
  return request({
    url: 'batch/recommends',
    method: 'post',
    data: data
  })
}

// 广告/推荐.增
export function adAdd(data) {
  return request({
    url: 'recommends',
    method: 'post',
    data: data
  })
}

// 广告/推荐.改
export function adModify(id, data) {
  return request({
    url: 'recommends/' + id,
    method: 'put',
    data: data
  })
}

// 广告/推荐.查.列表
export function adList(data) {
  return request({
    url: 'recommends',
    method: 'get',
    params: data
  })
}

// 广告/推荐.查.个
export function adInfo(id) {
  return request({
    url: 'recommends/' + id,
    method: 'get'
  })
}

// 商家自己信息.获取
export function shopInfo() {
  return request({
    url: 'profile',
    method: 'get'
  })
}

// 商家自己信息.修改
export function shopModify(data) {
  return request({
    url: 'profile',
    method: 'put',
    data: data
  })
}

// 优惠券设置.添加
export function couponAdd(data) {
  return request({
    url: 'coupon-settings',
    method: 'post',
    data: data
  })
}

// 优惠券设置.修改
export function couponModify(id, data) {
  return request({
    url: 'coupon-settings/' + id,
    method: 'put',
    data: data
  })
}

// 优惠券设置.查.列表
export function couponList(data) {
  return request({
    url: 'coupon-settings',
    method: 'get',
    params: data
  })
}

// 优惠券设置.查.个
export function couponInfo(id) {
  return request({
    url: 'coupon-settings/' + id,
    method: 'get'
  })
}

// 优惠券设置.删
export function couponDelete(id) {
  return request({
    url: 'coupon-settings/' + id,
    method: 'delete'
  })
}

// 红包设置.添加
export function redEnvelopeAdd(data) {
  return request({
    url: 'red-envelope-settings',
    method: 'post',
    data: data
  })
}

// 红包设置.改
export function redEnvelopeModify(id, data) {
  return request({
    url: 'red-envelope-settings/' + id,
    method: 'put',
    data: data
  })
}

// 红包设置.查.列表
export function redEnvelopeList(data) {
  return request({
    url: 'red-envelope-settings',
    method: 'get',
    params: data
  })
}

// 红包设置.查.个
export function redEnvelopeInfo(id) {
  return request({
    url: 'red-envelope-settings/' + id,
    method: 'get'
  })
}

// 红包设置.删
export function redEnvelopeDelete(id) {
  return request({
    url: 'red-envelope-settings/' + id,
    method: 'delete'
  })
}

// 数据统计相关
export function shopStat(data) {
  return request({
    url: 'statistics/count',
    method: 'get',
    params: data
  })
}

// 秒杀.增
export function panicBuysAdd(data) {
  return request({
    url: 'panic-buys',
    method: 'post',
    data: data
  })
}

// 秒杀.查.列表
export function panicBuysList(data) {
  return request({
    url: 'panic-buys',
    method: 'get',
    params: data
  })
}

// 秒杀.删
export function panicBuysDelete(id) {
  return request({
    url: 'panic-buys/' + id,
    method: 'delete'
  })
}

// 秒杀.查.个
export function panicBuysInfo(id) {
  return request({
    url: 'panic-buys/' + id,
    method: 'get'
  })
}

// 秒杀.改
export function panicBuysModify(id, data) {
  return request({
    url: 'panic-buys/' + id,
    method: 'put',
    data: data
  })
}

// 秒杀场次.查.列表
export function panicBuysTimes(id, data) {
  return request({
    url: 'panic-buy-times',
    method: 'get',
    params: { skip: 0, limit: 24 }
  })
}

// 拼购.设置
export function cobuySet(id, data) {
  return request({
    url: 'spus/' + id + '/cobuy',
    method: 'put',
    data: data
  })
}

// 砍一刀.添加商品
export function cutGoodsAdd(data) {
  return request({
    url: 'cut-goods',
    method: 'post',
    data: data
  })
}

// 砍一刀.商品.列表
export function cutGoodsList(param) {
  return request({
    url: 'cut-goods',
    method: 'get',
    params: param
  })
}

// 砍一刀.商品.修改
export function cutGoodsModify(id, data) {
  return request({
    url: 'cut-goods/' + id,
    method: 'put',
    data: data
  })
}

// 砍一刀.商品.删除
export function cutGoodsDel(id) {
  return request({
    url: 'cut-goods/' + id,
    method: 'delete'
  })
}

// 砍一刀.商品.个
export function cutGoodsInfo(id) {
  return request({
    url: 'cut-goods/' + id,
    method: 'get'
  })
}

// 直播单.添加
export function liveItemsAdd(data) {
  return request({
    url: 'live-items',
    method: 'post',
    data: data
  })
}

// 直播单.查.列表
export function liveItemsList(data) {
  return request({
    url: 'live-items',
    method: 'get',
    params: data
  })
}

// 直播单.查.个
export function liveItemsInfo(id) {
  return request({
    url: 'live-items/' + id,
    method: 'get'
  })
}

// 直播单.删除
export function liveItemsDel(id) {
  return request({
    url: 'live-items/' + id,
    method: 'delete'
  })
}

// 直播单.修改
export function liveItemsModify(id, data) {
  return request({
    url: 'live-items/' + id,
    method: 'put',
    data: data
  })
}

// 直播单.即时添加商品
export function liveItemsAddGoods(id, data) {
  return request({
    url: 'live-items/' + id + '/spus',
    method: 'post',
    data: data
  })
}

// 直播.开始
export function liveStart(data) {
  return request({
    url: 'live/start',
    method: 'post',
    data: data
  })
}

// 直播.结束
export function liveStop() {
  return request({
    url: 'live/stop',
    method: 'post'
  })
}

// 直播单.下架商品
export function liveOffshelf(id, data) {
  return request({
    url: 'live-items/' + id + '/offshelf',
    method: 'post',
    data: data
  })
}

// 直播单.推荐商品
export function liveRecommend(id, data) {
  return request({
    url: 'live-items/' + id + '/recommend',
    method: 'post',
    data: data
  })
}

// 直播单.讲解商品
export function liveExplain(id, data) {
  return request({
    url: 'live-items/' + id + '/explain',
    method: 'post',
    data: data
  })
}

// 直播.优惠券.发放
export function couponSetLiveSend(id, data) {
  return request({
    url: 'coupon-settings/' + id + '/live-send',
    method: 'post',
    data: data
  })
}

// 直播单.已发放优惠券列表
export function sendedSetCoupons(id) {
  return request({
    url: 'live-items/' + id + '/sended-setting-coupons',
    method: 'get'
  })
}

// 组合购.添加
export function combineBuys(data) {
  return request({
    url: 'combine-buys',
    method: 'post',
    data: data
  })
}

// 组合购.列表
export function combineBuyslist(data) {
  return request({
    url: 'combine-buys',
    method: 'get',
    params: data
  })
}

// 组合购.查个
export function itemcombineBuys(id) {
  return request({
    url: 'combine-buys/' + id,
    method: 'get',
  })
}

// 组合购.修改
export function modifycombineBuys(data, id) {
  return request({
    url: 'combine-buys/' + id,
    method: 'put',
    data: data
  })
}

// 组合购.删除
export function DelcombineBuys(id) {
  return request({
    url: 'combine-buys/' + id,
    method: 'delete',
  })
}

// 备忘录.添加
export function memorandumsadd(data) {
  return request({
    url: 'memorandums',
    method: 'post',
    data: data
  })
}

// 备忘录.获取
export function getmemorandums(data) {
  return request({
    url: 'memorandums',
    method: 'get',
    params: data
  })
}

// 备忘录.删除
export function Delmemorandums(id) {
  return request({
    url: 'memorandums/' + id,
    method: 'delete'
  })
}

// 备忘录.修改
export function modifymemorandums(data, id) {
  return request({
    url: 'memorandums/' + id,
    method: 'put',
    data: data
  })
}

// 用户.列表
export function usersList(data) {
  return request({
    url: 'users',
    method: 'get',
    params: data
  })
}

// 用户.设置透支
export function overdrawSet(id, data) {
  return request({
    url: 'users/' + id + '/overdraw',
    method: 'put',
    data: data
  })
}

// 自提点.添加
export function selfPickStations(data) {
  return request({
    url: 'self-pick-stations',
    method: 'post',
    data: data
  })
}

// 自提点.修改
export function selfPickStationsModify(id, data) {
  return request({
    url: 'self-pick-stations/' + id,
    method: 'put',
    data: data
  })
}

// 自提点.列表
export function selfPickStationsList(data) {
  return request({
    url: 'self-pick-stations',
    method: 'get',
    params: data
  })
}

// 自提点.详情
export function selfPickStationsInfo(id) {
  return request({
    url: 'self-pick-stations/' + id,
    method: 'get'
  })
}

// 自提点.删除
export function selfPickStationsDel(id) {
  return request({
    url: 'self-pick-stations/' + id,
    method: 'delete'
  })
}

