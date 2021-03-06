import Layout from '../views/layout/Layout'
const warehouse = [{
  path: '/warehouse',
  component: Layout,
  name: 'warehouse',
  redirect: '/warehouse/List',
  meta: { title: 'procurementWarehouse', icon: 'el-icon-truck', code: '8' },
  children: [
    {
      path: 'totalinventory',
      name: 'totalinventory',
      meta: { title: 'totalinventory', icon: 'el-icon-truck', code: '8_4' },
      component: () => import('@/views/warehouse/totalinventory')
    },
    {
      path: 'inboundOutBound',
      name: 'inboundOutBound',
      meta: { title: 'journal', icon: 'el-icon-truck', code: '8_5' },
      component: () => import('@/views/warehouse/inboundOutBound')
    },
    {
      path: 'warehouseList',
      name: 'warehouseList',
      meta: { title: 'warehouseList', icon: 'el-icon-truck', code: '8_1' },
      component: () => import('@/views/warehouse/warehouseList')
    },
    {
      path: 'suppliers',
      name: 'suppliers',
      meta: { title: 'suppliersMgr', icon: 'el-icon-truck', code: '8_2' },
      component: () => import('@/views/warehouse/suppliers')
    },
    {
      path: 'purchases',
      name: 'purchases',
      meta: { title: 'purchasesMgr', icon: 'el-icon-truck', code: '8_3' },
      component: () => import('@/views/warehouse/purchases')
    }
  ]
}]
export default warehouse
