import { useState, useEffect } from "react";
import "./library.css";
//let categories = ["manga","comics","movies","games","ebooks","audiobooks"]
function LibItem({img,title,remainingContent}){
    return (<>
        <div class = "libraryItem">
            <div class = "tokens">
                <span>{remainingContent}</span>
                <span>{remainingContent}</span>
            </div>
            <img src = {img} alt = {title}/>
        </div>
    </>)
}
function Library() {
    const [categories, setCat] = useState(["Default"]);
    const catFetch = async () => {
        let res = await fetch("http://localhost:3000/library");
        console.log(res)
        setCat((await res.json()).categories);
    }
      
    useEffect(()=>{catFetch()},[])
   
    var adress = "https://m.media-amazon.com/images/I/8125YqX-awL._AC_UF894,1000_QL80_.jpg"
    return (<>
        <table id="library">
            <tr>
                <div id = "topbar">
                {categories.map((category)=><button key = {category} className = "category">{category}</button>)}
                <button id = "addCategory">+</button>
                </div>
            </tr>
            <tr id = "libraryItemHolder">
                <LibItem img = {adress} remainingContent={10}/>
                <LibItem img = {adress} remainingContent={10}/>
                <LibItem img = {adress} remainingContent={10}/>
                <LibItem img = {adress} remainingContent={10}/>
                <LibItem img = {adress} remainingContent={10}/>
                <LibItem img = {adress} remainingContent={10}/>
                <LibItem img = {adress} remainingContent={10}/>
                <LibItem img = {adress} remainingContent={10}/>
            </tr>
        </table>
    </>)
}



export default Library;