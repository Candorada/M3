const properties = {
  name: "Project Gutenberg",
  type: "custom_pg",
  sourceUrl: "https://www.gutenberg.org",
  iconPath: "icon.png", //optional
  description: `<h2 style = "margin-top:0px;"><b>About Us</b></h2>
    <p>Project gutenberg is a website</p>
    <a title="https://discord.gg/vkW47gN5TY" href="https://discord.gg/vkW47gN5TY" target="_blank" rel="noopener nofollow noreferrer">The fastest way to contact us is on our Discord server.</a>`,
  creator: "Jesso3",
  creatorSocials: "https://github.com/Jesso3", //optional
};

function schema() {
  let custom_pg = {
    createColumns: `
      id TEXT PRIMARY KEY,
      title TEXT,
      source TEXT,
      artist TEXT,
      cover TEXT,
      length TEXT,
      tags TEXT,
      epicb TEXT
    `,
    insertColumns: [
      "id",
      "title",
      "source",
      "artist",
      "cover",
      "length",
      "tags",
      "epicb",
    ],
    getValues: (data) => [
      data.id,
      data.title,
      data.url,
      data.artist,
      data.coverImage,
      data.length,
      JSON.stringify(data.tags),
      data.about,
    ],
  };

  return custom_pg;
}
function search(search) {}
function getInfo(url) {}

/*
 
  await(await fetch('http://localhost:3000/SoundCloud/addToLibrary', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify({url:"https://soundcloud.com/julian-orzabal-416027090/twist-and-shout",
id: "SoundCloud-Twist-and-shout",
title: "Twist-and-shout",
artist: "Beatles",
coverImage: "https://i1.sndcdn.com/artworks-5yojzEO8Gp0ZmTNz-xLjvTg-t500x500.jpg",
length: "243",
tags: "good"}),
})).json()


 */

module.exports = {
  search: search,
  getInfo: getInfo,
  properties: properties,
  schema: schema,
};
