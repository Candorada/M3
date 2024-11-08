import "./libraryItemPage.css"
import {useParams} from "react-router-dom"
import {useState, useEffect} from "react"
function ItemPage(){
    const {mediaID} = useParams();
    const [item,setItem] = useState({
        "id": "exampleID",
        "name": "Template Name",
        "source": "about:blank",
        "about": "Template",
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
        "contributors": JSON.stringify(["Template Person"]),
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
                    <img src={item.cover} alt="" onLoad={(x)=>{
                        if(x.target.naturalWidth < window.innerWidth){
                            x.target.style = "filter: blur(3px);"

                        }
                    }}/>
            </div>
            <div id = "about">
                <div className = "cover">
                    <img src={item.cover} alt="" />
                    Contributors
                    <div className = "tks">{JSON.parse(item.contributors).map((name,i)=>(
                        <div className = "tk" key = {i}>{name}</div>
                    ))}</div>
                    Tags
                    <div className = "tks">{JSON.parse(item.tags).map((name,i)=>(
                        <div className = "tk" key = {i}>{name}</div>
                    ))}</div>
                </div>
                <div className = "about">
                    <div id = "title">{item.name}</div>
                    <div id = "description" dangerouslySetInnerHTML={{__html: item.about}}></div>
                </div>
            </div>
            <div className="chapterList">
                <div className ="chapterListHeader chapter">
                    <div className = "name">Chapter Name</div>
                    <div className = "number">#</div>
                    <div className="">Date</div>
                </div>
                {item.chapters.sort((a,b)=>b.number - a.number).map((chapter,i)=>(
                            
                            <div className = "chapter" key = {i}>
                                <div className = "name">{chapter.name}</div>
                                <div className = "number">{chapter.number}</div>
                                <div className="">{(new Date(+chapter.date)).toLocaleDateString().replace(/(\d\d\/\d\d\/)20(\d\d)/,"$1$2")}</div>
                            </div>
                        )
                )}
            </div>
        </div>
    </>
}
export default ItemPage