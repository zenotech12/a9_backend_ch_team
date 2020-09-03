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
    path: 'orderReturn',
    name: 'orderReturn',
    meta: { title: 'returnGoods', icon: 'list', code: '3_2' },
    component: () => import('@/views/order/return')
  }, {
    path: 'orderExchange',
    name: 'orderExchange',
    meta: { title: 'exchangeGoods', icon: 'list', code: '3_4' },
    component: () => import('@/views/order/return')
  }, {
    path: 'evaluate',
    name: 'evaluateMgr',
    meta: { title: 'evaluateMgr', icon: 'list', code: '3_3' },
    component: () => import('@/views/order/evaluate')
  }]
}]
export default order
