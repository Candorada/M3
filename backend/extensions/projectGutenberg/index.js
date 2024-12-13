var { parse } = require("node-html-parser");

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
  customItemPage: "file.jsx",
};

function ifError(cb, el) {
  var retVal = el;
  try {
    retVal = cb();
  } catch {
    return el;
  }
  return retVal;
}

function schema() {
  let custom_pg = {
    createColumns: `
      id TEXT PRIMARY KEY,
      title TEXT,
      source TEXT,
      author TEXT,
      cover TEXT,
      summary TEXT,
      release TEXT,
      subject TEXT,
      web TEXT,
      EPUB TEXT,
      plainText TEXT,
      HTML TEXT
    `,
    insertColumns: [
      "id",
      "title",
      "source",
      "author",
      "cover",
      "summary",
      "release",
      "subject",
      "web",
      "EPUB",
      "plainText",
      "HTML",
    ],
    getValues: (data) => [
      data.id,
      data.title,
      data.url,
      data.author,
      data.cover,
      data.summary,
      data.release,
      data.subject,
      data.web,
      data.EPUB,
      data.plainText,
      data.HTML,
    ],
  };

  return custom_pg;
}
async function search(search, page) {
  if (!page) page = 1;
  const result = await (
    await fetch(
      search
        ? `https://www.gutenberg.org/ebooks/search/?query=${encodeURI(search)}&submit_search=Go%21`
        : `https://www.gutenberg.org/ebooks/search/?sort_order=downloads&start_index=${(page - 1) * 25 + 1}`,
    )
  ).text();

  let root = parse(result);
  let body = root.querySelector("body");

  let media = [];

  body.querySelectorAll("a.link").forEach((a) => {
    const href = a.getAttribute("href");

    if (/^\/ebooks\/\d+$/.test(href)) {
      const imgElement = a.querySelector("span.leftcell img");
      const nameElement = a.querySelector("span.content .title");

      media.push({
        url: href,
        img: imgElement
          ? "https://www.gutenberg.org" + imgElement.getAttribute("src")
          : null,
        name: nameElement ? nameElement.text : null,
      });
    }
  });

  return await {
    media: media,
    //TODO: change page count
    pageCount: 1000,
  };
}
async function getInfo(url) {
  return await {
    id: "1",
    title:
      "https://cdn.pixabay.com/photo/2016/09/08/18/45/cube-1655118_1280.jpg",
    source: "source",
    author: "author",
    cover:
      "https://images.squarespace-cdn.com/content/v1/5e10bdc20efb8f0d169f85f9/09943d85-b8c7-4d64-af31-1a27d1b76698/arrow.png",
    summary: "summary",
    release: "release",
    subject: "subject",
    web: "web",
    EPUB: "EPUB",
    plainText: "plaintext",
    HTML: "epicHTML",
  };
}

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
