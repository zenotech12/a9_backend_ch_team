export function price(val) {
  let p = Math.abs(val) / 100
  if (isNaN(p)) {
    p = 0
  }
  if (val < 0) {
    return '-$' + p.toFixed(2)
  } else {
    return '$' + p.toFixed(2)
  }
}
