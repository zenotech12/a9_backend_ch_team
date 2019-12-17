/* eslint-disable brace-style */
// export default (id, items, callback) => {
//   var temppath = []
//   function getNodePath(nodes) {
//     nodes.forEach(node => {
//       temppath.push(node.id)
//       if (node.id === id) {
//         throw new Error('GOT IT!')
//       }
//       if (node.items != null && node.items.length > 0) {
//         getNodePath(node.items)
//       } else {
//         temppath.pop()
//       }
//     })
//   }
//   try {
//     getNodePath(items)
//     temppath.pop()
//   } catch (e) {
//     callback(temppath)
//   }
// }
export default (id, items, callback) => {
  // 定义变量保存当前结果路径
  var temppath = []
  function getNodePath(nodes) {
    nodes.forEach(node => {
      temppath.push(node.id)
      if (node.id === id) {
        throw new Error('GOT IT!')
      }
      if (node.items != null && node.items.length > 0) {
        getNodePath(node.items)
      } else {
        temppath.pop()
      }
    })
    temppath.pop()
  }
  try {
    getNodePath(items)
  }
  catch (e) {
    callback(temppath)
  }
}

export function getChildPath(id, items, childField, callback) {
  var temppath = []
  function getNodePath(nodes, cf) {
    nodes.forEach(node => {
      temppath.push(node.id)
      if (node.id === id) {
        throw new Error('GOT IT!')
      }
      if (node[cf] != null && node[cf].length > 0) {
        getNodePath(node[cf], cf)
      } else {
        temppath.pop()
      }
    })
  }
  try {
    getNodePath(items, childField)
    temppath.pop()
  } catch (e) {
    callback(temppath)
  }
}
