import "./sideNav.css"
import books from "./assets/books.png"
function SideNav() {
    return (
    <>
        <div id="sideNav">
            <a href="">
                <img src= {books} alt="Books"/>
            </a>
        </div>
    </>
    )
}
export default SideNav;