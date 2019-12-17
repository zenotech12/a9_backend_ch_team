import Layout from '../views/layout/Layout'

const userMgr = [{
  path: '/userMgr',
  component: Layout,
  name: 'userMgr',
  redirect: '/userMgr/userList',
  meta: { title: 'userMgr', icon: 'care' },
  children: [{
    name: 'userList',
    path: 'userList',
    meta: { title: 'userList', icon: 'list' },
    component: () => import('@/views/userMgr/userList')
  }, {
    name: 'userBalanceRecord',
    path: 'userBalanceRecord',
    meta: { title: 'userBalanceRecord', icon: 'visitor' },
    component: () => import('@/views/userMgr/userBalanceRecord')
  }, {
    name: 'userOrderList',
    path: 'userOrderList',
    meta: { title: 'userOrderList', icon: 'list' },
    component: () => import('@/views/userMgr/userOrderList')
  }, {
    name: 'userFeedbackList',
    path: 'userFeedbackList',
    meta: { title: 'userFeedbackList', icon: 'registration' },
    component: () => import('@/views/userMgr/userFeedbackList')
  }]
}]
export default userMgr
