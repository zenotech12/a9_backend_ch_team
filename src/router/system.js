import Layout from '../views/layout/Layout'

const system = [{
  path: '/system',
  component: Layout,
  name: 'system',
  redirect: '/system/systemPrice',
  meta: { title: 'system', icon: 'role' },
  children: [{
    name: 'adminList',
    path: 'adminList',
    meta: { title: 'adminList', icon: 'permission' },
    component: () => import('@/views/system/adminList')
  }]
}]
export default system
