const _ = require("lodash");

const Transformer = () => {};

Transformer.transformGivenName = (obj) => {
  if (obj.name) {
    obj.givenName = obj.name;
  }

  return _.omit(obj, ["name"]);
};

Transformer.transformSurname = (obj) => {
  if (obj.romanization) {
    obj.surname = obj.romanization;
    if (obj.name) {
      obj.originalSurname = obj.name;
    }
  } else if (obj.name) {
    obj.surname = obj.name;
  }

  return _.omit(obj, ["type", "name", "romanization"]);
};

module.exports = Transformer;
