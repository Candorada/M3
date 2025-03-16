var { parse } = require("node-html-parser");
var { parser } = require("./node_modules/node-html-parser");
const properties = {
  name: "SoundCloud",
  type: "Music",
  sourceUrl: "https://soundcloud.com/",
  iconPath: "icon.png", //optional
  description: `<h2 style = "margin-top:0px;"><b>About Us</b></h2>
    <p>SoundCloud is a website</p>`,
  creator: "Finnegan hopefully",
  creatorSocials: "https://github.com/krognard", //optional
  customItemPage: "itemPage.jsx",
};

async function search(search, page) {}

async function getInfo(url) {}

module.exports = {
  search: search,
  getInfo: getInfo,
  properties: properties,
};
