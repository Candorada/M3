import "./libraryItemPage.css"
import {useParams} from "react-router-dom"
import {useState, useEffect} from "react"
function ItemPage(){
    const {mediaID} = useParams();
    const [item,setItem] = useState({
        "id": "exampleID",
        "name": "Template Name",
        "source": "about:blank",
        "description":"Template",
        "cover": "src/extensionsUI/Error.jpg",
        "tags":JSON.stringify([
            "Action",
            "Adventure",
            "Comedy",
            "Drama",
            "Fantasy",
            "Harem",
            "Romance",
            "Shounen",
            "Manhua"
        ]),
        "contributors": JSON.stringify(["Mad Snail"]),
        "chapters": [{
            "id": 1,
            "extension": "TemplateExtension",
            "manga_id": "exampleID",
            "number": 1,
            "name": "Template Chapter",
            "source": "about:blank",
            "date": "1566691680000"
        }]
    });
    useEffect(()=>{
        fetch("http://localhost:3000/library/_/"+mediaID).then((res)=> res.json()).then((json)=>{
            setItem(json)
        })
    },[])
    return <>
        <div id = "libraryItemPage">
            <div className = "banner">
                    <img src={item.cover} alt=""/>
            </div>
            <div id = "about">
                <div className = "cover">
                    <img src={item.cover} alt="" />
                </div>
                <div className = "about">
                    <div id = "title">{item.name}</div>
                    <div id = "description">{item.description}</div>
                </div>
            </div>
        </div>
    </>
}
export default ItemPage