import extension, {init} from "../../frontEndApi.js"
function File({item}) { //cannot be async
    init(item) //just add your extension folder name her
    console.log(item)
    //console.log(extension.run("search")) // use hooks to make work
    //console.log(extension.getStoredInfo(item.id)) //but this is basically just item but the most updated possible version
    //extension.addToLibrary(item.url) //but this is basically just item
    //extension.reloadLibraryItem() //this is the same as extension.addToLibrary(item.url) but doesnt require an input
    
    return <>hello world</>
}
export default File