const Sanitizer = () => {};

Sanitizer.sanitize = (data) => {
  const result = [];

  for (obj of data) {
    obj.region = obj.region
      .replace(/&#[0-9]+;([0-9]+)?/gim, "")
      .replace(/\(.*\)/gim, "")
      .replace("citation needed", "")
      .trim();

    obj.name = obj.name?.trim();
    if (!obj.name || obj.name === "NA" || obj.name === "N/A") {
      continue;
    }

    // split and see if there's more than one name on the object

    const namesByComma = obj.name.split(",");
    const namesBySlash = obj.name.split("/");
    if (namesByComma.length === 1 && namesBySlash.length === 1) {
      result.push(obj);
      continue;
    } else if (namesByComma.length > 1) {
      for (name of namesByComma) {
        const _obj = Object.assign({}, obj);
        _obj.name = name.trim();
        result.push(_obj);
      }
    } else if (namesBySlash.length > 1) {
      for (name of namesBySlash) {
        const _obj = Object.assign({}, obj);
        _obj.name = name.trim();
        result.push(_obj);
      }
    }
  }

  return result;
};

module.exports = Sanitizer;
