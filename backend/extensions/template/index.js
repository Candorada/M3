const extensionProperties = {
  name:"Manganato",
  sourceUrl:"https://manganato.com/",
  iconPath:"./icon.png", // can be webURL or path. Path must be relative, but can be relative to current directory
  description:`This extension is really cool. it is made for Manganato`,
  creator:"Candorada",
  creatorSocials:"https://github.com/Candorada" // optional
}

async function search(search) {
  const result = await (await fetch("https://manganato.com/search/story/"+encodeURI(search))).text()
  return (a=result.split("panel-search-story")[1].split("search-story-item"),a.splice(0,1),a).map((str)=>({
    img:str.split("<img")[1].split("src=\"")[1].split("\"")[0],
    name:str.split("item-right")[1].split(">")[3].split("<")[0],
    url:str.split("href=\"")[1].split("\"")[0]
}));
}

async function getInfo(URL){
  const htmldata = await (await fetch("https://chapmanganato.to/manga-wf999362")).text()
  const regex = /<li[^>]*>((?:(?!<\/li)(?:.|\s))*)<\/li>/g
  var chapterData = (htmldata.split("row-content-chapter")[1].split("</ul>")[0])
  return await{
    url:URL,
    id:URL.split("/")[3], // this would be a unique identifyer for the comic within the extension.
    name:htmldata.split("story-info-right")[1].match(/(?<=<h1>)[^<]*/)[0],
    tags:htmldata.split("Genres :")[1].split("<td")[1].split("</td>")[0].match(/(?<=>)\w+(?=<)/g),
    coverImage:htmldata.split("info-image")[1].split("src=\"")[1].split("\"")[0],
    chapters:chapterData.match(regex).map((str)=>({
      name:str.split("</a>")[0].split(">")[2],
      url:str.split("href=\"")[1].split("\"")[0],
      date:(new Date(str.split("chapter-time")[1].split("title=\"")[1].split("\"")[0])).getTime() //must be in Unix timestamp format (ms)
    }))
  }
}
/*
//example fetch to run the getInfo function for chapmanta.to
await (await fetch('http://localhost:3000/example/getInfo', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify({url:"https://chapmanganato.to/manga-wf999362"}),
})).json()
*/
module.exports = {
  search: search,
  getInfo: getInfo,
  properties: extensionProperties
};
