let express = require("express");
const app = express();
const cors = require("cors");
const fileSystem = require("fs");
const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database("media.db");
let filenames = fileSystem.readdirSync(__dirname);
let names = [];
filenames.forEach((file) => {
  names.push(file);
});
app.use(cors());

db.serialize(() => {
  db.run(
    `CREATE TABLE IF NOT EXISTS comics (
id INTEGER PRIMARY KEY AUTOINCREMENT,
name TEXT NOT NULL,
source TEXT NOT NULL,
upload_date TEXT NOT NULL,
recent_access TEXT NOT NULL
)`,
    (err) => {
      if (err) {
        console.error("Error creating table:", err.message);
      } else {
        console.log("Table created or already exits");
      }
    },
  );
});

app.get("/", (req, res) => {
  res.json({ test: names });
});

app.get("/:extension/search", (req, res) => {
  const extension = require("./extensions/supercooll.js");
  res.send(extension.search());
  //TODO: make compatible with multiple extensions later :)
});

app.get("/extensionList", (req, res) => {
  res.send(fileSystem.readdirSync("./extensions"));
});

app.get("/test", async (req, res) => {
  let img = await await fetch(
    "https://cdn-icons-png.flaticon.com/512/3460/3460831.png",
  );
  console.log(img.arrayBuffer);
  res.set("Content-Type", "image/png");
  res.send(Buffer.from(await img.arrayBuffer()));
});

app.get("/html", (req, res) => {
  res.send(
    "<a href = 'https://www.google.com'>html stuff</a> <br></br> <a>hi</a>",
  );
});

app.get("/render", (req, res) => {
  console.log("ass");
  res.send("balls");
});

app.get("/library", (req, res) => {
  res.json({
    categories: ["manga", "comics", "movies", "games", "ebooks", "audiobooks"],
    balls: "bye",
  });
});

const port = 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}\nhttp://localhost:${port}`);
});
