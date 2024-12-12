import "./libraryItemPage.css";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import React, { useState, useEffect, useRef, act } from "react";
import NoiseBlur from "./filters/noiseblur";
const  DownloadButton = React.forwardRef(({chapter},ref) =>{
  let [progress, setProgress] =useState(undefined)
  let [total, setTotal] = useState(undefined)
  let [queued, setQueued] = useState(true)
  React.useImperativeHandle(ref, () => ({
    update: (progress,total,queued) => {
      setProgress(progress)
      setTotal(total)
      setQueued(queued)
      if(progress >= total && total > 0){
        setBTN(delBTN)
      }
    },
  }));
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
  function Loading({progress, total,queued =true}){
    let ttl = total?total:0
    let prog = ttl?progress/ttl:0
    return <div className = "loading" onClick={del}>
      <div className = "variableSize" style = {{"--var":prog*100+"%"}}></div>
      <div>{queued?"queued":`${progress}/${ttl}`}</div>
      </div>
  }
  let downBTN = <input type="button" value="download" onClick={(e) => {
    e.stopPropagation();
    setBTN(<Loading progress = {0} />)
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
  let starterBTN = chapter.downloaded == -1 ? delBTN:chapter.downloaded==0?downBTN:<Loading progress = "0" />
  if(progress !=undefined){
    starterBTN = <Loading progress = {progress} />
  }//fix this!!!!!!!
  let [btn,setBTN] = useState(starterBTN)
  return <div className="downloadBTN">{progress!=undefined && (progress <total || progress == 0) ?<Loading progress = {progress} total = {total} queued = {queued}/>:btn}</div>
})
function MutliChapters({chapters}){
  return <>
  <div className="mutliChapters">
    <div className="content">
      <select name="" id="" multiple>
        {chapters.map(x=>{
          return <option key = {x.id} value={x.id}>{x.name}</option>
        })}
      </select>
      <div className = "ChapterControlButtons">
      <input type="button" value="Download Selected" className = "multiDownBTN"/>
      <input type="button" value="Delete Selected" className = "multiDelBTN"/>
      <input type="button" value="Mark Selected As Read" className = "multiReadBTN"/>
      <input type="button" value="Mark Selected As Unread" className = "multiUnreadBTN"/>
      </div>
    </div>
    <input type="checkbox" name="" id="Settings"  style={{display:"none"}} />
    <label htmlFor="Settings" >Settings</label>
  </div>
  </>
}
function ItemPage() {
  let activeDownloads = {}
  const childRefs = useRef({});
  useEffect(()=>{
    let interval = setInterval(() => {
      let activeDownloadStringified = JSON.stringify(activeDownloads)
      fetch("http://localhost:3000/downloadingMedia",{cache:"no-cache"}).then((res) => res.json()).then((json)=>{
        if(JSON.stringify(json) != activeDownloadStringified){
          activeDownloads = json
          Object.keys(json).forEach(key=>{
            let total = json[key].totalImages
            let progress = json[key].progress
            childRefs.current[key].update(progress,total,json[key].queued)
          })
          activeDownloadStringified = JSON.stringify(activeDownloads)
        }
      })
    }, 30);
    return () => clearInterval(interval) //very smart :)
  },[])
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
        <MutliChapters chapters = {item.chapters}/>
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
                className={"chapter"+(chapter.read?" read":"")}
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
                <DownloadButton chapter = {chapter} ref={(el) => {
            // Store the ref for each child in the `childRefs` object
            if (el) childRefs.current[chapter.id] = el;
          }}/>
              </div>
            ))}
        </div>
      </div>
    </>
  );
}
export default ItemPage;