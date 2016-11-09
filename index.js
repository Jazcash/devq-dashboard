const Donedone = require("donedone.js");
const config = require("./config");

let donedone = new Donedone({
    subdomain: config.subdomain,
    username: config.username,
    apikey: config.apikey
});

donedone.getCompanies(function(companies){
    console.log(companies);
});