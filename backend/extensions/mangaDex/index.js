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
      data = await (await fetch(`https://api.mangadex.org/manga?limit=${numberOfComics}&offset=${offset}&title=${search}&includes%5B%5D=cover_art`)).json()
    }
    
    data = data.data.map(x=>(
      {
        img: `https://mangadex.org/covers/${x.id}/${x.relationships.find(x=>x.type == "cover_art").attributes.fileName}`,
        name: "randomAssName",
        url: "https://mangadex.org/title/"+x.id
    }))//have mulitiple of these objects (one per comic) contains information on comics being displayed on the one page
  return {
    media: data,
    pageCount: 3366, //total number of pages that you can cycle through in the website
  };
}
async function getInfo(url) { //url as a string of a manga ex https://mangadex.org/title/9ef560c3-e1b9-4451-9103-1fc5af45c09e
  var mangaId = url.slice(27)
  let mangaData = await (await fetch(`https://api.mangadex.org/manga/${mangaId}?includes%5B%5D=author&includes%5B%5D=artist&includes%5B%5D=tag&includes%5B%5D=creator`)).json() // information about manga
  //example: https://api.mangadex.org/manga/9ef560c3-e1b9-4451-9103-1fc5af45c09e?includes%5B%5D=author&includes%5B%5D=artist&includes%5B%5D=tag&includes%5B%5D=creator



  
  let chaptersData = await (await fetch(`https://api.mangadex.org/manga/${mangaId}/aggregate`)).json() //information about chapters
  let chaps = chaptersData.volumes["1"].chapters
  let computedChaps = []
  Object.keys(chaps).forEach(key => {
    computedChaps.push({
      index: chaps[key].chapter,
      name: "HELLO",
      url: `https://mangadex.org/title/${chaps[key].id}`,
      date: new Date().getTime()
    })
  })
  return {
    url: url,
    about: "heres your description asshole",
    id: "Mangadex-"+mangaId,
    name: "sharknado",
    tags:["funny", "erotic"],
    contributors: ["bob", "jerry"],
    coverImage: `https://letsenhance.io/static/73136da51c245e80edc6ccfe44888a99/1015f/MainBefore.jpg`,
    chapters: computedChaps //different object for each chapter
  } 
}


async function getChapData(url) { //url of a chapter
 
  `https://mangadex.org/chapter/${chapterId}/${page}` //page starts at 1    how does it know which chapter its on?
  return ["https://"] // an array of image urls for that chapter
}
module.exports = {
  getChapterData:getChapData,
  search: search,
  getInfo: getInfo,
  properties: properties,
};

