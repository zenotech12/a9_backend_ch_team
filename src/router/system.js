import Layout from '../views/layout/Layout'

const system = [{
  path: '/system',
  component: Layout,
  name: 'system',
  redirect: '/system/systemPrice',
  meta: { title: 'system', icon: 'role' },
  children: [{
    name: 'admin',
    path: 'admin',
    meta: { title: 'adminList', icon: 'permission' },
    component: () => import('@/views/system/adminList')
  }, {
    name: 'postage',
    path: 'postage',
    meta: { title: 'postageRule', icon: 'permission' },
    component: () => import('@/views/system/postage')
  }, {
    name: 'address',
    path: 'address',
    meta: { title: 'address', icon: 'permission' },
    component: () => import('@/views/system/address')
  }, {
    name: 'chatRobot',
    path: 'chatRobot',
    meta: { title: 'chatRobot', icon: 'permission' },
    component: () => import('@/views/system/chatRobot')
  }]
}]
export default system
