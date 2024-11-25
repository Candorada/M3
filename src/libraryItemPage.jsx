import "./libraryItemPage.css"
import {useParams} from "react-router-dom"
import { useNavigate } from 'react-router-dom';
import {useState, useEffect} from "react"
function ItemPage(){
    const navigate = useNavigate()
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
    let description = item.about
    let coverPath =  `../backend/downloadedMedia/${item.id}/cover.jpg`
    //item.cover is the url of the cover source
    .replaceAll(
        /(https?:\/\/(?:www\.)?([-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b)*(\/[\/\d\w\.-]*)*(?:[\?])*([^ <>\(\))]+)*)(?<!\))/g,
        `<a href = "$1"><img src = "https://www.google.com/s2/favicons?domain=$2" /></a>`
    )
    return <>
        <div id = "libraryItemPage">
            <div className = "banner">
                    <img src={coverPath} alt="" onLoad={(x)=>{
                        if(x.target.naturalWidth < window.innerWidth){
                            x.target.style = "filter: blur(3px);"

                        }
                    }}/>
            </div>
            <div id = "about">
                <div className = "cover">
                    <img src={coverPath} alt="" />
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
                    <div id = "description" dangerouslySetInnerHTML={{__html: description}}></div>
                </div>
            </div>
            <div className="chapterList">
                <div className ="chapterListHeader chapter">
                    <div className = "name">Chapter Name</div>
                    <div className = "number">#</div>
                    <div className="">Date</div>
                </div>
                {item.chapters.sort((a,b)=>b.number - a.number).map((chapter,i)=>(
                            <div className = "chapter" key = {i} onClick={()=>{
                                navigate("./"+chapter.id)
                            }}>
                                <div className = "name">{chapter.name}</div>
                                <div className="">{(new Date(+chapter.date)).toLocaleDateString().replace(/(\d+\/\d+\/)20(\d+)/,"$1$2").replace(/(?<!\d)(\d)(?!\d)/g,"0$1")}</div>
                                <div className = "downloadBTN"><input type="button" value="download" onClick={(e)=>{
                                    e.stopPropagation()
                                    console.log(item,chapter)
                                    fetch('http://localhost:3000/download', {
                                        method: 'POST',
                                        headers: {'content-type': 'application/json'},
                                        body: JSON.stringify({
                                          media_id: chapter.manga_id,
                                            referer: chapter.source,
                                            chapter_id: 1329,
                                        }), 
                                      }).then((response)=>{
                                        console.log(response)
                                      })
                                }}/></div>
                            </div>
                        )
                )}
            </div>
        </div>
    </>
}
export default ItemPage