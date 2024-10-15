import "./sideNav.css"
import booksIcon from "./assets/books.png"
import extensionsIcon from "./assets/extensionsIcon.png"
import { Router, Link } from "react-router-dom";
function SideNav({selected}) {
    function SideNavItem({linkTo, img}){
        return (<>
            <a href = {`/${linkTo}`} className = {(linkTo === selected ||linkTo=="library"&&selected=="" ? "selected " : "") + "sideNavItem"}> 
            <div style={{maskImage: `url(${img})`}}></div>
            </a>
        </>)
    }
    return (
    <>
        <div id="sideNav">
            <Router>
                <SideNavItem linkTo = "library" img = {booksIcon}/>
                <SideNavItem linkTo = "extensions" img = {extensionsIcon}/>
            </Router>

        </div>
    </>
    )
}
export default SideNav;