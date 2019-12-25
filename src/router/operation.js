import Layout from '../views/layout/Layout'
const order = [{
  path: '/operation',
  component: Layout,
  name: 'operation',
  redirect: '/operation/ad',
  meta: { title: 'operationMgr', icon: 'inventory' },
  children: [{
    path: 'ad',
    name: 'adMgr',
    meta: { title: 'adMgr', icon: 'list' },
    component: () => import('@/views/operation/ad')
  }, {
    path: 'shop',
    name: 'shopInfo',
    meta: { title: 'shopInfo', icon: 'list' },
    component: () => import('@/views/operation/shop')
  }]
}]
export default order
