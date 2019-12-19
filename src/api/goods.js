import request from '@/utils/request'

// 商品类型.查.列表
export function spuTypesList(data) {
  return request({
    url: 'spu-types',
    method: 'get',
    params: data
  })
}

// 商品类型.增
export function spuTypesUpsert(data) {
  return request({
    url: 'spu-types',
    method: 'post',
    data: data
  })
}
// 商品类型.修改
export function spuTypesmodify(typeId, data) {
  return request({
    url: 'spu-types/' + typeId,
    method: 'put',
    data: data
  })
}

// 商品类型.查.个
export function spuTypesInfo(id) {
  return request({
    url: 'spu-types/' + id,
    method: 'get'
  })
}

// 商品类型.删
export function spuTypesDel(id) {
  return request({
    url: 'spu-types/' + id,
    method: 'delete'
  })
}

// 商品.增
export function spusAdd(data) {
  return request({
    url: 'spus',
    method: 'post',
    data: data
  })
}

// 商品.改
export function spusModify(id, data) {
  return request({
    url: 'spus/' + id,
    method: 'put',
    data: data
  })
}

// 商品.改.上下架
export function spusShelf(id, data) {
  return request({
    url: 'spus/' + id + '/shelf',
    method: 'put',
    data: data
  })
}

// 商品.查.列表
export function spusList(data) {
  return request({
    url: `spus?approve_status=${data.approve_status}&type_id=${data.type_id}&skip=${data.skip}&limit=${data.limit}&shelf_status=${data.shelf_status}`,
    method: 'get'
  })
}

// 商品.查.个
export function spusInfo(id) {
  return request({
    url: 'spus/' + id,
    method: 'get'
  })
}

// 商品.删
export function spusDel(id) {
  return request({
    url: 'spus/' + id,
    method: 'delete'
  })
}

// 商品规格.增
export function spusSkus(id, data) {
  return request({
    url: 'spus/' + id + '/skus',
    method: 'post',
    data: data
  })
}

// 商品规格.改.添加库存
export function spusSkusInventory(goodsId, skusId, data) {
  return request({
    url: 'spus/' + goodsId + '/skus' + skusId + '/inventory',
    method: 'post',
    data: data
  })
}

// 商品规格.改
export function spusSkusModify(goodsId, skusId, data) {
  return request({
    url: 'spus/' + goodsId + '/skus' + skusId,
    method: 'put',
    data: data
  })
}

// 商品规格.查.列表
export function spusSkusList(id, data) {
  return request({
    url: `spus/${id}/skus?skip=${data.skip}&limit=${data.limit}`,
    method: 'get'
  })
}

// 商品规格.删
export function spusSkusDel(goodsId, skusId, data) {
  return request({
    url: 'spus/' + goodsId + '/skus' + skusId,
    method: 'delete'
  })
}
