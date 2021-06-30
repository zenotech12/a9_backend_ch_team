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
    name: 'freeShiping',
    path: 'freeShiping',
    meta: { title: 'freeShipingSet', icon: 'permission', code: '6_7' },
    component: () => import('@/views/system/freeShiping')
  }, {
    name: 'fullReduction',
    path: 'fullReduction',
    meta: { title: 'fullReductionSet', icon: 'permission', code: '6_8' },
    component: () => import('@/views/system/fullReduction')
  }, {
    name: 'address',
    path: 'address',
    meta: { title: 'address', icon: 'permission', code: '6_4' },
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
  },
  {
    name: 'baseData',
    path: 'baseData',
    meta: { title: 'baseData', icon: 'permission', code: '6_9' },
    component: () => import('@/views/system/baseData')
  },  {
    name: 'AbnormalLogin',
    path: 'AbnormalLogin',
    meta: { title: 'AbnormalLogin', icon: 'permission', code: '6_10' },
    component: () => import('@/views/system/AbnormalLogin')
  }]
}]
export default system
