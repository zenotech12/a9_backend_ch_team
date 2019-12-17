
import Layout from '../views/layout/Layout'
const shareCou = [{
  path: '/shareCou',
  component: Layout,
  name: 'shareCou',
  redirect: '/shareCou/shareCouList',
  meta: { title: 'couponConfigure', icon: 'inventory' },
  children: [{
    path: 'shareCouList',
    name: 'shareCouList',
    meta: { title: 'couponList', icon: 'list' },
    component: () => import('@/views/shareCou/shareCouList')
  }]
}]
export default shareCou
