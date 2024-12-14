import { useEffect, useState, useContext} from "react";
import { useParams } from "react-router-dom";
import { RouterContext } from "./App";

import "./chapterPage.css"
function LoadingImg({img, comicData}){
let imgElm = <img src = {`http://localhost:3000/imageProxy?url=${img}&referer=${comicData.source||""}`} className = "comicPage"/>
return <div className="imageWrapper">{imgElm}</div>
}
function ChapterPageComic({mediaID,chapterID,item}){
    const router = useContext(RouterContext)
    const [chapter,setChapter] = useState(chapterID)
    let [images,setImages] = useState([])
    let comicData = item
    let chapterData= (item.chapters.find(x=>x.id == chapterID))
    let chapters = item.chapters
    function findChapterIndex(chapters,chapterNumber){
        let min = 0;
        let max = chapters.length-1;
        while(min<=max){
            let mid = Math.floor((min+max)/2);
            if(chapters[mid].number == chapterNumber){
                return mid;
            }else if(chapters[mid].number < chapterNumber){
                max = mid-1;
            }else{
                min = mid+1;
            }
        }
    }
    function NextChapterBTN(){
        let chapterindex = findChapterIndex(chapters,chapterData.number)
        let id = chapters[chapterindex-1]?.id
        if(chapterindex+1 > chapters.length || chapterindex-1 < 0){
            return <></>
        }
        return <input type="button" value="->" onClick={()=>{
                router.navigate(`./../${id}`)
                setChapter(id)
                document.querySelector(".ScrollboxComicReader").scrollTo(0,0)
        }}/>
    }
    function PrevChapterBTN(){
        let chapterindex = findChapterIndex(chapters,chapterData.number)
        let id = chapters[chapterindex+1]?.id
        if(chapterindex+1 >=chapters.length){
            return <></>
        }
        return <input type="button" value="<-" onClick={()=>{
                router.navigate(`./../${id}`)
                setChapter(id)
                document.querySelector(".ScrollboxComicReader").scrollTo(0,0)
        }} />
    }
    function ChapterSelector({chapters, chapter}){
        return <div>
            <PrevChapterBTN />
            <select name="select" value = {chapter} className ="chapterSelector" onChange={(e)=>{
                router.navigate(`./../${e.target.value}`)
                setChapter(e.target.value)
                document.querySelector(".ScrollboxComicReader").scrollTo(0,0)
            }}>
            {chapters.sort((a,b)=>b.number-a.number).map((chap)=><option key={chap.id} value = {chap.id}>{chap.name}</option>)}
            </select>
            <NextChapterBTN />
        </div>
    }
    function scrolled(e){
        let lastChild = e.target.querySelector("div:has(img):last-child")
        let bounding = lastChild.getBoundingClientRect()
        let pixelsBellowLastImage =  document.body.clientHeight - bounding.y - bounding.height 
        if(bounding.height > 0 && pixelsBellowLastImage >=0 && chapterData.read == 0){
            chapterData.read = 1
            fetch("http://localhost:3000/read",{
                method:"POST",
                headers:{
                    "content-type":"application/json"
                },
                body:JSON.stringify({
                    status:1,
                    chapter_id:chapterData.id
                })
            })
        }
    }
    useEffect(()=>{
        fetch(`http://localhost:3000/library/comics/${mediaID}/getchapter?chapterID=${chapter}`)
        .then((r)=>r.json())
        .then((r)=>setImages(r))
        fetch(`http://localhost:3000/downloadedImages/${mediaID}/${item.id}`)
        .then(async (imgs)=>{
            let imgsJson = await imgs.json()
            setImages(imgsJson)
        })
    },[chapter])
    return (<>
<div className="ScrollboxComicReader" onScroll={scrolled}>
    <div className = "chapterTopBar">
    <div className = "titleText">{comicData.name}: {chapterData.name}</div>
    <ChapterSelector chapters = {chapters} chapter = {chapter}/>
    </div>
    <div className="images">
    {images.map((img,i)=><LoadingImg img = {img} comicData = {comicData} key = {i}/>)}
    </div>
    <div className = "chapterTopBar">
    <ChapterSelector chapters = {chapters} chapter = {chapter}/>
    </div>
</div>
</>)
}
function ChapterPage(){
    const {mediaID,chapterID} = useParams();
    const defaultItem = {
        id: "exampleID",
        name: "Template Name",
        source: "about:blank",
        about: "Template",
        cover: "src/extensionsUI/Error.jpg",
        extension:"TemplateExtension",
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
      }
      const [item, setItem] = useState(defaultItem)
      useEffect(() => {
        fetch("http://localhost:3000/library/_/" + mediaID)
          .then((res) => res.json())
          .then((json) => {
            setItem(json);
          });
      }, []);
      const [customPage, setCustomPage] = useState(undefined)
      
      let [extensions,setExtensions] = useState([])
      useEffect(()=>{
        fetch("http://localhost:3000/extensionList").then(x=>x.json()).then(x=>{
          setExtensions(x)
      })
      },[])
      useEffect(()=>{
        try{
          if(item.extension && extensions?.[item.extension]?.properties?.customReaderPage){
            let pagePath = extensions?.[item.extension]?.properties?.customReaderPage
            pagePath = pagePath.toLowerCase().endsWith(".jsx")?pagePath.substring(0,pagePath.length-4):pagePath
            import(`../backend/extensions/${item.extension}/${pagePath}.jsx`)
            .then(async x=>{
              setCustomPage(<x.default mediaID = {mediaID} chapterID = {chapterID} item = {item}/>)
            })
          }
        }catch{}
      },[item,extensions])
    useEffect(()=>{
      fetch("http://localhost:3000/extensionList").then(x=>x.json()).then(x=>{
        setExtensions(x)
    })
    },[])
    return extensions?.[item.extension]?.properties?.customReaderPage?customPage: extensions && item.cover!=defaultItem.cover?<ChapterPageComic mediaID = {mediaID} chapterID = {chapterID} item = {item} />:<></>
}
export default ChapterPage