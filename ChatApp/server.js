const express = require("express");
var app = express()

app.use(express.static(__dirname));

var messages = [
    {name:"John",message:"Hello"},
    {name:"Jane",message:"Hi"},
]



app.get("/messages",(req,res)=>{
    res.send(messages); 

})

app.listen(3010,() => {
    console.log("Server has started. 3010");
});