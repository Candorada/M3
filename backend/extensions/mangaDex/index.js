function gussesUrl(id,params){
  return "https://api.mangadex.org/manga/"+id+"/feed"+(params?"?"+Object.keys(params).map(x=>Array.isArray(params[x])?params[x].map(y=>`${x}[]=${y}`).join("&"):`${x}=${JSON.stringify(params[x])}`).join("&"):"")
}

//example image url: 
const properties = {
  name: "MangaDex",
  type: "Comic",
  sourceUrl: "https://mangadex.org/",
  iconPath: "./icon.svg", //optional
  description: `<h2 style = "margin-top:0px;"><b>About Us</b></h2>
    <p>MangaDex is an online manga reader that caters to all languages. MangaDex is made by scanlators, for scanlators, and gives active scanlation groups complete control over their releases. All of the content on our site is uploaded either by users, scanlation groups, and in some instances the publishers themselves.</p>
    <p>MangaDex was created in January 2018 by the former admin and sole developer, Hologfx. Since then, MangaDex has been steadily growing, approaching 14 million unique visitors per month. The site is currently ran by 21+ unpaid volunteers.</p>
    <a title="https://discord.gg/vkW47gN5TY" href="https://discord.gg/vkW47gN5TY" target="_blank" rel="noopener nofollow noreferrer">The fastest way to contact us is on our Discord server.</a>`,
  creator: "Krognard",
  creatorSocials: "https://github.com/Krognard", //optional
};

async function search(search,page) {
  page = !page?1:page;
  let offset = (page - 1)*24
  let numberOfComics = 24
    var data;
    if (!search) {
      data = await (await fetch(`https://api.mangadex.org/manga?limit=${numberOfComics}&offset=${offset}&includes%5B%5D=cover_art`)).json()
    }else{
      data = await (await fetch(`https://api.mangadex.org/manga?limit=${numberOfComics}&offset=${offset}&title=${encodeURI(search)}&includes%5B%5D=cover_art&order[relevance]=desc`)).json()
    }
    let stuff = Math.ceil(data.total/numberOfComics)
    
    data = data.data.map(x=>(
      {
        img: `https://mangadex.org/covers/${x.id}/${x.relationships.find(x=>x.type == "cover_art").attributes.fileName}`,
        name: "randomAssName",
        url: "https://mangadex.org/title/"+x.id
    }))//have mulitiple of these objects (one per comic) contains information on comics being displayed on the one page
  return {
    media: data,
    pageCount: stuff, //total number of pages that you can cycle through in the website
  };
}
async function getInfo(url) { //url as a string of a manga ex https://mangadex.org/title/9ef560c3-e1b9-4451-9103-1fc5af45c09e
  
  var mangaId = url.split("/")[4]
  //console.log(gussesUrl("9ef560c3-e1b9-4451-9103-1fc5af45c09e"));
  //console.log(`https://api.mangadex.org/manga/${mangaId}/aggregate`);


  let chaptersData = await (await fetch(`https://api.mangadex.org/manga/${mangaId}/aggregate`)).json() //information about chapters
  let chaps = []
  for(vol in chaptersData.volumes){
    let x = chaptersData.volumes[vol].chapters
    for(chap in x){
      chaps.push(x[chap])
    }
  }
  let computedChaps = []
  chaps.forEach(chap => {
    computedChaps.push({
      index: chap.chapter,
      name: "HELLO",
      url: `https://mangadex.org/chapter/${chap.id}`,
      date: new Date().getTime()
    })
  })



  //!!! This is the img getting code!
  var data = await (await fetch(`https://api.mangadex.org/manga/${mangaId}?includes[]=cover_art`)).json();

  let base = data.data.relationships; // Assuming relationships is an array

  var theFileName = "dummyString";

  base.forEach(item => { // Iterate directly over the array
    if (item.type === "cover_art") { // Check the type
      theFileName = item.attributes.fileName; // Access the fileName
    }
  });
  var theCoverImg = `https://mangadex.org/covers/${mangaId}/${theFileName}`

  return {
    url: url,
    about: "heres your description asshole",
    id: "Mangadex-"+mangaId,
    name: "sharknado",
    tags:["funny", "erotic"],
    contributors: ["bob", "jerry"],
    coverImage: theCoverImg,
    chapters: computedChaps //different object for each chapter
  } 
}




async function getChapData(url) { //url of a chapter
  var imageArr = []
  var chapId = url.slice(29)

  let data = await (await fetch(`https://api.mangadex.org/at-home/server/${chapId}`)).json()
  let chap = data.chapter.data
  Object.keys(chap).forEach(key => {
    imageArr.push(`https://cmdxd98sb0x3yprd.mangadex.network/data/${data.chapter.hash}/${chap[key]}`)
  })
 

  return imageArr
}
module.exports = {
  getChapterData:getChapData,
  search: search,
  getInfo: getInfo,
  properties: properties,
};

//make page count dependent on search