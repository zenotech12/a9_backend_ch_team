
import Layout from '../views/layout/Layout'
const finance = [{
  path: '/finance',
  component: Layout,
  name: 'finance',
  redirect: '/finance/list',
  meta: { title: 'financeMgr', icon: 'inventory' },
  children: [{
    path: 'list',
    name: 'financeList',
    meta: { title: 'financeList', icon: 'list' },
    component: () => import('@/views/finance/finance')
  }, {
    path: 'tixian',
    name: 'financeTixian',
    meta: { title: 'financeTixian', icon: 'list' },
    component: () => import('@/views/finance/tixian')
  }]
}]
export default finance
