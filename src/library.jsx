import { useState, useEffect } from "react";
import "./library.css";
//let categories = ["manga","comics","movies","games","ebooks","audiobooks"]
function Library() {
    const [categories, setCat] = useState(["Default"]);
    const catFetch = async () => {
        let res = await fetch("http://localhost:3000/library");
        console.log(res)
        setCat((await res.json()).categories);
    }
      
    useEffect(()=>{catFetch()},[])
   

    return (<>
        <div id="library">
            <div id = "topbar">
            {categories.map((category)=><button key = {category} className = "category">{category}</button>)}
            <button id = "addCategory">+</button>
            </div>
        </div>
    </>)
}



export default Library;