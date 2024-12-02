# React + Vite Cause why not ...

# And Express as well

# with some SQL

### <ins>Running the Website</ins>

**Backend**

Enter in the terminal (backend directory):

_try:_

    npm run dev

_else try_:

    npm i

    npm run dev

_else:_

Delete **node_modules**

    npm i

    npm run dev

**Frontend**

Enter in the terminal (M3 directory):

_try:_

    npm run dev

_else try_:

    npm i

    npm run dev

_else:_

Delete **node_modules**

    npm i

    npm run dev

\*To kill a server without killing the whole terminal press _ctrl + c_

## <ins>Creating extensions</ins>

### **general template:**

```js
const properties = {
  name: "__name__",
  type: "__type__",
  sourceUrl: "__url__",
  iconPath: "__icon.png__",
  description: "__html description__",
  creator: "__GitHub name__",
  creatorSocials: "__GitHub url__",
};

function search(search) {}

function getInfo(url) {}

function getChapterData(url) {}

module.exports = {
  search: search,
  getInfo: getInfo,
  properties: properties,
};
```
