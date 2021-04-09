import request from '@/utils/request'

// 仓库列表
export function warehousesList(data) {
  return request({
    url: 'warehouses',
    method: 'get',
    params: data
  })
}

// 仓库详情
export function warehousesInfo(id) {
  return request({
    url: 'warehouses/'+id,
    method: 'get'
  })
}


// 仓库添加
export function warehousesAdd(data) {
  return request({
    url: 'warehouses',
    method: 'post',
    data: data
  })
}

// 仓库修改
export function warehousesModify(id, data) {
  return request({
    url: 'warehouses/' + id,
    method: 'put',
    data: data
  })
}

// 仓库删除
export function warehousesDel(id) {
  return request({
    url: 'warehouses/' + id ,
    method: 'delete'
  })
}