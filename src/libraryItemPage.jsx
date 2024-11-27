import "./libraryItemPage.css";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
function DownloadButton({chapter}){
  let delBTN = <>Delete</>
  let loading = <>Loading...</>
  let downBTN = <input type="button" value="download" onClick={(e) => {
    e.stopPropagation();
    setBTN(loading)
    fetch("http://localhost:3000/download", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        media_id: chapter.manga_id,
        referer: chapter.source,
        chapter_id: chapter.id,
      }),
    }).then((r)=>{
      setBTN(delBTN)
    })
  }}/>
  let starterBTN = chapter.downloaded == -1 ? delBTN:downBTN
  let [btn,setBTN] = useState(starterBTN)
  return <div className="downloadBTN">{btn}{(chapter.downloaded)}</div>
}
/*
{(()=>{}
  let value = (chapter.downloaded != -1)?(<input type="button" value="download" onClick={(e) => {
    let elm = e.target.parentElement
    e.stopPropagation();
    elm.innerHTML = "Downloading..."
    fetch("http://localhost:3000/download", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        media_id: chapter.manga_id,
        referer: chapter.source,
        chapter_id: chapter.id,
      }),
    }).then((r)=>{
      elm.innerHTML = "Yeee"
    })
  }}
/>):(<>Yeee</>)
  return value
})()}
*/
function ItemPage() {
  const navigate = useNavigate();
  const { mediaID } = useParams();
  const [item, setItem] = useState({
    id: "exampleID",
    name: "Template Name",
    source: "about:blank",
    about: "Template",
    cover: "src/extensionsUI/Error.jpg",
    tags: JSON.stringify([
      "Action",
      "Adventure",
      "Comedy",
      "Drama",
      "Fantasy",
      "Harem",
      "Romance",
      "Shounen",
      "Manhua",
    ]),
    contributors: JSON.stringify(["Template Person"]),
    chapters: [
      {
        id: 1,
        extension: "TemplateExtension",
        manga_id: "exampleID",
        number: 1,
        name: "Template Chapter",
        source: "about:blank",
        date: "1566691680000",
        downloaded:0,
        read: 0,
      },
    ],
  });
  useEffect(() => {
    fetch("http://localhost:3000/library/_/" + mediaID)
      .then((res) => res.json())
      .then((json) => {
        setItem(json);
      });
  }, []);
  let coverPath = `../backend/downloadedMedia/${mediaID}/cover.jpg`;
  let description = item.about
    //item.cover is the url of the cover source
    .replaceAll(
      /(https?:\/\/(?:www\.)?([-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b)*(\/[\/\d\w\.-]*)*(?:[\?])*([^ <>\(\))]+)*)(?<!\))/g,
      `<a href = "$1"><img src = "https://www.google.com/s2/favicons?domain=$2" /></a>`,
    );
  return (
    <>
      <div id="libraryItemPage">
        <div className="banner">
          <img
            src={coverPath}
            alt=""
            onLoad={(x) => {
              if (x.target.naturalWidth < window.innerWidth) {
                x.target.style = "filter: blur(3px);";
              }
            }}
          />
        </div>
        <div id="about">
          <div className="cover">
            <img src={coverPath} alt="" />
            Contributors
            <div className="tks">
              {JSON.parse(item.contributors).map((name, i) => (
                <div className="tk" key={i}>
                  {name}
                </div>
              ))}
            </div>
            Tags
            <div className="tks">
              {JSON.parse(item.tags).map((name, i) => (
                <div className="tk" key={i}>
                  {name}
                </div>
              ))}
            </div>
          </div>
          <div className="about">
            <div id="title">{item.name}</div>
            <div
              id="description"
              dangerouslySetInnerHTML={{ __html: description }}
            ></div>
          </div>
        </div>
        <div className="chapterList">
          <div className="chapterListHeader chapter">
            <div className="name">Chapter Name</div>
            <div className="number">Date</div>
            <div className="">installed</div>
          </div>
          {item.chapters
            .sort((a, b) => b.number - a.number)
            .map((chapter, i) => (
              <div
                className="chapter"
                key={chapter.id}
                onClick={() => {
                  navigate("./" + chapter.id);
                }}
                chapter_id={chapter.id}
                chapter_num = {chapter.number}
              >
                <div className="name">{chapter.name}</div>
                <div className="">
                  {new Date(+chapter.date)
                    .toLocaleDateString()
                    .replace(/(\d+\/\d+\/)20(\d+)/, "$1$2")
                    .replace(/(?<!\d)(\d)(?!\d)/g, "0$1")}
                </div>
                <DownloadButton chapter = {chapter}/>
              </div>
            ))}
        </div>
      </div>
    </>
  );
}
export default ItemPage;