// 组件全局注册
import Vue from 'vue'

import PageTitle from './pageTitle'
import PageToolbar from './pageToolbar'
import DeleteButtonText from './deleteButtontext'
import PageSearch from './PageSearch'
import PageTable from './PageTable'
import DeleteButton from './DeleteButton'
import ConfirmButton from './ConfirmButton'
import photosList from './photosList'
import filterFile from './filterFile'
import imageUpload from './imageUpload'
import priceInput from './priceInput'
import expressSelector from './expressSelector'
import propSelector from './propSelector'
import MapSelector from './MapSelector'
import SingleFileUpload from './SingleFileUpload'
import orderSelector from './orderSelector'
import showSkuTable from './showSkuTable'
import goodsSelector from './goodsSelector'
import showSkuOrder from './showSkuOrder'
import stockSelect from './stockSelect'
import showSkuPlist from './showSkuPulist'
import purchasesList from './purchaseslist'
import totalData from './totalData'
import baseDataSelect from './baseDataSelect'
import priceInputTwo from './priceInputTwo'

// 形成组件库
const components = [
  PageTitle,
  PageToolbar,
  PageSearch,
  PageTable,
  DeleteButtonText,
  DeleteButton,
  ConfirmButton,
  photosList,
  filterFile,
  imageUpload,
  priceInput,
  SingleFileUpload,
  expressSelector,
  propSelector,
  MapSelector,
  orderSelector,
  showSkuTable,
  goodsSelector,
  showSkuOrder,
  stockSelect,
  showSkuPlist,
  purchasesList,
  totalData,
  baseDataSelect,
  priceInputTwo

]

// 注册全局组件
components.map((com) => {
  Vue.use(com)
  // Vue.component(com.name, com)
})

export default components
