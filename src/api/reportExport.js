import request from '@/utils/request'

// 销售商品报告.导出
export function orderSaleByGoodsExport(data) {
  return request({
    url: 'orders-sale-by-goods-export',
    method: 'get',
    params: data,
    responseType: 'blob'
  })
}

// 库存商品报告.导出
export function warehouseInventoriesOutinExport(data) {
  return request({
    url: 'warehouse-inventories-outin-export',
    method: 'get',
    params: data,
    responseType: 'blob'
  })
}

// 采购单.导出商品报告
export function warehousePurchaseExportByExport(data) {
  return request({
    url: 'warehouse-purchases-export-by-goods',
    method: 'get',
    params: data,
    responseType: 'blob'
  })
}
