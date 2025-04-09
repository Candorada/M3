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
  let search2 = search;
  let client = this.client;
  if(!this.client){
    client = newClient()
  }
  if(!client.API_KEY){
    await client.createAPIKey()
  }
  //console.log(client.API_KEY)
  offset = (page - 1) * 24;
  let url = `https://api-v2.soundcloud.com/search/tracks?${search==""?"":"q="+search2}&client_id=${client.API_KEY}&limit=20&offset=${offset}&linked_partitioning=1&app_locale=en`
  //let url2 = `https://api-v2.soundcloud.com/search?q=${search2}&client_id=${client.API_KEY}&limit=20&offset=${offset}&linked_partitioning=1&app_locale=en`

  data = (await fetch(url).then(x=>x.json()))



  computedData = data.collection.map((x) => ({
    img: x.artwork_url,
    name: x.title,
    url: x.permalink_url
  }))

  return await {
    media: computedData,
    pageCount: Math.floor(data.total_results /24)
}


}
async function getTrackFileURL(url){
  const client = newClient();
  let retURL = client.getSongInfo(url).then(x=>x.trackURL);
  return {url:await retURL};
}
async function getInfo(url) {
  const SoundCloud = require("soundcloud-scraper");
  const client = new SoundCloud.Client();
  const fs = require("fs");
  return await client.getSongInfo(url)
    .then(async song => {
      let retVal = {
        url: song.url,
        about: song.description,
        id: "SoundCloud-" + song.id, // this would be a unique identifyer for the comic. make shure its unique
        //to make it unique just append your extension folder name at the front of your id.
        title: song.title,
        tags: song.genre?[song.genre]:[],
        contributors: [song.author.name],
        coverImage: song.thumbnail,
        chapters: [],
      }
      return retVal;
    }).catch(()=>{
      return {url:"",about:"",id:"",name:"",tags:[],contributors:[],coverImage:"",chapters:[]}
    })
/*
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
  */

}

module.exports = {
  getTrackFileURL: getTrackFileURL,
  newClient: newClient,
  search: search,
  getInfo: getInfo,
  properties: properties,
};
