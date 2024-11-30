//https://api.mangadex.org/manga?includes[]=cover_art

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
  //test change
  console.log("test")
  return {
    media: [
      {
        img: "https://mangadex.org/covers/fa933825-c0cb-41f4-94e5-38c042810dab/44bdcbe2-0b71-4854-ac5d-6c24f327f89f.jpg",
        name: "<nam>",
        url: "",
      },
    ],
    pageCount: 0,
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

