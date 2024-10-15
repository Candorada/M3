let express = require("express");
const app = express();
const cors = require("cors");
const fileSystem = require("fs");
const multer = require('multer'); //for downloading extensions via drag & drop
const AdmZip = require('adm-zip');
const path = require("path");//for downloading extensions via drag & drop
const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database("media.db");


var extensions = {}
function updateExtensionList(){
  const extensionPath = path.join(__dirname, "extensions");
  let filenames = fileSystem.readdirSync(extensionPath);
  filenames.forEach((name)=>{
    extensions[name] = require("./extensions/"+name)
  })
}
updateExtensionList()
app.use(express.json());
app.use(cors());
db.serialize(() => {
  //db.run(`DROP TABLE comics`);
  db.run(
    `CREATE TABLE IF NOT EXISTS comics (
id INTEGER PRIMARY KEY,
name TEXT NOT NULL,
source TEXT NOT NULL,
cover TEXT NOT NULL,
tags TEXT,
upload_date TEXT,
recent_acuess TEXT
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
  res.json(extensions);
});

//extension download handler
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, 'extensions'));
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  }
});

// Set up multer for file uploads
const upload = multer({ storage: storage });

// Route for uploading files
app.post("/downloadExtension", upload.single('file'), async (req, res) => {
  // Check if a file was uploaded
  if (!req.file) {
    return res.status(400).send('No file uploaded.');
  }

  console.log(`Uploaded file: ${req.file.originalname}`);
  
  // Check if the uploaded file is a ZIP file based on MIME types
  const zipMimeTypes = ['application/zip', 'application/x-zip-compressed', 'application/x-zip', 'application/octet-stream'];
  
  if (zipMimeTypes.includes(req.file.mimetype)) {
    const zipFilePath = req.file.path;
    console.log(`Extracting ZIP file: ${zipFilePath}`);

    try {
      const zip = new AdmZip(zipFilePath);

      // Extract all files to the extensions directory directly
      zip.extractAllTo(path.join(__dirname, 'extensions'), true);
      console.log(`ZIP file contents extracted directly to: ${path.join(__dirname, 'extensions')}`);

      // Optionally, delete the ZIP file after extraction
      fileSystem.unlinkSync(zipFilePath); // Removes the uploaded ZIP file
      return res.status(200).send('ZIP file extracted successfully.');
    } catch (error) {
      console.error(`Error extracting ZIP file: ${error.message}`);
      return res.status(500).send('Failed to extract ZIP file.');
    }
  }

  return res.status(200).send('File uploaded successfully.');
});
//end of extension download handler


app.get("/:extension/search/:query",async (req, res) => {
  const extension = extensions[req.params.extension];
  res.send(await extension.search(req.params.query));
  //TODO: make compatible with multiple extensions later :)
});
app.post("/:extension/getInfo", async (req, res) => {
  const extension = extensions[req.params.extension];
  const body = req.body;
  db.run(
    "INSERT INTO comics (id, name, source, cover, tags) VALUES (?, ?, ?, ?, ?)",
    [
      `${body.name} - ${body.id}`,
      body.name,
      body.url,
      body.cover,
      JSON.stringify(body.tags),
    ],
  );

  res.json(await extension.getInfo(body.url));
  //TODO: make compatible with multiple extensions later :)
});

app.get("/extensionList", (req, res) => {
  updateExtensionList()
  res.json(extensions);
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
