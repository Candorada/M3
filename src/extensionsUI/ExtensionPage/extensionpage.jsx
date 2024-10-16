import "./extensionpage.css"
import {useParams} from "react-router-dom"
import { useEffect, useState } from "react";
function extensionImagePathGetter(path,extension){
    return (path?(path.match(/^http/)?"":"../backend/extensions/"+extension+"/")+path:"../src/extensionsUI/Error.jpg")
}
function ExtensionPage(){
    const {extension} = useParams(); // fetches the paramizer extension from reactDom
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
        (async()=>{
            var json = await ((await fetch("http://localhost:3000/extensionList")).json())
            if(await json[extension]){
                setJSONData(await json[extension])
            }
        })()
    })
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
                <input type="text" name="search" id="searchBar" placeholder="search" />
                <input type="button" value="search"/>
            </div>
        </div>
    </>)
}

export default ExtensionPage