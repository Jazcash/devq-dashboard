var app = require("express")();
var http = require("http").Server(app);
var io = require("socket.io")(http);
const Donedone = require("donedone.js");
const config = require("./config");

let donedone = new Donedone({
    subdomain: config.subdomain,
    username: config.username,
    apikey: config.apikey
});

let filter = donedone.getGlobalFiltersSync().find((filter) => filter.name === config.filter);
let issues = donedone.getIssuesByFilterSync(filter.id).issues;

console.log(issues.length);

app.get("/", function(req, res){
    res.sendFile(__dirname + "/index.html");
});

io.on("connection", function(socket){
    console.log("a user connected");
    socket.emit("data", data);

    
});

http.listen(3000, function(){
    console.log("listening on *:3000");
});