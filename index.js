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
let issues = {};

fetchIssues();

setInterval(fetchIssues, 5000);

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

http.listen(3001, function(){
    console.log("listening on *:3001");
});

function fetchIssues(){
    let _issues = donedone.getIssuesByFilterSync(filter.id).issues;
    let thisIssues = {
        backlog: [],
        unassigned: [],
        inprogress: [],
        withclient: [],
        golive: [],
        ungrouped: []
    };

    for (let i=0; i<_issues.length; ++i){
        let issue = _issues[i];
        switch(issue.status.name){
            case "Pushed Back": 
                thisIssues.backlog.push(issue);
                break;
            case "Open":
                thisIssues.unassigned.push(issue);
                break;
            case "In Progress":
                thisIssues.inprogress.push(issue);
                break;
            case "Ready for Retest":
                thisIssues.withclient.push(issue);
                break;
            case "Ready For Next Release":
                thisIssues.golive.push(issue);
                break;
            default:
                thisIssues.ungrouped.push(issue);
        }
    }

    thisIssues.withclient = _.chain(thisIssues.withclient)
        .sortBy((issue) => issue.fixer.name)
        .map((issue) => issue.fixer.name)
        .value();

    issues = thisIssues;

    io.emit("issues", issues);
}