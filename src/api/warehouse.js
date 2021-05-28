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
    url: 'warehouses/' + id,
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
    url: 'warehouses/' + id,
    method: 'delete'
  })
}

// 供应商列表
export function suppliersList(data) {
  return request({
    url: 'suppliers',
    method: 'get',
    params: data
  })
}

// 供应商添加
export function suppliersAdd(data) {
  return request({
    url: 'suppliers',
    method: 'post',
    data: data
  })
}

// 供应商修改
export function suppliersModify(id, data) {
  return request({
    url: 'suppliers/' + id,
    method: 'put',
    data: data
  })
}

// 供应商详情
export function suppliersInfo(id) {
  return request({
    url: 'suppliers/' + id,
    method: 'get'
  })
}

// 供应商删除
export function suppliersDel(id) {
  return request({
    url: 'suppliers/' + id,
    method: 'delete'
  })
}

// 采购单列表
export function purchaseList(data) {
  return request({
    url: 'warehouse-purchases',
    method: 'get',
    params: data
  })
}

// 采购单详情
export function purchaseInfo(id) {
  return request({
    url: 'warehouse-purchases/' + id,
    method: 'get'
  })
}

// 采购单添加
export function purchaseAdd(data) {
  return request({
    url: 'warehouse-purchases',
    method: 'post',
    data: data
  })
}

// 采购单修改
export function purchaseModify(id, data) {
  return request({
    url: 'warehouse-purchases/' + id,
    method: 'put',
    data: data
  })
}

// 付款单列表
export function paysList(data) {
  return request({
    url: 'warehouse-purchase-pays',
    method: 'get',
    params: data
  })
}

// 获取单个付款单
export function singlepaysList(id, data) {
  return request({
    url: 'warehouse-purchase-pays/' + id,
    method: 'get',
    params: data
  })
}

// 付款单添加
export function AddpaysList(data) {
  return request({
    url: 'warehouse-purchase-pays',
    method: 'post',
    data: data
  })
}

// 付款单修改
export function modifypaysList(id, data) {
  return request({
    url: 'warehouse-purchase-pays/' + id,
    method: 'put',
    data: data
  })
}

// 采购单.支付完毕
export function Paymentcomplete(id, data) {
  return request({
    url: 'warehouse-purchases/' + id + '/pay-complete',
    method: 'put',
    data: data
  })
}

// 仓库.位置.批量添加
export function CwarehouseAdd(id, data) {
  return request({
    url: 'warehouses/' + id + '/batch-positions',
    method: 'post',
    data: data
  })
}

// 仓库.位置列表
export function Locationlist(id, data) {
  return request({
    url: 'warehouses/' + id + '/positions',
    method: 'get',
    params: data
  })
}


// 仓库.库存信息
export function warehouseInventories(data) {
  return request({
    url: 'warehouse-inventories',
    method: 'get',
    params: data
  })
}

// 仓库.出库信息
export function warehouseOutbounds(data) {
  return request({
    url: 'warehouse-outbounds',
    method: 'get',
    params: data
  })
}

// 仓库.出库信息*添加
export function warehouseOutboundsAdd(data) {
  return request({
    url: 'warehouse-outbounds',
    method: 'post',
    data: data
  })
}

// 仓库.入库单.列表
export function warehouseReceipts(data) {
  return request({
    url: 'warehouse-receipts',
    method: 'get',
    params: data
  })
}

// 仓库.位置.批量删除
export function LocationDel(id, data) {
  return request({
    url: 'warehouses/' + id + '/batch-positions',
    method: 'delete',
    params: data
  })
}

// 仓库.入库单.添加
export function warehouseReceiptsAdd(data) {
  return request({
    url: 'warehouse-receipts',
    method: 'post',
    data: data
  })
}

// 仓库.位置.批量添加
export function warelocalAll(id, data) {
  return request({
    url: 'warehouses/' + id + '/batch-positions',
    method: 'post',
    data: data
  })
}

// 仓库.位置列表
export function waregetlocallist(id, data) {
  return request({
    url: 'warehouses/' + id + '/positions',
    method: 'get',
    params: data
  })
}

// 采购单.审核
export function warehousePurchasesReview(id, data) {
  return request({
    url: 'warehouse-purchases/' + id + '/review',
    method: 'put',
    params: data
  })
}

// 仓库.库存信息导出
export function warehousereport(data) {
  return request({
    url: 'warehouse-inventories-report',
    method: 'get',
    params: data,
    responseType: 'blob'
  })
}

// 仓库.库存信息.根据商品归类
export function warehousegroup(data) {
  return request({
    url: 'warehouse-inventories-group',
    method: 'get',
    params: data
  })
}

// 仓库.库存信息.根据仓库区分组
export function warehousegroupclass(data) {
  return request({
    url: 'warehouse-inventories-group-warehouse',
    method: 'get',
    params: data
  })
}

// 采购单.收货完毕
export function purchaseover(id, data) {
  return request({
    url: `warehouse-purchases/${id}/receive-complete`,
    method: 'put',
    data: data
  })
}

// 采购单.获取数量
export function warehousePurchasesCount() {
  return request({
    url: 'warehouse-purchases-count',
    method: 'get'
  })
}

// 仓库.入库单.入库
export function receiptsinventory(id, data) {
  return request({
    url: 'warehouse-receipts/' + id + '/inventory',
    method: 'post',
    data: data
  })
}

// 仓库.出库信息.审核
export function warehouseOutboundReview(id, data) {
  return request({
    url: 'warehouse-outbounds/' + id + '/review',
    method: 'put',
    data: data
  })
}

// 入库单.导出
export function warehouseReceiptsExport(data) {
  return request({
    url: 'warehouse-receipts-export',
    method: 'get',
    params: data,
    responseType: 'blob'
  })
}

// 出库单.导出Issue Note
export function warehouseOutboundsExport(data) {
  return request({
    url: 'warehouse-outbounds-export',
    method: 'get',
    params: data,
    responseType: 'blob'
  })
}

// 出库单.导出Delivery Note
export function warehouseDeliveryNoteExport(data) {
  return request({
    url: 'warehouse-outbounds-export-deliverynote',
    method: 'get',
    params: data,
    responseType: 'blob'
  })
}

// 采购单.导出
export function warehousePurchasesExport(data) {
  return request({
    url: 'warehouse-purchases-export',
    method: 'get',
    params: data,
    responseType: 'blob'
  })
}
