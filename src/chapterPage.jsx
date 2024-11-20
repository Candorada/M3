import { useEffect, useState } from "react";
import { useParams } from "react-router-dom"
function ChapterPage(){
    const {mediaID,chapterID} = useParams();
    let [images,setImages] = useState([])
    useEffect(()=>{
        fetch(`http://localhost:3000/library/comics/${mediaID}/getchapter?chapterID=${chapterID}`)
        .then((r)=>r.json())
        .then((r)=>setImages(r))
    },[])
    return <div>{images.map((img)=><img src = {img}></img>)}</div>
}
export default ChapterPage