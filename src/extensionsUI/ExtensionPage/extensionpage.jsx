import "./extensionpage.css"
import {useParams} from "react-router-dom"
import { useEffect, useState } from "react";
function extensionImagePathGetter(path,extension){
    return (path?(path.match(/^http/)?"":"../backend/extensions/"+extension+"/")+path:"../src/extensionsUI/Error.jpg")
}

function ExtensionPage(){
    var extensionObj;
    const {extension} = useParams(); // fetches the paramizer extension from reactDom
    function addToLibrary(item){
        fetch("http://localhost:3000/addToLibrary",{
            method:"POST",
            url:item.url,
            extension:extension
        })
    
    }
    function SearchItem({item}){
    return (<>
    <div onClick = {()=>{addToLibrary(item)}}> {/* this element will be replaced with a clickable button*/}
        <img src={item.img} alt={item.url}/>
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
    const loop=(n,cb)=>[...Array(n)].map((_,i)=>i).map(cb) // goofy little line of code that allows inline forloops. loop(10,()=>1) will make an array of 10 ones
    const [searchResult,setSearchResult] = useState({
        "media": loop(100,()=>({
            "img": "../src/extensionsUI/Error.jpg",
            "name": "Searching",
            "url": "./"+extension
          })),
        "pageCount": 1
    })
    async function search(keyword){
        var queryString = (keyword?"q="+keyword:"")
        var json = await ((await fetch("http://localhost:3000/"+extension+"/search"+(queryString?"?"+queryString:""))).json())
        if(await json){
            setSearchResult(await json)
        }
    }
    useEffect(()=>{
        (async()=>{
            var json = await ((await fetch("http://localhost:3000/extensionList")).json())
            if(await json[extension]){
                extensionObj = await json[extension]
                setJSONData(await json[extension])
                fetch(`http://localhost:3000/${extension}/search`)
            }
            search()
        })()
    },[])
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
                {searchResult.media.map((item,i)=><SearchItem key = {i} item = {item}/>)}
                </div>
            </div>
        </div>
    </>)
}

export default ExtensionPage