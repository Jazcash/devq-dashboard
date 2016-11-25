const express = require("express");
const app = express();
const http = require("http").Server(app);
const io = require("socket.io")(http);
const _ = require("underscore");
const bodyParser = require("body-parser");
const favicon = require("express-favicon");
const Donedone = require("donedone.js");
const config = require("./config");

let donedone = new Donedone({
	subdomain: config.subdomain,
	username: config.username,
	apikey: config.apikey
});
let issues = [];
let filter = donedone.getGlobalFiltersSync().find((filter) => filter.name === config.filter);

fetchIssues();

setInterval(fetchIssues, 5000);

app.use(favicon(__dirname + '/public/favicon.png'));
app.use(express.static('public'));
app.use(bodyParser.json());

app.get("/", function(req, res){
	res.sendFile(__dirname + "/index.html");
});

app.get("/pingdom", function(req, res){
	let data = JSON.parse(req.query.message);
	console.log(data);
	io.emit("alert", {site: data.host, isDown: data.description === "down" ? true : false});
	res.end();
});

io.on("connection", function(socket){
	console.log("A client connected");
	socket.emit("init", {config: config, issues: issues});
	socket.on("disconnect", function(){
		console.log("A client disconnected");
	});
});

http.listen(3020, function(){
	console.log("listening on *:3020");
});

function fetchIssues(){
	issues = donedone.getIssuesByFilterSync(filter.id).issues;
	io.emit("issues", issues);
}