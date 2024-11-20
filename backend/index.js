let express = require("express");
const app = express();
const cors = require("cors");
const fileSystem = require("fs");
const multer = require("multer"); //for downloading extensions via drag & drop
const AdmZip = require("adm-zip");
const path = require("path"); //for downloading extensions via drag & drop
const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database("media.db");
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
    //downloaded: 0 means not downloaded, 1 means downloaded
    (err) => {
      if (err) {
        console.error("Error creating 'main' table:", err.message);
      }
    },
  );

  db.run(
    `CREATE TABLE IF NOT EXISTS chapters (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      downloaded BOOLEAN DEFAULT 0,
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
    var x = await extension.search(req.query.q);
  } catch {
    var x = [];
    res.status(400);
  }
  res.send(x);
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
  res.sendStatus(200);
  try {
    const table = await new Promise((resolve) => {
      db.get(
        `SELECT extension FROM main WHERE local_id = ?`,
        [id],
        (err, row) => {
          if (err) {
            console.error("Database error:", err);
            return resolve(null);
          }
          resolve(row?.extension || null);
        },
      );
    });

    if (!table) {
      return res.sendStatus(404);
    }

    const extension = extensions[table];
    if (!extension) {
      return res.sendStatus(400);
    }

    const type = extension.properties.type;
    db.run(`DELETE FROM main WHERE local_id = ?`, [id]);
    db.run(`DELETE FROM ${table} WHERE id = ?`, [id]);

    if (type === "Comic") {
      db.run(`DELETE FROM chapters WHERE manga_id = ?`, [id]);
    }
  } catch (error) {
    console.error("Unexected error:", error);
    res.sendStatus(500);
  }
});

app.post("/:extension/getInfo", async (req, res) => {
  const extension = extensions[req.params.extension];
  const body = req.body;
  res.json(await extension.getInfo(body.url));
});

app.get("/imageProxy", async (req, res) => {
  if (!req.query.url) {
    res.sendStatus(400);
    return;
  }
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
  console.log(buffer);
  res.send(buffer);
});

//get images for comic chapters
app.get("/library/:category/:mediaid/getchapter", async (req, res) => {
  // http://localhost:3000/library/comics/Manganato-manga-aa951409/getchapter?url=https://chapmanganato.to/manga-aa951409/chapter-1120
  // http://localhost:3000/library/comics/Manganato-manga-aa951409/getchapter?chapterID=2104
  let url = req.query.url;
  const chapterID = req.query.chapterID;
  const id = req.params.mediaid;

  const extension = await new Promise((resolve) => {
    db.get(`SELECT extension FROM main WHERE local_id=?`, [id], (err, row) => {
      if (err) {
        console.error("Error retrieving chapter data:", err);
        return resolve(null);
      }
      if (!row) {
        console.error("No data found for given mediaID.");
        return resolve(null);
      }
      resolve(row.extension);
    });
  });

  if (chapterID != undefined) {
    console.log("balls");
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
});

//add media to your library
app.post("/:extension/addToLibrary", async (req, res) => {
  try {
    const extension = extensions[req.params.extension];
    const body = req.body;
    const type = extension.properties.type;
    const schema = tableSchemas[type];
    let data = (await extension.getInfo(body.url)) || body;
    db.serialize(() => {
      const tableName = req.params.extension;

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
              `INSERT INTO main (extension,local_id) VALUES (?,?)`,
              [tableName, data.id],
              (err) => {
                if (err) {
                  console.error("Error inserting into main:", err.message);
                }
              },
            );
            const columns = schema.insertColumns.join(", ");
            const placeholders = schema.insertColumns.map(() => "?").join(", ");
            const values = schema.getValues(data);

            const insertQuery = `INSERT INTO ${tableName} (${columns}) VALUES (${placeholders})`;

            db.run(insertQuery, values, (err) => {
              if (err) {
                console.error(
                  `Error inserting into ${tableName}:`,
                  err.message,
                );
              }
            });

            if (type == "Comic") {
              data.chapters.forEach((chapter) => {
                db.run(
                  `INSERT INTO chapters (extension, manga_id, name, number, source, date) VALUES (?,?,?,?,?,?)`,
                  [
                    tableName,
                    data.id,
                    chapter.name,
                    chapter.index,
                    chapter.url,
                    chapter.date,
                  ],
                );
              });
            }
          }
        },
      );
    });
    res.status(200);
    res.send({ code: 200, msg: "sucessfully added" });
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

				//if manga put chapter_id (id in chapters table)
				chapter_id: 2641,
      }), 
    })).json()
*/
  const body = req.body;
  const media_id = body.media_id;
  const chapter_id = body.chapter_id;

  const table = await new Promise((resolve) => {
    db.get(
      `SELECT extension FROM main WHERE local_id = ? COLLATE NOCASE`,
      [media_id],
      (err, row) => {
        if (err) {
          console.error("Database error:", err);
          return resolve(null);
        }
        resolve(row?.extension || null);
      },
    );
  });

  if (!table) {
    console.error("no row");
    return res.sendStatus(404);
  }

  db.run(`UPDATE chapters SET downloaded = 1 WHERE id = ?`, [chapter_id]);

  res.json({ media: media_id, chapter: chapter_id, extension: table });
});

app.get("/view", async (req, res) => {
  const imageUrl =
    "https://v12.mkklcdnv6tempv4.com/img/tab_32/00/00/52/aa951409/chapter_1120/10-1720731306-o.jpg"; // Replace with your image URL
  const filePath = path.join(__dirname, "downloaded-image.jpg"); // Path to save the file locally

  try {
    const response = await fetch(
      "http://localhost:3000/imageProxy?url=" +
        imageUrl +
        "&referer=http://chapmanganato.to",
    );
    if (!response.ok) {
      throw new Error(`Failed to fetch image: ${response.statusText}`);
    }

    res.set("Content-Type", "image/jpg");
    fileSystem.writeFileSync(
      filePath,
      Buffer.from(await response.arrayBuffer()),
    );

    res.sendFile(filePath);
  } catch (error) {
    console.error("Error downloading or serving the image:", error.message);
    res.status(500).send("Failed to fetch and serve the image.");
  }
});

app.get("/imageProxy", async (req, res) => {
  if (!req.query.url) {
    res.sendStatus(400);
    return;
  }
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
  console.log(buffer);
  res.send(buffer);
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

app.get("/library", (req, res) => {
  res.json({
    categories: ["comics", "movies", "games", "ebooks", "audiobooks", "music"],
    balls: "bye",
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

const port = 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}\nhttp://localhost:${port}`);
});
