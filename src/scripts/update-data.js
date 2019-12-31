const fs = require('fs')

const PopularGivenNamesScraper = require('../scrapers/popular-given-names')
const PopularGivenNamesSanitizer = require('../sanitizers/popular-given-names')
const PopularGivenNamesTransformer = require('../transformers/popular-given-names')

const Updater = () => {}

Updater.updatePopularGivenNames = async () => {
  const popularGivenNamesData = await PopularGivenNamesScraper.run()
  const sanitizedData = PopularGivenNamesSanitizer.sanitize(popularGivenNamesData)
  const transformedData = PopularGivenNamesTransformer.transform(sanitizedData)
  const jsonData = JSON.stringify(transformedData, null, 4)
  fs.writeFileSync(`${__dirname}/../data/popular-given-names.json`, jsonData)
}

Updater.run = async () => {
  Updater.updatePopularGivenNames()
}

module.exports = Updater