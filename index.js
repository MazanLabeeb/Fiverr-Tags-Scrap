const express = require("express");
const app = new express();
const path = require("path");
const {scrap} = require('./scrap');

app.use(express.urlencoded({extended:true}));
app.use(express.static(path.join(__dirname, "/public")));

app.post('/scrap',(req, res)=>{
    console.log(req.get('user-agent'));
    scrap(req.body.url).then((result)=>{
        res.download(path.join(__dirname, result));

    }).catch(error=>res.send(error));
    
})

app.listen(8080, ()=>console.log("http://localhost:"+8080));