import "./style.css";
let extensions = [
    {"name" : "SoundCloud"},
    {"name" : "GitHub"},
    {"name" : "youtube"}
]

function Extension({extension}){
    return(<>
    <div class = "extension">
        <label>
            {extension.name}
        </label>
    </div>
    </>)
        
}

function ExtensionsPage(){
    return(<>

    {extensions.map((ex) => (<Extension extension = {ex} />))}

    </>)
}

export default ExtensionsPage;