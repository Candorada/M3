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
        setLibItems((await res.json()));
    }
    useEffect(()=>{catFetch()},[])
    useEffect(()=>{libFetch()},[])
    function LibItem({item, id}){
        return (<>
            <div className = "libraryItem" onClick={()=>{window.location.href = "library/"+item.id}}>
                <div className = "tokens">
                    <span className = "delete" onClick={()=>{
                        fetch('http://localhost:3000/delete', {
                            method: 'POST',
                                headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({
                                id: item.id,
                            }), 
                            }).then(()=>{
                                console.log("then")
                                libFetch()
                            })
                    }}>delete</span>
                    <span>{10}</span>
                </div>
                <img src = {item.cover} alt = {item.title}/>
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