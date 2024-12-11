let express = require("express");
const app = express();
const cors = require("cors");
const fileSystem = require("fs");
const multer = require("multer"); //for downloading extensions via drag & drop
const AdmZip = require("adm-zip");
const path = require("path"); //for downloading extensions via drag & drop
const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database("media.db");
const port = 3000;
const fport = 5173;
/**
 * @typedef {String} URL - A URL.
 * @typedef {String} filePath - A File Path
 * @typedef {Object} Extension
 * @property {string} name - The name of the extension.
 * @property {"Comic"} type - The type of the extension (e.g., "Comic").
 * @property {URL} sourceUrl - The source URL of the extension.
 * @property {filePath} iconPath - The path to the extension's icon.
 * @property {string} description - A description of the extension.
 * @property {string} creator - The creator of the extension.
 * @property {URL} creatorSocials - The creator's social handles or links.
 */

/**
 * @type {Object.<string, Extension>}
 */
var extensions = {};
function updateExtensionList() {
  const extensionPath = path.join(__dirname, "extensions");
  let filenames = fileSystem.readdirSync(extensionPath);
  filenames.forEach((name) => {
    if (name.charAt(0) != ".") {
      try {
        const x = require("./extensions/" + name);
        extensions[name] = x;
      } catch {
        console.log("error file in the extension library");
      }
    }
  });
}

const downloads = {};
async function chapterDownload({chapter_id,media_id,referer}){
  return new Promise(async (res,rej)=>{
  const chapterResp = await fetch(
    `http://localhost:3000/library/comics/${media_id}/getchapter?chapterID=${chapter_id}`,
  );
  if (!chapterResp.ok) {
    console.error(`Failed to fetch chapter: ${chapterResp.statusText}`);
    return 500
  }

  const data = await chapterResp.json();
  const chapterPath = path.join(
    "downloadedMedia",
    media_id,
    chapter_id.toString(),
  );
  await db.run(`UPDATE chapters SET downloaded = ? WHERE id = ?`, [
    1,
    chapter_id,
  ]);
  downloads[chapter_id] = {
    done: false,
    path: chapterPath,
    data: data,
    totalImages: data.length,
    progress: 0,
    queued:false,
  };
  data.forEach(async (img, index) => {
    let imgResp = await fetch(
      `http://localhost:3000/imageProxy?url=${img}&referer=${referer}`,
    );
    if (downloads[chapter_id] == undefined) {
      return;
    }
    if (!imgResp.ok) {
      console.error(
        `Failed to fetch image ${index}: ${imgResp.statusText}`,
      );
      delete downloads[chapter_id]
      return;
    }
    if (!imgResp.headers.get("content-type").startsWith("image")) {
      console.error("not an image");
      delete downloads[chapter_id]
      return;
    }
    const imageBuffer = await imgResp.arrayBuffer();
    const imageFilePath = path.join(chapterPath, `${index}.jpg`);

    await fileSystem.promises.mkdir(chapterPath, { recursive: true });
    await fileSystem.promises.writeFile(
      imageFilePath,
      Buffer.from(imageBuffer),
    );
    if (downloads[chapter_id]?.progress != undefined) {
      downloads[chapter_id].progress = downloads[chapter_id].progress + 1;
    }
    if (
      downloads[chapter_id]?.progress >= downloads[chapter_id]?.totalImages
    ) {
      downloads[chapter_id].done = true;
      db.run(`UPDATE chapters SET downloaded = ? WHERE id = ?`, [
        -1,
        chapter_id,
      ]);
      
      setTimeout(() => {
        if (downloads[chapter_id]?.done) {
          delete downloads[chapter_id];
        }
      }, 1000);
      res(200)
    }

  });
  })
}
class Node {
  constructor(value,parameters=[]) {
    this.value = value;
    this.next = null;
    this.parameters = parameters
  }
}

class Queue {
  constructor() {
    this.head = null;
    this.tail = null;
    this.size = 0;
    this.activeItems = [];
    this.maxActiveItems = 2;
  }
  enqueue(value,parameters) { // add node to que
    const newNode = new Node(value,parameters);
    if (this.size == 0) {
      this.head = newNode;
      this.tail = newNode;
    } else {
      this.tail.next = newNode;
      this.tail = newNode;
    } 
    this.size++;
    if(this.activeItems.length < this.maxActiveItems){
      this.dequeue()
    }
  }

  dequeue() {
    if (this.size == 0) {
      return;
    }
    let node = this.head
    this.head = this.head.next;
    
    if (this.size == 1) {
      this.tail = null;
    }
    let promise = node.value(...node.parameters)
    this.activeItems.push(promise)
    this.size--;
    promise.then(()=>{
      for(let i in this.activeItems){
          if(this.activeItems[i] === promise){
              this.activeItems.splice(i,1)
          }
      }
        this.dequeue()
    })
  }

  getSize() {
    return this.size;
  }

  isEmpty() {
    return this.size == 0;
  }

  getHead() {
    if (this.size === 0) {
      return null;
    }
    return this.head.value;
  }
  getItems(){
      let items = new Array(this.size)
      let item = this.head
      for(let i=0;i<this.size;i++){
          items[i] = item.value
          item = item.next
      }
      return items
  }
} // takes in a async function

const downloadQue = new Queue()
//shemas for all types of media in the database tables
const tableSchemas = {
  Comic: {
    //database entry with types
    createColumns: `
      id TEXT PRIMARY KEY,
      name TEXT,
      source TEXT,
      cover TEXT,
      tags TEXT,
      contributors TEXT,
      about TEXT
    `,
    //database column names in the same order
    insertColumns: [
      "id",
      "name",
      "source",
      "cover",
      "tags",
      "contributors",
      "about",
    ],
    //same names as being returned in extension file, in the same order as database
    getValues: (data) => [
      data.id,
      data.name,
      data.url,
      data.coverImage,
      JSON.stringify(data.tags),
      JSON.stringify(data.contributors),
      data.about,
    ],
  },
  Music: {
    createColumns: `
      id TEXT PRIMARY KEY,
      title TEXT,
      source TEXT,
      artist TEXT,
      cover TEXT,
      length TEXT,
      tags TEXT,
      about TEXT
    `,
    insertColumns: [
      "id",
      "title",
      "source",
      "artist",
      "cover",
      "length",
      "tags",
      "about",
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
  },
};
updateExtensionList();
app.use(express.json());
app.use(cors());
db.serialize(() => {
  db.run(
    `CREATE TABLE IF NOT EXISTS main (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      extension TEXT,
      downloaded BOOLEAN DEFAULT 0,
      local_id TEXT
    )`,
    //downloaded: 0 means not downloaded, -1 means downloaded
    (err) => {
      if (err) {
        console.error("Error creating 'main' table:", err.message);
      }
    },
  );

  db.run(
    `CREATE TABLE IF NOT EXISTS chapters (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      downloaded INTEGER DEFAULT 0,
			read INTEGER DEFAULT 0,
      extension TEXT,
      manga_id TEXT,
      number REAL,
      name TEXT,
      source TEXT,
      date TEXT
      )`,
    (err) => {
      if (err) {
        console.error("Error creating chapters table:", err.message);
      }
    },
  );

  Object.entries(extensions).forEach(([extension, data]) => {
    const tableName = extension;
    const type = data.properties.type;
    const schema = tableSchemas[type];

    if (schema) {
      const createTableQuery = `CREATE TABLE IF NOT EXISTS ${tableName} (${schema.createColumns})`;

      db.run(createTableQuery, (err) => {
        if (err) {
          console.error(`Error creating table ${tableName}:`, err.message);
        }
      });
    } else {
      console.warn(`No schema defined for type: ${type}`);
    }
  });
});

app.get("/", (req, res) => {
  res.json(extensions);
});

//extension download handler // this is all generated by chapgpt
(() => {
  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, path.join(__dirname, "extensions"));
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname);
    },
  });

  // Set up multer for file uploads
  const upload = multer({ storage: storage });

  // Route for uploading files
  app.post("/downloadExtension", upload.single("file"), async (req, res) => {
    // Check if a file was uploaded
    if (!req.file) {
      return res.status(400).send("No file uploaded.");
    }

    console.log(`Uploaded file: ${req.file.originalname}`);

    // Check if the uploaded file is a ZIP file based on MIME types
    const zipMimeTypes = [
      "application/zip",
      "application/x-zip-compressed",
      "application/x-zip",
      "application/octet-stream",
    ];

    if (zipMimeTypes.includes(req.file.mimetype)) {
      const zipFilePath = req.file.path;
      const folderPath = zipFilePath.substring(0, zipFilePath.length - 4);
      console.log(`Extracting ZIP file: ${zipFilePath}`);

      try {
        const zip = new AdmZip(zipFilePath);
        const outputDir = path.join(__dirname, "extensions");

        // Iterate over each file in the ZIP
        zip.getEntries().forEach((entry) => {
          const fileName = entry.entryName;

          // Skip files that start with __ or .
          if (!fileName.startsWith("__") && !fileName.startsWith(".")) {
            const entryPath = path.join(outputDir, fileName);
            if (entry.isDirectory) {
              fileSystem.mkdirSync(entryPath, { recursive: true }); // Create directory if it's a folder
            } else {
              // Extract the file
              fileSystem.writeFileSync(entryPath, entry.getData());
              console.log(`Extracted: ${fileName}`);
            }
          } else {
            console.log(`Skipped: ${fileName}`);
          }
        });
        // Optionally, delete the ZIP file after extraction
        fileSystem.unlinkSync(zipFilePath); // Removes the uploaded ZIP file
        return res.status(200).send("ZIP file extracted successfully.");
      } catch (error) {
        console.error(`Error extracting ZIP file: ${error.message}`);
        return res.status(500).send("Failed to extract ZIP file.");
      }
    }
    updateExtensionList();
    return res.status(200).send("File uploaded successfully.");
  });
})();
//end of extension download handler
app.get("/:extension/search", async (req, res) => {
  const extension = extensions[req.params.extension];

  try {
    var x = await extension.search(req.query.q, req.query.page);
  } catch {
    var x = [];
    res.status(400);
  }
  res.send(x);
});

app.post("/deleteChapter", async (req, res) => {
  const body = req.body;
  const media_id = body.media_id;
  const chapter_id = body.chapter_id.toString();
  try {
    const filepath = path.join(
      __dirname,
      "downloadedMedia",
      media_id,
      chapter_id,
    );
    let delProm = await fileSystem.promises.rm(filepath, {
      recursive: true,
      force: true,
    });
    db.run(`UPDATE chapters SET downloaded = 0 WHERE id = ?`, [chapter_id]);
    delete downloads[chapter_id];
  } catch (e) {
    res.sendStatus(400);
    console.error("didn't work: ", e);
  }
  res.sendStatus(200);
});

//delete media from library
app.post("/delete", async (req, res) => {
  /*
    (await fetch('http://localhost:3000/delete', {
      method: 'POST',
	  	headers: {
          'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id: "Manganato-manga-aa951409",
      }), 
    })).json()

   */

  const body = req.body;
  const id = body.id;

  try {
    const table = body.extension;
    const extension = extensions[table];
    if (!extension) {
      //return res.sendStatus(400);
    }
    const type = extension?.properties?.type;
    let delProms = []; // deletionPromises
    function newDel(...vars) {
      let prom = new Promise((res, rej) => {
        db.serialize(() => {
          db.run(...vars, (err, data) => {
            if (!err) {
              res(data);
            } else {
              rej(err);
            }
          });
        });
      });
      delProms.push(prom);
      return prom;
    }
    db.serialize(() => {
      let isStr = typeof id == "string";
      let q = typeof id == "string" ? " = ?" : " IS " + id; // uses is with the id concated or = ?. if the id is null then the fetch fails so this is needed to make a search based on id work with broken installs
      newDel(`DELETE FROM main WHERE local_id${q}`, isStr ? [id] : []); //newDel is litterally db.run but it adds it to the delProms array which is being awaited later
      newDel(`DELETE FROM ${table} WHERE id${q}`, isStr ? [id] : []);
      if (type === "Comic") {
        newDel(`DELETE FROM chapters WHERE manga_id${q}`, isStr ? [id] : []);
      }
    });
    try {
      const filepath = path.join(__dirname, "downloadedMedia", id);
      await fileSystem.promises.rm(filepath, { recursive: true, force: true });
    } catch (e) {
      console.error("File deletion error:", e);
    }
    Promise.allSettled(delProms).then((re) => {
      let allWorked = true;
      re.forEach((r) => {
        allWorked = r.status == "fulfilled" && allWorked;
      });
      if (allWorked) {
        res.sendStatus(200);
      } else {
        res.sendStatus(500);
      }
    });
  } catch (error) {
    console.error("Unexpected error:", error);
    res.sendStatus(500);
  }
});

app.post("/:extension/getInfo", async (req, res) => {
  const extension = extensions[req.params.extension];
  const body = req.body;
  res.json(await extension.getInfo(body.url));
});
/*
//example get info
await fetch("http://localhost:3000/Manganato/getInfo",{
    method:"POST",
    headers:{
        "content-type":"application/json"
    },
    body:JSON.stringify({
        url:"https://chapmanganato.to/manga-tn997122"
    })
}).then(x=>x.json())
*/

app.get("/imageProxy", async (req, res) => {
  let url = req.query.url;
  if (!url) {
    res.sendStatus(400);
    return;
  }
  if (!url.startsWith("http")) {
    url = `http://localhost:${fport}/${url}`;
    //comment
  }
  try {
    let fet = fetch(url, {
      headers: {
        accept:
          "image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8",
        "accept-language": "en-US,en;q=0.9",
        "cache-control": "no-cache",
        pragma: "no-cache",
        priority: "i",
        "sec-ch-ua": '"Chromium";v="131", "Not_A Brand";v="24"',
        "sec-ch-ua-mobile": "?0",
        "sec-ch-ua-platform": '"macOS"',
        "sec-fetch-dest": "image",
        "sec-fetch-mode": "no-cors",
        "sec-fetch-site": "cross-site",
      },
      referrer: req.query.referer,
      referrerPolicy: "strict-origin-when-cross-origin",
      body: null,
      method: "GET",
      mode: "cors",
      credentials: "omit",
    });
    res.set("Content-Type", "image/jpeg");
    let buffer = Buffer.from(await (await fet).arrayBuffer());
    res.send(buffer);
  } catch {
    res.status(404).send("ERROR INSTALLING IMAGE");
  }
});

//get images for comic chapters
app.get("/library/:category/:mediaid/getchapter", async (req, res) => {
  // http://localhost:3000/library/comics/Manganato-manga-aa951409/getchapter?url=https://chapmanganato.to/manga-aa951409/chapter-1120
  // http://localhost:3000/library/comics/Manganato-manga-aa951409/getchapter?chapterID=21621
  let url = req.query.url;
  const chapterID = req.query.chapterID;
  const id = req.params.mediaid;

  try {
    const extension = await new Promise((resolve) => {
      db.get(
        `SELECT extension FROM main WHERE local_id=? COLLATE NOCASE`,
        [id],
        (err, row) => {
          if (err) {
            console.error("Error retrieving chapter data:", err);
            return resolve(null);
          }
          if (!row) {
            console.error("No data found for given mediaID.");
            return resolve(null);
          }
          resolve(row.extension);
        },
      );
    });

    if (chapterID != undefined) {
      url = await new Promise((resolve) => {
        db.get(
          `SELECT source FROM chapters WHERE id=?`,
          [chapterID],
          (err, row) => {
            if (err) {
              console.error("Error retrieving chapter data:", err);
              return resolve(null);
            }
            if (!row) {
              console.error("No data found for given mediaID.");
              return resolve(null);
            }
            resolve(row.source);
          },
        );
      });
    }

    res.send(await extensions[extension].getChapterData(url));
  } catch (e) {
    res.json(["../backend/notFound.png"]);
  }
});
app.get("/downloadingMedia", async (req, res) => {
  res.json(downloads);

  //TODO: add functionality for different media types
});

//add media to your library
app.post("/:extension/addToLibrary", async (req, res) => {
  try {
    const extension = extensions[req.params.extension];
    const body = req.body;
    const type = extension.properties.type;
    const schema = tableSchemas[type];
    let data = (await extension.getInfo(body.url)) || body;
    const tableName = req.params.extension;

    db.serialize(() => {
      db.get(
        `SELECT id FROM ${tableName} WHERE id = ?`,
        [data.id],
        (err, row) => {
          if (err) {
            console.error("Error checking for existing entry:", err.message);
            return;
          }

          if (!row && schema) {
            db.run(
              `INSERT INTO main (extension, local_id) VALUES (?, ?)`,
              [tableName, data.id],
              (err) => {
                if (err) {
                  console.error("Error inserting into main:", err.message);
                  return;
                }

                const columns = schema.insertColumns.join(", ");
                const placeholders = schema.insertColumns
                  .map(() => "?")
                  .join(", ");
                const values = schema.getValues(data);
                const insertQuery = `INSERT INTO ${tableName} (${columns}) VALUES (${placeholders})`;
                if (values[0] == undefined) {
                  return;
                }

                db.run(insertQuery, values, (err) => {
                  if (err) {
                    console.error(
                      `Error inserting into ${tableName}:`,
                      err.message,
                    );
                    return;
                  }

                  if (type === "Comic") {
                    let chapterInserts = 0;
                    const totalChapters = data?.chapters?.length;

                    if (totalChapters === 0) {
                      // No chapters, call fetch immediately
                      makeFetchCall();
                    }
                    data?.chapters?.forEach((chapter) => {
                      db.run(
                        `INSERT INTO chapters (extension, manga_id, name, number, source, date) VALUES (?, ?, ?, ?, ?, ?)`,
                        [
                          tableName,
                          data.id,
                          chapter.name,
                          chapter.index,
                          chapter.url,
                          chapter.date,
                        ],
                        (err) => {
                          if (err) {
                            console.error(
                              "Error inserting chapter:",
                              err.message,
                            );
                            return;
                          }

                          chapterInserts++;
                          if (chapterInserts === totalChapters) {
                            makeFetchCall();
                          }
                        },
                      );
                    });
                  } else {
                    makeFetchCall();
                  }
                });
              },
            );
          } else {
            makeFetchCall();
          }
        },
      );
    });
    function makeFetchCall() {
      fetch("http://localhost:3000/download", {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          media_id: data.id,
          referer: req.body.url,
          cover: true,
          extension: tableName,
        }),
      });
    }

    res.sendStatus(200);
  } catch (e) {
    res.json(e);
  }
});

//show all extensions and their properties
app.get("/extensionList", (req, res) => {
  updateExtensionList();
  res.json(extensions);
});

//download media
app.post("/download", async (req, res) => {
  /*
    (await fetch('http://localhost:3000/download', {
      method: 'POST',
          headers: {
          'content-type': 'application/json',
      },
      body: JSON.stringify({
        media_id: "manganato-manga-aa951409",
					referer: "http://chapmanganato.to",

					//if manga put chapter_id (id in chapters table)
					chapter_id: 1329,
      }), 
    })).json()


*/
  const body = req.body;
  const media_id = body.media_id;
  const chapter_id = body.chapter_id;
  const cover = body.cover;
  const referer = body.referer;
  const table = body.extension;
  try {
    let filepath = path.join(__dirname, "downloadedMedia", media_id);
    if (cover) {
      const coverUrl = await new Promise((resolve) => {
        db.get(
          `SELECT cover FROM ${table} WHERE id = ? COLLATE NOCASE`,
          [media_id],
          (err, row) => {
            if (err) {
              console.error("Error getting cover URL:", err);
              return resolve(null);
            }
            resolve(row?.cover || null);
          },
        );
      });
      let response;
      try {
        response = await fetch(
          `http://localhost:3000/imageProxy?url=${coverUrl}&referer=${referer}`,
        );
      } catch {
        res.sendStatus(404);
        return;
      }

      if (!response.ok) {
        console.error(`Failed to fetch cover image: ${response.statusText}`);
        return res.sendStatus(500);
      }

      await fileSystem.promises.mkdir(filepath, { recursive: true });
      await fileSystem.promises.writeFile(
        path.join(filepath, "cover.jpg"),
        Buffer.from(await response.arrayBuffer()),
      );
      return res.sendStatus(200);
    } else if (chapter_id) {
      let data = {chapter_id:chapter_id,media_id : media_id,referer:referer}
      downloads[chapter_id] = {
        done: false,
        data: [],
        totalImages: 0,
        progress: 0,
        queued:true,
      }
      downloadQue.enqueue(chapterDownload,[data])
      res.sendStatus(200);
    }

    //TODO: add functionality for different media types
  } catch (err) {
    console.error("Unexpected error:", err.message);
    res.sendStatus(500);
  }
});
app.get("/downloadedImages/:mediaID/:chapterID", async (req, res) => {
  try {
    let chapID = req.params.chapterID;
    let mediaID = req.params.mediaID;
    let path = "../backend/downloadedMedia/" + mediaID + "/" + chapID;
    let files = fileSystem.readdirSync(path);
    files = files.sort((x, y) => {
      let a = +x.split(".")[0];
      let b = +y.split(".")[0];
      return a - b;
    });
    if (!files) {
      res.send(["vite.svg"]);
      return;
    }
    res.send(files.map((x) => path + `/${x}`));
  } catch {
    res.status(400);
    res.send(["../backend/notFound.png"]);
  }
});

//run fetch requests for images through a proxy
app.get("/imageProxy", async (req, res) => {
  if (!req.query.url) {
    console.error("not a valid Url");
    res.sendStatus(400);
    return;
  }
  try {
    let fet = fetch(req.query.url, {
      headers: {
        accept:
          "image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8",
        "accept-language": "en-US,en;q=0.9",
        "cache-control": "no-cache",
        pragma: "no-cache",
        priority: "i",
        "sec-ch-ua": '"Chromium";v="131", "Not_A Brand";v="24"',
        "sec-ch-ua-mobile": "?0",
        "sec-ch-ua-platform": '"macOS"',
        "sec-fetch-dest": "image",
        "sec-fetch-mode": "no-cors",
        "sec-fetch-site": "cross-site",
      },
      referrer: req.query.referer,
      referrerPolicy: "strict-origin-when-cross-origin",
      body: null,
      method: "GET",
      mode: "cors",
      credentials: "omit",
    });
    res.set("Content-Type", "image/jpeg");
    let buffer = Buffer.from(await (await fet).arrayBuffer());
    res.send(buffer);
  } catch {
    res.sendStatus(404);
  }
});

//get data about a certain piece of media
app.get("/library/:category/:mediaID", (req, res) => {
  const id = req.params.mediaID;

  db.get(`SELECT extension FROM main WHERE local_id = ?`, [id], (err, row) => {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).send("Internal server error");
    }

    if (!row || !row.extension) {
      return res.sendStatus(404);
    }

    const table = row.extension;
    const type = extensions[table].properties.type;

    db.get(`SELECT * FROM ${table} WHERE id = ?`, [id], (err, row) => {
      if (err) {
        console.error("Database error:", err);
        return res.status(500).send("Internal server error");
      }

      if (!row) {
        return res.sendStatus(404);
      }
      const jsonData = {};
      Object.assign(jsonData, row);

      if (type == "Comic") {
        db.all(
          `SELECT * FROM chapters WHERE manga_id=? ORDER BY number`,
          [row.id],
          (err, rows) => {
            if (err) {
              console.error("Database error:", err);
              return res.status(500).send("Internal server error");
            }

            if (!rows) {
              console.error("problem getting chapters");
              return res.sendStatus(404);
            }

            Object.assign(jsonData, { chapters: rows });
            res.json(jsonData);
          },
        );
      } else {
        res.json(row);
      }
    });
  });
});

//get all media data
app.get("/library/:category", async (req, res) => {
  const promises = [];

  Object.keys(extensions).forEach((table) => {
    const promise = new Promise((resolve, reject) => {
      db.all(`SELECT * FROM ${table}`, [], (err, data) => {
        if (err) {
          reject(err);
        } else {
          const parsedData = data.map((item) => {
            if (item.tags) {
              item.tags = JSON.parse(item.tags);
            }
            item.extension = table;
            return item;
          });
          resolve(parsedData);
        }
      });
    });
    promises.push(promise);
  });

  try {
    const allData = await Promise.all(promises);
    const flattenedData = allData.flat();
    res.json(flattenedData);
  } catch (error) {
    console.error("Database error:", error);
    res.status(500);
  }
});

app.post("/read", async (req, res) => {
  const body = req.body;
  const status = body.status;
  //const media_id = body.media_id; // uncomment when you need it ;)
  const chapter_id = body.chapter_id;
  if (typeof chapter_id == "string") {
    chapter_id = [chapter_id];
  }

  db.run(
    `UPDATE chapters SET read = ? WHERE id IN (${chapter_id.join(",")})`,
    [status],
    (err) => {
      if (err) {
        console.error("error on reading update: ", err);
        res.sendStatus(400);
      } else {
        res.sendStatus(200);
      }
    },
  );
});

app.get("/library", (req, res) => {
  res.json({
    categories: ["comics", "movies", "games", "ebooks", "audiobooks", "music"],
    balls: "bye",
  });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}\nhttp://localhost:${port}`);
});
