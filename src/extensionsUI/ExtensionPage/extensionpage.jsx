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
            sourceUrl:"./",
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
        <div id = "extensionPage" htmlFor ="fileInput">
            <div className = "leftItem">
                <img src={extensionImagePathGetter(jsonData.properties.iconPath,extension)} alt="IconImg" />
                <div><a href={jsonData.properties.sourceUrl}>Extension Source</a></div>
            </div>
            <div className="rightItem">
                <h3>{jsonData.properties.name}</h3>
                {jsonData.properties.description}
            </div>
        </div>
    </>)
}

export default ExtensionPage