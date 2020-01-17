import expressSelector from './main'

expressSelector.install = function(Vue) {
  Vue.component(expressSelector.name, expressSelector)
}

export default expressSelector
