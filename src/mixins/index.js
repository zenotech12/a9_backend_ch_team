
const mixin = {
  created() {
  },
  methods: {
    textFilter(data) {
      try {
        var obj = JSON.parse(data)
        var specArr = []
        Object.keys(obj).forEach((k) => {
          specArr.push(k + ': ' + obj[k])
        })
        return specArr.join('; ')
      } catch (e) {
        return data
      }
    }
  }
}

export default mixin
