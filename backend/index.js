let express = require('express');
const app = express();
const fileSystem = require("fs");
app.get('/',(req,res)=>{
    res.send({"test":"valu"});
})

app.get('/extensionList',(req,res)=>{
    res.send(fileSystem.readdirSync("./extensions"));
    

})
const port = 3000
app.listen(port,()=>{
    console.log(`Server is running on port ${port}\nhttp://localhost:${port}`);
})