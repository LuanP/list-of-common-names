const fetch = require('node-fetch')
const CSSselect = require('css-select')
const HTMLParser = require('htmlparser2')

const Util = require('./utils')

const Scraper = () => {}

Scraper.url = 'https://en.wikipedia.org/wiki/List_of_most_popular_given_names'

Scraper.getData = async (url) => {
  return fetch(url)
}

Scraper.getNamesText = (node) => {
  const names = []
  const nameNodes = CSSselect.selectAll('td:nth-child(n+2)', node)
  for (const nameNode of nameNodes) {
    names.push(Util.getText(nameNode))
  }

  return names
}

Scraper.getNamesFromNextTable = (genderNode, continentName) => {
  const result = []
  const table = CSSselect.selectOne('+ .wikitable > tbody', genderNode.parent)
  const rows = CSSselect.selectAll('tr:not(:first-of-type)', table)

  for (const row of rows) {
    const region = Util.getText(CSSselect.selectOne('td:nth-child(1)', row))
    const names = Scraper.getNamesText(row)

    for (const name of names) {
      result.push({
        continent: continentName,
        region: region,
        gender: Util.getText(genderNode),
        name: name
      })
    }
  }

  return result
}

Scraper.getNamesByRegionAndGender = (continentNode, continentName) => {
  const firstGender = CSSselect.selectOne('+ h4 .mw-headline', continentNode.parent)
  const secondGender = CSSselect.selectOne('+ table + h4 .mw-headline', firstGender.parent)

  let result = []
  result = result.concat(Scraper.getNamesFromNextTable(firstGender, continentName))
  result = result.concat(Scraper.getNamesFromNextTable(secondGender, continentName))

  return result
}

Scraper.run = async () => {
  const response = await Scraper.getData(Scraper.url)
  const text = await response.text()
  const dom = HTMLParser.parseDOM(text)
  const continents = CSSselect.selectAll('h3 .mw-headline', dom).slice(0, 5)

  let result = []
  for (const continentNode of continents) {
    const continentName = Util.getText(continentNode)
    result = result.concat(Scraper.getNamesByRegionAndGender(continentNode, continentName))
  }

  return result
}

// (async () => {
//   await run()

//   console.log(
//     JSON.stringify(
//       result,
//       null,
//       4
//     )
//   )
// })()

module.exports = Scraper