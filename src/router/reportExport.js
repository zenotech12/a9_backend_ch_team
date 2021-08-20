import Layout from '../views/layout/Layout'
const reportExport = [{
  path: '/reportExport',
  component: Layout,
  name: 'reportExport',
  redirect: '/reportExport/export',
  meta: { title: 'exportMgr', icon: 'inventory', code: '11' },
  children: [
    {
      path: 'export',
      name: 'export',
      meta: { title: 'reportExport', icon: 'list', code: '11_1' },
      component: () => import('@/views/reportExport/reportExport')
    }
  ]
}]
export default reportExport
