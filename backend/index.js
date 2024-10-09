let express = require("express");
const app = express();
const cors = require("cors");
const fileSystem = require("fs");
let filenames = fileSystem.readdirSync(__dirname);
let names = [];
filenames.forEach((file) => {
  names.push(file);
});
app.use(cors());
app.get("/", (req, res) => {
  res.json({ test: names });
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
