const app = require("express")();
const http = require("http").Server(app);
const io = require("socket.io")(http);
const Donedone = require("donedone.js");
const config = require("./config");

let donedone = new Donedone({
    subdomain: config.subdomain,
    username: config.username,
    apikey: config.apikey
});

let filter = donedone.getGlobalFiltersSync().find((filter) => filter.name === config.filter);
let issues = donedone.getIssuesByFilterSync(filter.id).issues;

setInterval(function(){
    issues = donedone.getIssuesByFilterSync(filter.id).issues;
    io.emit("issues", issues);
}, 5000);

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

http.listen(3000, function(){
    console.log("listening on *:3000");
});