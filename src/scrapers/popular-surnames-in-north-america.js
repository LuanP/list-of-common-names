const fetch = require("node-fetch");
const CSSselect = require("css-select");
const HTMLParser = require("htmlparser2");

const Util = require("./utils");

const Scraper = () => {};

Scraper.url =
  "https://en.wikipedia.org/wiki/List_of_most_common_surnames_in_North_America";
Scraper.continent = "Americas";
Scraper.type = "surname";

Scraper.getData = async (url) => {
  return fetch(url);
};

Scraper.getRowTextData = (node, saveColumnIndexes) => {
  const cellData = {};
  for (const [columnName, columnIndex] of Object.entries(saveColumnIndexes)) {
    const cellNode = CSSselect.selectOne(
      `td:nth-child(n+${columnIndex})`,
      node
    );

    if (!cellNode) {
      continue;
    }

    cellData[columnName] = Util.getText(cellNode);
  }

  return cellData;
};

Scraper.findTable = (regionNode, regionName = null, nextRegionNode = null) => {
  let table = CSSselect.selectOne("+ .wikitable > tbody", regionNode.parent);

  if (table === null) {
    table = CSSselect.selectOne("~ .wikitable > tbody", regionNode.parent);

    if (table == null) {
      table = CSSselect.selectOne(
        "~ :not(.hatnote) .wikitable > tbody",
        regionNode.parent
      );
    }
  }

  if (!nextRegionNode) {
    return table;
  }

  const nextTable = Scraper.findTable(nextRegionNode);

  if (table === nextTable) {
    table = CSSselect.selectOne(
      "~ :not(.hatnote) .wikitable > tbody",
      regionNode.parent
    );
    if (table == null) {
      table = CSSselect.selectOne("~ .wikitable > tbody", regionNode.parent);
    }

    if (table === nextTable) {
      throw new Error(
        `Incorrect CSS rules applied. Same table for different regions.
        Current region: ${regionName}.
        `
      );
    }
  }

  return table;
};

Scraper.getNamesFromNextTable = (
  regionNode,
  regionName,
  nextRegionNode,
  continentName,
  type
) => {
  const result = [];
  const saveColumns = ["surname", "name", "romanization"];
  let table = Scraper.findTable(regionNode, regionName, nextRegionNode);

  const headers = CSSselect.selectAll("th", table);

  const saveColumnIndexes = {};
  let currentIndex = 0;
  let headerRowSpan = 1;
  for (const header of headers) {
    currentIndex++;
    const headerText = Util.getText(header).toLowerCase();
    if (saveColumns.includes(headerText)) {
      saveColumnIndexes[headerText] = currentIndex;
    }

    if ("rowspan" in header.attribs) {
      headerRowSpan = parseInt(header.attribs.rowspan);
    }
  }

  let rows;
  try {
    rows = CSSselect.selectAll("tr", table).slice(headerRowSpan);
  } catch (err) {
    console.log(`skipping ${regionName}`);
    return [];
  }

  for (const row of rows) {
    const cellData = Scraper.getRowTextData(row, saveColumnIndexes);
    if (cellData.surname) {
      cellData.name = cellData.surname;
      delete cellData.surname;
    }
    result.push({
      ...{
        type: type,
        continent: continentName,
        region: regionName,
      },
      ...cellData,
    });
  }

  return result;
};

Scraper.run = async () => {
  const ignoredRegions = [
    "See also",
    "Notes",
    "References",
    "Further reading",
    "External links",
  ];
  const response = await Scraper.getData(Scraper.url);
  const text = await response.text();
  const dom = HTMLParser.parseDOM(text);
  const regions = CSSselect.selectAll("h2 .mw-headline", dom);

  let result = [];
  for (const regionNode of regions) {
    const currentRegionIndex = regions.indexOf(regionNode);
    const nextRegionNode =
      currentRegionIndex + 1 < regions.length
        ? regions[currentRegionIndex + 1]
        : null;
    const regionName = Util.getText(regionNode);
    if (ignoredRegions.includes(regionName)) {
      continue;
    }
    result = result.concat(
      Scraper.getNamesFromNextTable(
        regionNode,
        regionName,
        nextRegionNode,
        Scraper.continent,
        Scraper.type
      )
    );
  }

  return result;
};

// (async () => {
//   const result = await Scraper.run();

//   console.log(JSON.stringify(result, null, 4));
// })();

module.exports = Scraper;
