var { parse } = require("node-html-parser");
var { parser } = require("./node_modules/node-html-parser");
const properties = {
  name: "SoundCloud",
  type: "Music",
  sourceUrl: "https://soundcloud.com/",
  iconPath: "icon.png", //optional
  description: `<h2 style = "margin-top:0px;"><b>About Us</b></h2>
    <p>MangaDex is an online manga reader that caters to all languages. MangaDex is made by scanlators, for scanlators, and gives active scanlation groups complete control over their releases. All of the content on our site is uploaded either by users, scanlation groups, and in some instances the publishers themselves.</p>
    <p>MangaDex was created in January 2018 by the former admin and sole developer, Hologfx. Since then, MangaDex has been steadily growing, approaching 14 million unique visitors per month. The site is currently ran by 21+ unpaid volunteers.</p>
    <a title="https://discord.gg/vkW47gN5TY" href="https://discord.gg/vkW47gN5TY" target="_blank" rel="noopener nofollow noreferrer">The fastest way to contact us is on our Discord server.</a>`,
  creator: "Finnegan hopefully",
  creatorSocials: "https://github.com/krognard", //optional
  customItemPage: "itemPage.jsx",
};

function ifError(cb, el) {
  var retVal = el;
  try {
    retVal = cb();
  } catch {
    return el;
  }
  return retVal;
}

function schema() {
  let custom_sc = {
    createColumns: `
      id TEXT PRIMARY KEY,
      title TEXT,
      source TEXT,
          `,
    insertColumns: ["id", "title", "source"],
    getValues: (data) => [data.id, data.title, data.source],
  };

  return custom_sc;
}
async function search(search, page) {}

async function getInfo(url) {}

module.exports = {
  search: search,
  getInfo: getInfo,
  properties: properties,
  schema: schema,
};
