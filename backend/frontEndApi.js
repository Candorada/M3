const config = {extension:"",backendPORT:3000}
const extension = {
    run: async (functionName,args=[])=>{
        if(typeof args != "object"){
            args = [args]
        }
        return new Promise((res,rej)=>{
            fetch("http://localhost:"+config.backendPORT+"/runExtensionFunction",{
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    extension: config.extension,
                    function: functionName,
                    args: args
                })
            }).then(x=>{res(x.json())})
            .catch(x=>{rej(x)})
        })
    },
    getStoredInfo:async (mediaID)=>{
        try{
        return await fetch("http://localhost:3000/library/_/" + mediaID).then((res) => res.json())
        }catch{
            return null
        }
    }
}
export function init(name, backendPORT = 3000){
    config.extension = name
    config.backendPORT = backendPORT
}
export default extension