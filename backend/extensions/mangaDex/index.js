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
  console.log("test 1")

  //set up defaults
  if (page == null){
    page = "1"
  }

  if (search == null){
    search = "hunter"
  }
  console.log(page)
  console.log(search)
  console.log("test")

  //everything works up to here
  mangas = await (await fetch(`https://api.mangadex.org/manga?limit=10&offset=${page}&title=${search}&includedTagsMode=AND&excludedTagsMode=OR&contentRating%5B%5D=safe&contentRating%5B%5D=suggestive&contentRating%5B%5D=erotica&order%5BlatestUploadedChapter%5D=desc`)).json()
  console.log(managas)

  return {
    media: [
      { //have mulitiple of these objects (one per comic) contains information on comics being displayed on the one page
        img: "https://mangadex.org/covers/fa933825-c0cb-41f4-94e5-38c042810dab/44bdcbe2-0b71-4854-ac5d-6c24f327f89f.jpg",
        name: "https://mangadex.org/title/" + api.data[0].attributes.title.en,
        url: "https://mangadex.org/title/" + api.data[0].id,
      },
    ],
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

