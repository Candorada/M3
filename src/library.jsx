import { useState, useEffect } from "react";
import "./library.css";
//let categories = ["manga","comics","movies","games","ebooks","audiobooks"]
function Library() {
    const [categories, setCat] = useState(["Default"]);
    const [libItems,setLibItems] = useState([])
    const catFetch = async () => {
        let res = await fetch("http://localhost:3000/library");
        setCat((await res.json()).categories);
    }
    const libFetch = async (category) => {
        let res = await fetch("http://localhost:3000/library/"+category);
        let json = await res.json()
        setLibItems(json);
    }
    useEffect(()=>{catFetch()},[])
    useEffect(()=>{libFetch()},[])
    function LibItem({item}){
        console.log(item)
        let url = `../backend/downloadedMedia/${item.id}/cover.jpg`
        let [coverArt,setCoverArt] = useState(url);
            new Promise((res,rej)=>{
                fetch(url).then((r)=>{
                    let resed = false
                    r.headers.forEach((v,h)=>{
                        if(h=="content-type"){
                            res(v)
                            resed = true
                            return;
                        }
                    })
                    if(!resed){res(false)}
                })
            }).then((r)=>{
                if(r != "image/jpeg"){
                    setCoverArt(`http://localhost:3000/imageProxy?url=${item.cover}&referer=${""}`)
                }
            })
        return (<>
            <div className = "libraryItem" onClick={()=>{window.location.href = "library/"+item.id}}>
                <div className = "tokens">
                    <span className = "delete" onClick={(event)=>{
                        event.stopPropagation();
                        fetch('http://localhost:3000/delete', {
                            method: 'POST',
                                headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({
                                id: item.id,
                                extension:item.extension
                            }), 
                        }).then((r)=>{
                            libFetch()
                        })
                    }}>delete</span>
                    <span>{10}</span>
                </div>
                <img src = {coverArt} alt = {item.title}/>
            </div>
        </>)
    }
    return (<>
        <div id="library">
                <div id = "topbar">
                    <div>
                        {categories.map((category)=><button key = {category} className = "category">{category}</button>)}
                        <button id = "addCategory" key = "addCategory">+</button>
                    </div>
                </div>
                <div key  = "another">
                <div id = "libraryItemHolder">
                {libItems.map((item,i)=><LibItem key = {i} item={item} id = {i}/>)}
                </div>
                </div>
        </div>
    </>)
}



export default Library;