import "./extensionpage.css"
import {useParams} from "react-router-dom"
import { useEffect, useState } from "react";
function extensionImagePathGetter(path,extension){
    return (path?(path.match(/^http/)?"":"../backend/extensions/"+extension+"/")+path:"../src/extensionsUI/Error.jpg")
}

function ExtensionPage(){
    var extensionObj;
    const {extension} = useParams(); // fetches the paramizer extension from reactDom
    async function addToLibrary(item){
        try{
            return await (await fetch(`http://localhost:3000/${extension}/addToLibrary`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                                url:item.url,
                    extension:extension}),
            })).json()
        }catch{
            return "";
        }
    
    }
    function SearchItem({item}){
    return (<>
    <div onClick = {async (event)=>{
        event.target.querySelector("img").style = "--visible:true;";
        addToLibrary(item).then(()=>{
            event.target.querySelector("img").style = "";
        })
        }} className = "searchItem"> {/* this element will be replaced with a clickable button*/}
        <img src={item.img} alt={item.url}/>
        <div className = "overlay">
            <img src="../src/assets/pencil.svg" alt="" />
        </div>
    </div>
    </>)
    }
    const [jsonData,setJSONData] = useState({
        properties:{
            iconPath:"../../../src/extensionsUI/Error.jpg",
            description:"Example Description",
            name:"Example",
            sourceUrl:"./", //url that extension is fetching from
            creator:"John Doe",
            creatorSocials:""
        }
    })
    useEffect(()=>{
        fetch(`http://localhost:3000`).then(async x=>{
            let data = await x.json()
            setJSONData(data[extension])
        })
    })
    const loop=(n,cb)=>[...Array(n)].map((_,i)=>i).map(cb) // goofy little line of code that allows inline forloops. loop(10,()=>1) will make an array of 10 ones
    const [searchResult,setSearchResult] = useState({
        "media": loop(100,()=>({
            "img": "../src/extensionsUI/Error.jpg",
            "name": "Searching",
            "url": "./"+extension
          })),
        "pageCount": -1
    })
    let [page,sPage] = useState(1)
    let [searchTerm,setSearchTerm] = useState("")
    async function search(keyword){
        console.log("searched")
        setSearchTerm(keyword)
        var queryString = (keyword?"q="+keyword:"")+(page?"&page="+page:"")
        var json = await ((await fetch("http://localhost:3000/"+extension+"/search"+(queryString?"?"+queryString:""))).json())
        if(await json){
            setSearchResult(await json)
        }
    }
    useEffect(()=>{
        (async()=>{
            search(searchTerm)
        })()
    },[page])
    function setPage(num){
        if(searchResult.pageCount > 0 && num <=searchResult.pageCount && num > 0){
            sPage(num)
        }else{
            if(num<=0){
                sPage(searchResult.pageCount)
                page = searchResult.pageCount
            }else{
                sPage(1)
                page = 1
            }
        }
    }
    return (<>
        <div id = "extensionPage">
            <div className = "top">
                <div className = "leftItem">
                    <img src={extensionImagePathGetter(jsonData.properties.iconPath,extension)} alt="IconImg" />
                    <div><a href={jsonData.properties.sourceUrl}>Extension Source</a></div>
                </div>
                <div className="rightItem">
                    <div>
                        <div className = "title">
                        {jsonData.properties.name}
                        </div>
                        <a className = "creator" href = {jsonData.properties.creatorSocials}>
                        By:{jsonData.properties.creator}
                        </a>
                    </div>
                    <div dangerouslySetInnerHTML={{__html:jsonData.properties.description}} id = "extensionDescription"></div>
                </div>
            </div>
            <div className="search">
                <input type="text" name="search" id="searchBar" placeholder="search"/>
                <input type="button" value="search" onClick={()=>{search(document.querySelector("#searchBar").value.replace(" ","_"))}}/>
                <div id = "searchResult">
                    {(()=>{
                        try{
                            return searchResult.media.map((item,i)=><SearchItem key = {i} item = {item}/>)
                        }catch{
                            return <div>No results</div>
                        }
                    })()}
                </div>
                <div>
                <input type="button" value = "<" onClick={()=>{setPage(page-1)}}/> 
                <span>{page}/{searchResult.pageCount}</span>
                <input type="button" value = ">" onClick={()=>{setPage(page+1)}}/>
                </div>
            </div>
        </div>
    </>)
}

export default ExtensionPage