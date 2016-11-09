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
let _issues = donedone.getIssuesByFilterSync(filter.id).issues;

let issues = {
    backlog: [],
    unassigned: [],
    inprogress: [],
    withclient: [],
    golive: []
};

console.log(_issues.length);

for (let i=0; i<_issues.length; ++i){
    let issue = _issues[i];
    switch(issue.status.name){
        case "Pushed Back": 
            issues.backlog.push(issue);
            break;
        case "In Progress":
            issues.inprogress.push(issue);
            break;
        case "Ready for Retest":
            issues.withclient.push(issue);
            break;
    }
}

console.log(_.sortBy(issues.withclient, function(item){
    return item.fixer.name;
}).map((x) => x.fixer.name));

// setInterval(function(){
//     issues = donedone.getIssuesByFilterSync(filter.id).issues;
//     io.emit("issues", issues);
// }, 5000);

// app.use(express.static('public'));

// app.get("/", function(req, res){
//     res.sendFile(__dirname + "/index.html");
// });

// io.on("connection", function(socket){
//     console.log("A client connected");

//     socket.emit("issues", issues);
    
//     socket.on("disconnect", function(){
//         console.log("A client disconnected");
//     });
// });

// http.listen(3002, function(){
//     console.log("listening on *:3002");
// });