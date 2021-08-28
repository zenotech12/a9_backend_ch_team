import Layout from '../views/layout/Layout'
const warehouse = [{
  path: '/Reminder',
  component: Layout,
  name: 'Reminder',
  redirect: '/Reminder/List',
  meta: { title: 'ReminderSet', icon: 'el-icon-notebook-2', code: '10' },
  children: [
    {
      path: 'list',
      name: 'list',
      meta: { title: 'memorandum', icon: 'el-icon-notebook-2', code: '10_1' },
      component: () => import('@/views/reminder/memorandum')
    },
  ]
}]
export default warehouse
