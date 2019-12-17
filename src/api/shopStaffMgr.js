import request from '@/utils/request'

// 商店.列表
export function shopList(data) {
  return request({
    url: 'partner/list',
    method: 'post',
    data: data
  })
}

// 商店.添加/修改
export function shopUpsert(data) {
  return request({
    url: 'partner/upsert',
    method: 'post',
    data: data
  })
}

// 商店.获取详细信息
export function shopInfo(id) {
  return request({
    url: 'partner/info/' + id,
    method: 'get'
  })
}

// 商店.删除
export function shopDel(id) {
  return request({
    url: 'partner/info/delete/' + id,
    method: 'delete'
  })
}
