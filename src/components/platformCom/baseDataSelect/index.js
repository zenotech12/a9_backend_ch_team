import baseDataSelect from './main'

baseDataSelect.install = function(Vue) {
  Vue.component(baseDataSelect.name, baseDataSelect)
}

export default baseDataSelect
