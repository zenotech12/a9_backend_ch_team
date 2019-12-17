import request from '@/utils/request'

// 托盘.列表
export function cabinetList(data) {
  return request({
    url: 'cabinet/list',
    method: 'post',
    data: data
  })
}

// 托盘.添加/修改
export function cabinetUpsert(data) {
  return request({
    url: 'cabinet/upsert',
    method: 'post',
    data: data
  })
}

// 托盘.强制弹出
export function cabinetEject(data) {
  return request({
    url: 'cabinet/charge-interface/force',
    method: 'post',
    data: data
  })
}

// 托盘.删除
export function cabinetDel(id) {
  return request({
    url: 'cabinet/info/' + id,
    method: 'delete'
  })
}

// 重启
export function cabinetReboot(data) {
  return request({
    url: 'cabinet/reboot',
    method: 'post',
    data: data
  })
}
