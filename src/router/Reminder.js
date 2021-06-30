import Layout from '../views/layout/Layout'
const warehouse = [{
  path: '/Reminder',
  component: Layout,
  name: 'Reminder',
  redirect: '/Reminder/List',
  meta: { title: 'ReminderSet', icon: 'inventory', code: '10' },
  children: [
    {
        path: 'list',
        name: 'list',
        meta: { title: 'memorandum', icon: 'list', code: '10_1' },
        component: () => import('@/views/operation/memorandum')
      },
  ]
}]
export default warehouse
