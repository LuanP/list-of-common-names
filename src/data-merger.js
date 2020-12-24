const _ = require("lodash");
const popularGivenNames = require("./data/popular-given-names.json");
const popularSurnamesInAsia = require("./data/popular-surnames-in-asia.json");
const popularSurnamesInEurope = require("./data/popular-surnames-in-europe.json");
const popularSurnamesInSouthAmerica = require("./data/popular-surnames-in-south-america.json");
const popularSurnamesInNorthAmerica = require("./data/popular-surnames-in-north-america.json");
const popularSurnamesInOceania = require("./data/popular-surnames-in-oceania.json");
const transform = require("./transformers/utils");

const Merger = () => {};

Merger.getAllSurnames = () => {
  return [
    ..._.map(popularSurnamesInAsia, transform.transformSurname),
    ..._.map(popularSurnamesInEurope, transform.transformSurname),
    ..._.map(popularSurnamesInSouthAmerica, transform.transformSurname),
    ..._.map(popularSurnamesInNorthAmerica, transform.transformSurname),
    ..._.map(popularSurnamesInOceania, transform.transformSurname),
  ];
};

Merger.pickMergeableDataByGroupKey = (givenNames, surnames, groupKey) => {
  let groupedGivenNames = _.groupBy(givenNames, groupKey);
  let groupedSurnames = _.groupBy(surnames, groupKey);

  groupedGivenNames = _.pick(groupedGivenNames, Object.keys(groupedSurnames));
  groupedSurnames = _.pick(groupedSurnames, Object.keys(groupedGivenNames));

  return [groupedGivenNames, groupedSurnames];
};

Merger.merge = () => {
  let givenNames = _.map(popularGivenNames, transform.transformGivenName);
  let surnames = Merger.getAllSurnames();
  [givenNames, surnames] = Merger.pickMergeableDataByGroupKey(
    givenNames,
    surnames,
    "continent"
  );

  const result = [];
  for (let [continent, continentGivenNames] of Object.entries(givenNames)) {
    const continentSurnames = surnames[continent];
    let [
      givenNamesByRegion,
      surnamesByRegion,
    ] = Merger.pickMergeableDataByGroupKey(
      continentGivenNames,
      continentSurnames,
      "region"
    );
    for (let [region, regionGivenNames] of Object.entries(givenNamesByRegion)) {
      regionGivenNames = _.shuffle(regionGivenNames);
      let regionSurnames = _.shuffle(surnamesByRegion[region]);
      const minLength = _.min([regionGivenNames.length, regionSurnames.length]);

      regionGivenNames = _.slice(regionGivenNames, 0, minLength);
      regionSurnames = _.slice(regionSurnames, 0, minLength);

      result.push(
        ..._.zipWith(regionGivenNames, regionSurnames, (item, value) => {
          return { ...item, ...value };
        })
      );
    }
  }

  return _.shuffle(result);
};

// (async () => {
//   const result = await Merger.merge();

//   console.log(JSON.stringify(result, null, 4));
// })();

// module.exports = Merger;

export default Merger;
