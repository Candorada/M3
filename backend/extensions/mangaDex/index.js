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
    data = data.data.map(x=>({
        img: `https://mangadex.org/covers/${x.id}/${x.relationships.find(x=>x.type == "cover_art").attributes.fileName}`,
        name: "randomAssName",
        url: "https://mangadex.org/title/"+x.id
    }))//have mulitiple of these objects (one per comic) contains information on comics being displayed on the one page
  return {
    media: data,
    pageCount: 3366, //total number of pages that you can cycle through in the website
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

