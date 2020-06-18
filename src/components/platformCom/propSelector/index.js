import propSelector from './main'

propSelector.install = function(Vue) {
  Vue.component(propSelector.name, propSelector)
}

export default propSelector
