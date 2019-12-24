import Layout from '../views/layout/Layout'
const order = [{
  path: '/order',
  component: Layout,
  name: 'order',
  redirect: '/order/list',
  meta: { title: 'orderMgr', icon: 'inventory' },
  children: [{
    path: 'list',
    name: 'orderList',
    meta: { title: 'orderList', icon: 'list' },
    component: () => import('@/views/order/order')
  }, {
    path: 'evaluate',
    name: 'evaluateMgr',
    meta: { title: 'evaluateMgr', icon: 'list' },
    component: () => import('@/views/order/evaluate')
  }]
}]
export default order
