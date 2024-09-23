import "./library.css";
let categories = ["manga","comics","movies","games","ebooks","audiobooks"]
function Library() {
    return (<>
        <div id="library">
            <div id = "topbar">
            {categories.map((category)=><button key = {category} className = "category">{category}</button>)}
            <button id = "addCategory">+</button>
            </div>
        </div>
    </>)
}



export default Library;