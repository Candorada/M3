let express = require("express");
const app = express();
const fileSystem = require("fs");
let filenames = fileSystem.readdirSync(__dirname);
let names = [];
filenames.forEach((file) => {
  names.push(file);
});

app.get("/", (req, res) => {
  res.json({ test: names });
});

app.get("/extensionList", (req, res) => {
  res.send(fileSystem.readdirSync("./extensions"));
});

app.get("/library", (req, res) => {
  res.json({ categories: ["hi", "balls"], balls: "bye" });
});

const port = 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}\nhttp://localhost:${port}`);
});
