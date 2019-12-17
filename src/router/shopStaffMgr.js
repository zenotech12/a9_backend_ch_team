import Layout from '../views/layout/Layout'

const shopStaffMgr = [{
  path: '/shopStaffMgr',
  component: Layout,
  name: 'shopStaffMgr',
  redirect: '/shopStaffMgr/shopList',
  meta: { title: 'shopMgr', icon: 'role' },
  children: [{
    name: 'shopList',
    path: 'shopList',
    meta: { title: 'shopList', icon: 'list' },
    component: () => import('@/views/shopStaffMgr/shopList')
  }]
}]
export default shopStaffMgr
