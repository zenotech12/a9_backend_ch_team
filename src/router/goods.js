
import Layout from '../views/layout/Layout'
const goods = [{
  path: '/goods',
  component: Layout,
  name: 'goods',
  redirect: '/goods/goodsList',
  meta: { title: 'goodsMgr', icon: 'el-icon-mobile', code: '2' },
  children: [{
    path: 'list',
    name: 'goodsList',
    meta: { title: 'goodsList', icon: 'el-icon-mobile', code: '2_1' },
    component: () => import('@/views/goods/goodsList')
  }, {
    path: 'publish',
    name: 'goodsPublish',
    meta: { title: 'goodsEdit', icon: 'el-icon-mobile', code: '2_2' },
    component: () => import('@/views/goods/goodsEdit')
  }, {
    path: 'share',
    name: 'shareGoods',
    meta: { title: 'shareGoods', icon: 'el-icon-mobile', code: '2_3' },
    component: () => import('@/views/goods/shareGoods')
  }]
}]
export default goods
