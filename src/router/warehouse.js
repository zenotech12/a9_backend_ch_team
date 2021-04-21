import Layout from '../views/layout/Layout'
const warehouse = [{
  path: '/warehouse',
  component: Layout,
  name: 'warehouse',
  redirect: '/warehouse/List',
  meta: { title: 'warehouseMgr', icon: 'inventory', code: '8' },
  children: [{
    path: 'warehouseList',
    name: 'warehouseList',
    meta: { title: 'warehouseList', icon: 'list', code: '8_1' },
    component: () => import('@/views/warehouse/warehouseList')
  },
  {
    path: 'suppliers',
    name: 'suppliers',
    meta: { title: 'suppliersMgr', icon: 'list', code: '8_2' },
    component: () => import('@/views/warehouse/suppliers')
  },
  {
    path: 'purchases',
    name: 'purchases',
    meta: { title: 'purchasesMgr', icon: 'list', code: '8_3' },
    component: () => import('@/views/warehouse/purchases')
  }]
}]
export default warehouse
