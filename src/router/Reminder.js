import Layout from '../views/layout/Layout'
const warehouse = [{
  path: '/Reminder',
  component: Layout,
  name: 'Reminder',
  redirect: '/Reminder/List',
  meta: { title: 'procurementWarehouse', icon: 'inventory', code: '4' },
  children: [
    {
        path: 'list',
        name: 'list',
        meta: { title: 'memorandum', icon: 'list', code: '4_8' },
        component: () => import('@/views/operation/memorandum')
      },
  ]
}]
export default warehouse
