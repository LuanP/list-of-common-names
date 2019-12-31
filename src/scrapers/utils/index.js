const Util = () => {}

Util.getText = (node, result) => {
  if (result === undefined) {
    result = []
  }

  if (node.children) {
    for (const child of node.children) {
      Util.getText(child, result)
    }
  }

  if (node.type === 'text' && node.data) {
    result.push(node.data)
  }

  return result.join(' ')
}

module.exports = Util