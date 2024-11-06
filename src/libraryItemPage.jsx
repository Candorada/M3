import "./libraryItemPage.css"
import {useParams} from "react-router-dom"
function ItemPage(){
    const {mediaID} = useParams();
    return <>{mediaID}</>
}
export default ItemPage