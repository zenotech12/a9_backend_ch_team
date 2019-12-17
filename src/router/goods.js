
import Layout from '../views/layout/Layout'
const goods = [{
  path: '/goods',
  component: Layout,
  name: 'goods',
  redirect: '/goods/goodsList',
  meta: { title: 'goodsMgr', icon: 'inventory' },
  children: [{
    path: 'goodsList',
    name: 'goodsList',
    meta: { title: 'goodsList', icon: 'list' },
    component: () => import('@/views/goods/goodsList')
  }]
}]
export default goods
