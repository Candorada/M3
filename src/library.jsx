import { useState, useEffect } from "react";
import "./library.css";
//let categories = ["manga","comics","movies","games","ebooks","audiobooks"]
function LibItem({img,title,remainingContent}){
    return (<>
        <div className = "libraryItem">
            <div className = "tokens">
                <span>{remainingContent}</span>
                <span>{remainingContent}</span>
            </div>
            <img src = {img} alt = {title}/>
        </div>
    </>)
}
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
    var adress = "https://m.media-amazon.com/images/I/8125YqX-awL._AC_UF894,1000_QL80_.jpg"
    var libraryItems = new Array(10);

    for(let i=0;i<libraryItems.length;i++){
        libraryItems[i] = <LibItem img = {adress} remainingContent={10} key = {i}/>
    }
    return (<>
        <div id="library">
                <div id = "topbar">
                    <div>
                        {categories.map((category)=><button key = {category} className = "category">{category}</button>)}
                        <button id = "addCategory" key = "addCategory">+</button>
                    </div>
                </div>
                <div>
                    <div id = "libraryItemHolder">
                        {libItems.map((item)=>(<>
                            <LibItem img = {item.cover} remainingContent={10} key = {item.id}/>
                        </>))}
                    </div>
                </div>
        </div>
    </>)
}



export default Library;