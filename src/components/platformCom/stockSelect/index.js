import stockSelect from './main'

stockSelect.install = function(Vue) {
  Vue.component(stockSelect.name, stockSelect)
}

export default stockSelect
