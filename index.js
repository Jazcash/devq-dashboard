const express = require("express");
const app = express();
const http = require("http").Server(app);
const io = require("socket.io")(http);
const _ = require("underscore");
const Donedone = require("donedone.js");
const config = require("./config");

let donedone = new Donedone({
    subdomain: config.subdomain,
    username: config.username,
    apikey: config.apikey
});

let filter = donedone.getGlobalFiltersSync().find((filter) => filter.name === config.filter);
let issues = donedone.getIssuesByFilterSync(filter.id).issues;

function fetchIssues(){
    issues = donedone.getIssuesByFilterSync(filter.id).issues;
    io.emit("issues", issues);
}

fetchIssues();
setInterval(fetchIssues, 10000);

app.use(express.static('public'));

app.get("/", function(req, res){
    res.sendFile(__dirname + "/index.html");
});

io.on("connection", function(socket){
    console.log("A client connected");

    socket.emit("issues", issues);
    
    socket.on("disconnect", function(){
        console.log("A client disconnected");
    });
});

http.listen(3002, function(){
    console.log("listening on *:3002");
});