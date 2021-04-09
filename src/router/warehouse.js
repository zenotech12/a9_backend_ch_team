import Layout from '../views/layout/Layout'
const warehouse = [{
  path: '/warehouse',
  component: Layout,
  name: 'warehouse',
  redirect: '/warehouse/List',
  meta: { title: 'warehouseMgr', icon: 'inventory', code: '2' },
  children: [{
    path: 'list',
    name: 'goodsList',
    meta: { title: 'warehouseMgr', icon: 'list', code: '2_1' },
    component: () => import('@/views/warehouse/warehouseList')
  },
]
}]
export default warehouse
