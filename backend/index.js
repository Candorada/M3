let express = require("express");
const app = express();
const cors = require("cors");
const fileSystem = require("fs");
const path = require("path");
const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database("media.db");

const extensionPath = path.join(__dirname, "extensions");
let filenames = fileSystem.readdirSync(extensionPath);

app.use(express.json());
app.use(cors());
db.serialize(() => {
  db.run(
    `CREATE TABLE IF NOT EXISTS comics (
id INTEGER PRIMARY KEY AUTOINCREMENT,
name TEXT NOT NULL,
source TEXT NOT NULL,
upload_date TEXT NOT NULL,
recent_acuess TEXT NOT NULL
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
  res.json({ test: filenames });
});

app.get("/:extension/search", (req, res) => {
  const extension = require("./extensions/template/template.js");
  extension(app);
  res.send(extension.search());
  //TODO: make compatible with multiple extensions later :)
});
app.post("/:extension/getInfo", async (req, res) => {
  const extension = require("./extensions/template/template.js");
  const body = req.body;
  res.json(await extension.getInfo(body.url));
  //TODO: make compatible with multiple extensions later :)
});

app.get("/extensionList", (req, res) => {
  res.json(filenames);
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
    categories: [
      "manga",
      "comics",
      "movies",
      "games",
      "ebooks",
      "audiobooks",
      "music",
    ],
    balls: "bye",
  });
});
app.get("library/:category", (req, res) => {
  res.json([
    //yes this is currently empty.
  ]);
  //TODO work later with multiple categories
});

const port = 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}\nhttp://localhost:${port}`);
});
