import "./libraryItemPage.css";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import NoiseBlur from "./filters/noiseblur";
function DownloadButton({chapter}){
  let del = (e) => {
    e.stopPropagation();
    fetch("http://localhost:3000/deleteChapter",{
      method:"POST",
      headers:{
          "content-type":"application/json"
      },
      body:JSON.stringify({
          media_id:chapter.manga_id,
          chapter_id:chapter.id
      })
  }).then(r=>{
    if(r.ok){
      setBTN(downBTN)
    }
  })
  }
  let delBTN = <input type="button" value="delete" onClick={del}/>
  let loading = <><div className = "loading" onClick={del}>0/0</div></>
  let downBTN = <input type="button" value="download" onClick={(e) => {
    e.stopPropagation();
    setBTN(loading)
    let interval2 = setInterval(async ()=>{
      let BTN = document.querySelector(`[chapter_id="${chapter.id}"] >.downloadBTN .loading`)
      let downlods = await fetch("http://localhost:3000/downloadingMedia",{cache:"no-cache"}).then((res) => res.json())
        if(BTN){
         let status = downlods[chapter.id]?.progress
         let totalImages = downlods[chapter.id]?.totalImages
         if(status!=undefined && +BTN.innerHTML.split("/")[0] < status){
           BTN.innerHTML = status+"/"+totalImages
         }
         if(status >=totalImages){
          setBTN(delBTN)
          clearInterval(interval2)
         }
        }
    },1)
    fetch("http://localhost:3000/download", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        media_id: chapter.manga_id,
        referer: chapter.source,
        chapter_id: chapter.id,
        extension: chapter.extension
      }),
    }).then((r)=>{
      if(!r.ok){
        setBTN(downBTN)
      }
    })
  }}/>
  let starterBTN = chapter.downloaded == -1 ? delBTN:chapter.downloaded==0?downBTN:loading
  let [btn,setBTN] = useState(starterBTN)
  return <div className="downloadBTN">{btn}</div>
}
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
        id: -1,
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
    <NoiseBlur />
      <div id="libraryItemPage">
        <div className="banner">
          <img
            src={coverPath}
            alt=""
            onLoad={(x) => {
              if (x.target.naturalWidth < window.innerWidth) {
                x.target.style = "filter: url(#noiseBlur);";
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