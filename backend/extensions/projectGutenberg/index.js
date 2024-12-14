var { parse } = require("node-html-parser");
const parser = require("./node_modules/node-html-parser");
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
      data.source,
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
        url: "https://www.gutenberg.org" + href,
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
  let htmlData = await (await fetch(url)).text();
  let root = parse(htmlData);

  let body = root.querySelector("body");

  return {
    id: "gutenberg-" + url.split("/")[3] + "-" + url.split("/")[4],
    title: body.querySelector("td[itemprop='headline']").innerText,
    source: url,
    author: body.querySelector("a[itemprop='creator']").innerText,
    cover: body.querySelector("img.cover-art").getAttribute("src"),
    summary: "summary",
    release: body.querySelector("td[itemprop='datePublished']").innerText,
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
