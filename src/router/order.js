import Layout from '../views/layout/Layout'
const order = [{
  path: '/order',
  component: Layout,
  name: 'order',
  redirect: '/order/list',
  meta: { title: 'orderMgr', icon: 'inventory', code: '3' },
  children: [{
    path: 'list',
    name: 'orderList',
    meta: { title: 'orderList', icon: 'list', code: '3_1' },
    component: () => import('@/views/order/order')
  }, {
    path: 'return',
    name: 'returnList',
    meta: { title: 'returnList', icon: 'list', code: '3_2' },
    component: () => import('@/views/order/return')
  }, {
    path: 'evaluate',
    name: 'evaluateMgr',
    meta: { title: 'evaluateMgr', icon: 'list', code: '3_3' },
    component: () => import('@/views/order/evaluate')
  }]
}]
export default order
