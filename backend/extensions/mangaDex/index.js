//https://api.mangadex.org/manga?includes[]=cover_art
//https://mangadex.org/title/274a8e39-71a8-4bd2-af19-4572518fe44f/leviathan
//https://mangadex.org/title/
const properties = {
  name: "MangaDex",
  type: "Comic",
  sourceUrl: "https://mangadex.org/",
  iconPath: "icon.svg", //optional
  description: `<h2 style = "margin-top:0px;"><b>About Us</b></h2>
    <p>MangaDex is an online manga reader that caters to all languages. MangaDex is made by scanlators, for scanlators, and gives active scanlation groups complete control over their releases. All of the content on our site is uploaded either by users, scanlation groups, and in some instances the publishers themselves.</p>
    <p>MangaDex was created in January 2018 by the former admin and sole developer, Hologfx. Since then, MangaDex has been steadily growing, approaching 14 million unique visitors per month. The site is currently ran by 21+ unpaid volunteers.</p>
    <a title="https://discord.gg/vkW47gN5TY" href="https://discord.gg/vkW47gN5TY" target="_blank" rel="noopener nofollow noreferrer">The fastest way to contact us is on our Discord server.</a>`,
  creator: "Krognard",
  creatorSocials: "https://github.com/Krognard", //optional
};
/*
  return {
    media: [
      {
        img: "",
        name: "<nam>",
        url: "",
      },
    ],
    pageCount: 0,
  };
 */
async function search(search,page) {

  //manga itself url: `https://api.mangadex.org/manga?limit=10&offset=${page}&title=${search}&includedTagsMode=AND&excludedTagsMode=OR&contentRating%5B%5D=safe&contentRating%5B%5D=suggestive&contentRating%5B%5D=erotica&order%5BlatestUploadedChapter%5D=desc`
  
  //cover art url: `https://api.mangadex.org/cover?limit=10&offset=${page}&manga%5B%5D=${mangaID}&order%5BlatestUploadedChapter%5D=desc`
  

  //everything works up to here

  //mangas = await (await fetch(`https://api.mangadex.org/manga?limit=10&offset=${page}&title=${search}&includedTagsMode=AND&excludedTagsMode=OR&contentRating%5B%5D=safe&contentRating%5B%5D=suggestive&contentRating%5B%5D=erotica&order%5BlatestUploadedChapter%5D=desc`)).json()
  let comicArr = []
  let numberOfComics = 24
  for(let i = 0; i < numberOfComics; i++){
    let data = await (await fetch(`https://api.mangadex.org/manga?limit=${numberOfComics}&includedTagsMode=AND&excludedTagsMode=OR&contentRating%5B%5D=safe&contentRating%5B%5D=suggestive&contentRating%5B%5D=erotica&order%5BlatestUploadedChapter%5D=desc`)).json()
    let mangaId = data.data[i].id


    let coverData = await (await fetch(`https://api.mangadex.org/cover?limit=${numberOfComics}&manga%5B%5D=${mangaId}&order%5BcreatedAt%5D=asc&order%5BupdatedAt%5D=asc&order%5Bvolume%5D=asc`)).json()
    let coverFileName = coverData.data[0].attributes.fileName
    

    let coverURL = `https://mangadex.org/covers/${mangaId}/${coverFileName}`



    comicArr.push({
        img: coverURL,
        name: "randomAssName",
        url: mangaId,
    })//have mulitiple of these objects (one per comic) contains information on comics being displayed on the one page
  }

  return {
    media: comicArr,
    pageCount: 0, //total number of pages that you can cycle through in the website
  };
}
function getInfo(url) {}
function getChapData(url) {}
module.exports = {
  getChapterData:getChapData,
  search: search,
  getInfo: getInfo,
  properties: properties,
};

