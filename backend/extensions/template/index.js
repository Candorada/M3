const extensionProperties = {
  name:"Manganato",
  sourceUrl:"https://manganato.com/",
  iconPath:"./icon.png", // can be webURL or path. Path must be relative, but can be relative to current directory
  description:`This extension is really cool. it is made for Manganato`,
  creator:"Candorada",
  creatorSocials:"https://github.com/Candorada" // optional
}
function ifError(cb,el){
  var retVal = el
  try{
      retVal = cb()
  }catch{
      return el
  }
  return retVal
}
async function search(search) {
  const result = await (await fetch(
    `https://manganato.com/advanced_search?s=all&page=1${search?"&keyw="+encodeURI(search):""}`
  )).text()
  return await {
    media:((a=result.split("panel-content-genres")[1].split("content-genres-item"),a.splice(1))).map((str)=>({
      img:str.split("src=\"")[1].split("\"")[0],
      name:str.split("title=\"")[1].split("\"")[0],
      url:str.split("href=\"")[1].split("\"")[0]
    })),
    pageCount:ifError(()=>+result.split("page-blue page-last")[1].split("(")[1].split(")")[0],1)
}
}

async function getInfo(URL){
  const htmldata = await (await fetch(URL)).text()
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
await (await fetch('http://localhost:3000/template/getInfo', {
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
