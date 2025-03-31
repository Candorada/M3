const config = { extension: "", backendPORT: 3000, item: null };
const extension = {
  run: async (functionName, args = []) => {
    if (typeof args != "object") {
      args = [args];
    }
    return new Promise((res, rej) => {
      fetch(
        "http://localhost:" + config.backendPORT + "/runExtensionFunction",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            extension: config.extension,
            function: functionName,
            args: args,
          }),
        },
      )
        .then((x) => {
          res(x.json());
        })
        .catch((x) => {
          rej(x);
        });
    });
  },
  getStoredInfo: async (mediaID) => {
    try {
      let resp = fetch("http://localhost:3000/library/_/" + mediaID).then(
        (res) => res.json(),
      );
      resp.then((x) => {
        config.item = x;
      });
      return resp;
    } catch {
      return null;
    }
  },
  addToLibrary: async (sourceURL) => {
    return new Promise((resolve, reject) => {
      fetch(`http://localhost:3000/${config.extension}/addToLibrary`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          url: sourceURL,
          extension: config.extension,
        }),
      })
        .then((x) => resolve(x))
        .catch((x) => reject(x));
    });
  },
  reloadLibraryItem: async () => {
    return extension.addToLibrary(config.item.source);
  },
  getExtensions: async () => {
    return await fetch(
      `http://localhost:${config.backendPORT}/extensionList`,
    ).then((x) => x.json());
  },
  getPathsFromDownloadedMedia: async (chapterID) => {
    return (
      await fetch(
        `http://localhost:3000/downloadedImages/${config.item.id}/${chapterID}`,
      )
    ).json();
  },
};
export function init(item, backendPORT = 3000) {
  config.extension = item.extension;
  config.item = item;
  config.backendPORT = backendPORT;
}
export default extension;

