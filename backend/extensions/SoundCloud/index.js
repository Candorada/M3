var { parse } = require("node-html-parser");
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
// var { parser } = require("./node_modules/node-html-parser");

async function search(search, page) {

  const result = await (
    await fetch(
      search
        ? `https://soundcloud.com/search?q=call%20me%20maybe`
        : `https://soundcloud.com/search?q=${search}`,
    )
  ).text();

  let root = parse(result);
  let body = root.querySelector("body");
  let stuff2 = body.querySelectorAll(
    ".sc-artwork.sc-artwork-20x.sc-artwork-placeholder-3.image__full.g-opacity-transition"
  );
  console.log(stuff2); // this line prints an empty array

  console.log(stuff2[0].style["background-image"]); // this line also prints an empty array






  
  let dataInner = {
  img: `https://images.squarespace-cdn.com/content/v1/5e10bdc20efb8f0d169f85f9/09943d85-b8c7-4d64-af31-1a27d1b76698/arrow.png`,
  name: "test",
  url: "https://mangadex.org",
  };

  let data = []
  for(let i = 0; i < 10; i++){
    data.push(dataInner);
  }
  return await {
    media: data,
    pageCount: 5
}


}

async function getInfo(url) {
  const SoundCloud = require("soundcloud-scraper");
  const client = new SoundCloud.Client();
  const fs = require("fs");

client.getSongInfo(url)
    .then(async song => {
        const stream = await song.downloadProgressive();
        const writer = stream.pipe(fs.createWriteStream(`./${song.title}.mp3`));
        writer.on("finish", () => {
          console.log("Finished writing song!")
          process.exit(1);
        });
    })
    .catch(console.error);


}

module.exports = {
  search: search,
  getInfo: getInfo,
  properties: properties,
};
