import { useEffect, useState, useContext} from "react";
import { useParams } from "react-router-dom";
import {RouterContext} from "./App";
import "./chapterPage.css"
function ChapterPage(){
    const router = useContext(RouterContext)
    const {mediaID,chapterID} = useParams();
    const [chapter,setChapter] = useState(chapterID)
    let [images,setImages] = useState([])
    let [comicData,setComicData] = useState({})
    let [chapterData,setChapterData] = useState({})
    let [chapters,setChapters] = useState([])
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
<div>
    <select name="select" value = {chapter} onChange={(e)=>{
        router.navigate(`./../${e.target.value}`)
        setChapter(e.target.value)
    }}>
    {chapters.sort((a,b)=>b.number-a.number).map((chap)=><option key={chap.id} value = {chap.id}>{chap.name}</option>)}
    </select>
</div>
    {images.map((img,i)=><img className = "comicPage" key = {i} src = {`http://localhost:3000/imageProxy?url=${img}&referer=${comicData.source||""}`}></img>)}
</div>
</>)
}

export default ChapterPage