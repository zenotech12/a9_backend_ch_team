// 组件全局注册
import Vue from 'vue'

import PageTitle from './pageTitle'
import PageToolbar from './pageToolbar'
import PageSearch from './PageSearch'
import PageTable from './PageTable'
import DeleteButton from './DeleteButton'
import ConfirmButton from './ConfirmButton'
import photosList from './photosList'
import filterFile from './filterFile'

// 形成组件库
const components = [
  PageTitle,
  PageToolbar,
  PageSearch,
  PageTable,
  DeleteButton,
  ConfirmButton,
  photosList,
  filterFile
]

// 注册全局组件
components.map((com) => {
  Vue.use(com)
  // Vue.component(com.name, com)
})

export default components
