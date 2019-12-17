
import Layout from '../views/layout/Layout'
const withdrawal = [{
  path: '/withdrawal',
  component: Layout,
  name: 'withdrawal',
  redirect: '/withdrawal/withdrawalList',
  meta: { title: 'withdrawalMgr', icon: 'inventory' },
  children: [{
    path: 'withdrawalList',
    name: 'withdrawalList',
    meta: { title: 'withdrawalList', icon: 'list' },
    component: () => import('@/views/withdrawal/withdrawal')
  }]
}]
export default withdrawal
