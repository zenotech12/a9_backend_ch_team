
import Layout from '../views/layout/Layout'
const finance = [{
  path: '/finance',
  component: Layout,
  name: 'finance',
  redirect: '/finance/list',
  meta: { title: 'financeMgr', icon: 'el-icon-s-finance', code: '5' },
  children: [{
    path: 'list',
    name: 'financeList',
    meta: { title: 'financeList', icon: 'el-icon-s-finance', code: '5_1' },
    component: () => import('@/views/finance/finance')
  }, {
    path: 'tixian',
    name: 'financeTixian',
    meta: { title: 'financeTixian', icon: 'el-icon-s-finance', code: '5_2' },
    component: () => import('@/views/finance/tixian')
  }]
}]
export default finance
