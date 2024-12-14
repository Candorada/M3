import extension, {init} from "../../frontEndApi.js"
function File({ mediaID,  chapterID, item}) { //cannot be async
    init(item) //just add your extension folder name her
    //extension.run("search") // use hooks to make work
    //extension.getStoredInfo(item.id) //but this is basically just item but the most updated possible version
    //extension.addToLibrary(item.url) //but this is basically just item
    //extension.reloadLibraryItem() //this is the same as extension.addToLibrary(item.url) but doesnt require an input
    //extension.getExtensions() // get extensions
    extension.getPathsFromDownloadedMedia(chapterID).then(x=>console.log(x)) // get paths from downloaded media
    return <>hello world2</>
}
export default File