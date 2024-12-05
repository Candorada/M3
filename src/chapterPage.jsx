import { useEffect, useState, useContext} from "react";
import { useParams } from "react-router-dom";
import { RouterContext } from "./App";
import "./chapterPage.css"

function ChapterPage(){
    const router = useContext(RouterContext)
    const {mediaID,chapterID} = useParams();
    const [chapter,setChapter] = useState(chapterID)
    let [images,setImages] = useState([])
    let [comicData,setComicData] = useState({})
    let [chapterData,setChapterData] = useState({})
    let [chapters,setChapters] = useState([])
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
        }} />
    }
    function ChapterSelector({chapters, chapter}){
        return <div>
            <PrevChapterBTN />
            <select name="select" value = {chapter} className ="chapterSelector" onChange={(e)=>{
                router.navigate(`./../${e.target.value}`)
                setChapter(e.target.value)
            }}>
            {chapters.sort((a,b)=>b.number-a.number).map((chap)=><option key={chap.id} value = {chap.id}>{chap.name}</option>)}
            </select>
            <NextChapterBTN />
        </div>
    }
    useEffect(()=>{
        fetch(`http://localhost:3000/library/comics/${mediaID}/getchapter?chapterID=${chapter}`)
        .then((r)=>r.json())
        .then((r)=>setImages(r))
        fetch(`http://localhost:3000/library/comics/${mediaID}`)
        .then((r)=>r.json())
        .then((r)=>{
            setComicData(r)
            setChapters(r.chapters)
            r.chapters.forEach((chap)=>{
                if(chap.id == chapter){
                    setChapterData(chap)
                    if(chap.downloaded == -1){
                        fetch(`http://localhost:3000/downloadedImages/${mediaID}/${chap.id}`).then(async (imgs)=>{
                            let imgsJson = await imgs.json()
                            setImages(imgsJson)
                        })
                    }
                }
            })
        })
    },[chapter])
    return (<>
<div className="ScrollboxComicReader">
    <div className = "chapterTopBar">
    <div className = "titleText">{comicData.name}: {chapterData.name}</div>
    <ChapterSelector chapters = {chapters} chapter = {chapter}/>
    </div>
    <div className="images">
    {images.map((img,i)=><img className = "comicPage" key = {i} src = {`http://localhost:3000/imageProxy?url=${img}&referer=${comicData.source||""}`}></img>)}
    </div>
    <div className = "chapterTopBar">
    <ChapterSelector chapters = {chapters} chapter = {chapter}/>
    </div>
</div>
</>)
}

export default ChapterPage