var { parse } = require("node-html-parser");
var { parser } = require("./node_modules/node-html-parser");
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
    summary: htmlData.match(
      /<th>Summary<\/th>\s*<td>\s*([\s\S]*?)\s*<\/td>/,
    )[1],
    release: body.querySelector("td[itemprop='datePublished']").innerText,
    subject: JSON.stringify(
      Array.from(body.querySelectorAll("td[property='dcterms:subject'] a")).map(
        (a) => (a ? a.innerText : null),
      ),
    ),
    web:
      "https://www.gutenberg.org" +
      body.querySelector("a[title='Read online']").getAttribute("href"),
    EPUB:
      "https://www.gutenberg.org" +
      body.querySelector("a[type='application/epub+zip']").getAttribute("href"),
    plainText:
      "https://gutenberg.org" +
      body
        .querySelector("a[type='text/plain; charset=us-ascii']")
        .getAttribute("href"),
    HTML:
      "https://gutenberg.org" +
      body.querySelector("a[type='application/zip']").getAttribute("href"),
  };
}

module.exports = {
  search: search,
  getInfo: getInfo,
  properties: properties,
  schema: schema,
};
