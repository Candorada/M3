var { parse } = require("node-html-parser");
const SoundCloud = require("soundcloud-scraper");
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

function newClient(){
  this.client = new SoundCloud.Client();
  return this.client;
}
async function search(search, page) {
  let client = this.client;
  if(!this.client){
    client = newClient()
  }
  if(!client.API_KEY){
    await client.createAPIKey()
  }
  console.log(client.API_KEY)
  let url = `https://api-v2.soundcloud.com/search?q=test&facet=model&client_id=${client.API_KEY}&limit=20&offset=0&linked_partitioning=1&app_locale=en`
  console.log(await fetch(url).then(x=>x.json())) //acctully returns stuff
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
  newClient: newClient,
  search: search,
  getInfo: getInfo,
  properties: properties,
};
