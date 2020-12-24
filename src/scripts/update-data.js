const fs = require("fs");

const PopularGivenNamesScraper = require("../scrapers/popular-given-names");
const PopularSurnamesInAsiaScraper = require("../scrapers/popular-surnames-in-asia");
const PopularSurnamesInEuropeScraper = require("../scrapers/popular-surnames-in-europe");
const PopularSurnamesInSouthAmericaScraper = require("../scrapers/popular-surnames-in-south-america");
const PopularSurnamesInNorthAmericaScraper = require("../scrapers/popular-surnames-in-north-america");
const PopularSurnamesInOceaniaScraper = require("../scrapers/popular-surnames-in-oceania");

const BaseSanitizer = require("../sanitizers/base");
const PopularGivenNamesTransformer = require("../transformers/popular-given-names");

const Updater = () => {};

Updater.updatePopularGivenNames = async () => {
  const popularGivenNamesData = await PopularGivenNamesScraper.run();
  const sanitizedData = BaseSanitizer.sanitize(popularGivenNamesData);
  const transformedData = PopularGivenNamesTransformer.transform(sanitizedData);
  const jsonData = JSON.stringify(transformedData, null, 4);
  fs.writeFileSync(`${__dirname}/../data/popular-given-names.json`, jsonData);
};

Updater.updatePopularSurnamesInAsia = async () => {
  const popularSurnamesData = await PopularSurnamesInAsiaScraper.run();
  const sanitizedData = BaseSanitizer.sanitize(popularSurnamesData);
  const jsonData = JSON.stringify(sanitizedData, null, 4);
  fs.writeFileSync(
    `${__dirname}/../data/popular-surnames-in-asia.json`,
    jsonData
  );
};

Updater.updatePopularSurnamesInEurope = async () => {
  const popularSurnamesData = await PopularSurnamesInEuropeScraper.run();
  const sanitizedData = BaseSanitizer.sanitize(popularSurnamesData);
  const jsonData = JSON.stringify(sanitizedData, null, 4);
  fs.writeFileSync(
    `${__dirname}/../data/popular-surnames-in-europe.json`,
    jsonData
  );
};

Updater.updatePopularSurnamesInSouthAmerica = async () => {
  const popularSurnamesData = await PopularSurnamesInSouthAmericaScraper.run();
  const sanitizedData = BaseSanitizer.sanitize(popularSurnamesData);
  const jsonData = JSON.stringify(sanitizedData, null, 4);
  fs.writeFileSync(
    `${__dirname}/../data/popular-surnames-in-south-america.json`,
    jsonData
  );
};

Updater.updatePopularSurnamesInNorthAmerica = async () => {
  const popularSurnamesData = await PopularSurnamesInNorthAmericaScraper.run();
  const sanitizedData = BaseSanitizer.sanitize(popularSurnamesData);
  const jsonData = JSON.stringify(sanitizedData, null, 4);
  fs.writeFileSync(
    `${__dirname}/../data/popular-surnames-in-north-america.json`,
    jsonData
  );
};

Updater.updatePopularSurnamesInOceania = async () => {
  const popularSurnamesData = await PopularSurnamesInOceaniaScraper.run();
  const sanitizedData = BaseSanitizer.sanitize(popularSurnamesData);
  const jsonData = JSON.stringify(sanitizedData, null, 4);
  fs.writeFileSync(
    `${__dirname}/../data/popular-surnames-in-oceania.json`,
    jsonData
  );
};

Updater.run = async () => {
  Updater.updatePopularGivenNames();
  Updater.updatePopularSurnamesInAsia();
  Updater.updatePopularSurnamesInEurope();
  Updater.updatePopularSurnamesInSouthAmerica();
  Updater.updatePopularSurnamesInNorthAmerica();
  Updater.updatePopularSurnamesInOceania();
};

module.exports = Updater;
