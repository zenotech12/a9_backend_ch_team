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
    path: 'coupon',
    name: 'couponInfo',
    meta: { title: 'coupon', icon: 'list' },
    component: () => import('@/views/operation/coupon')
  }, {
    path: 'red-envelope',
    name: 'redEnvelope',
    meta: { title: 'redEnvelope', icon: 'list' },
    component: () => import('@/views/operation/redEnvelope')
  }, {
    path: 'panic-buys',
    name: 'panicBuys',
    meta: { title: 'panicBuys', icon: 'list' },
    component: () => import('@/views/operation/panicbuys')
  }, {
    path: 'cobuy',
    name: 'cobuy',
    meta: { title: 'cobuy', icon: 'list' },
    component: () => import('@/views/operation/cobuy')
  }, {
    path: 'shop',
    name: 'shopInfo',
    meta: { title: 'shopInfo', icon: 'list' },
    component: () => import('@/views/operation/shop')
  }]
}]
export default order
