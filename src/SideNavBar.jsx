import "./sideNav.css"
import booksIcon from "./assets/books.png"
import extensionsIcon from "./assets/extensionsIcon.png"
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
            <SideNavItem linkTo = "library" img = {booksIcon}/>
            <SideNavItem linkTo = "extensions" img = {extensionsIcon}/>
        </div>
    </>
    )
}
export default SideNav;