import Layout from '../views/layout/Layout'

const system = [{
  path: '/system',
  component: Layout,
  name: 'system',
  redirect: '/system/systemPrice',
  meta: { title: 'system', icon: 'role', code: '6' },
  children: [{
    name: 'admin',
    path: 'admin',
    meta: { title: 'adminList', icon: 'permission', code: '6_1' },
    component: () => import('@/views/system/adminList')
  }, {
    name: 'card',
    path: 'card',
    meta: { title: 'cardMgr', icon: 'permission', code: '6_2' },
    component: () => import('@/views/system/card')
  }, {
    name: 'postage',
    path: 'postage',
    meta: { title: 'postageRule', icon: 'permission', code: '6_3' },
    component: () => import('@/views/system/postage')
  }, {
    name: 'address',
    path: 'address',
    meta: { title: 'address', icon: 'permission', code: 'y_4' },
    component: () => import('@/views/system/address')
  },
  //   {
  //   name: 'chatRobot',
  //   path: 'chatRobot',
  //   meta: { title: 'chatRobot', icon: 'permission', code: '6_5' },
  //   component: () => import('@/views/system/chatRobot')
  // },
  {
    name: 'optLog',
    path: 'optLog',
    meta: { title: 'optLog', icon: 'permission', code: '6_6' },
    component: () => import('@/views/system/optLog')
  }]
}]
export default system
