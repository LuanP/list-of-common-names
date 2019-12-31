const Sanitizer = () => {}

Sanitizer.sanitize = (data) => {
  const result = []

  for (obj of data) {
    obj.region = obj.region
      .replace(/&#[0-9]+;([0-9]+)?/gim, '')
      .replace('citation needed', '')
      .trim()

    obj.name = obj.name.trim()
    if (obj.name === 'NA') {
      continue
    }

    // split and see if there's more than one name on the object

    const names = obj.name.split(',')
    if (names.length === 1) {
      result.push(obj)
      continue
    }

    for (name of names) {
      const _obj = Object.assign({}, obj)
      _obj.name = name.trim()
      result.push(_obj)
    }
  }

  return result
}

module.exports = Sanitizer