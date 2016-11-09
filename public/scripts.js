let socket = io();

Vue.component("issue", {
    props: ["issue"],
    template: "<div class='issue'>{{issue.title}}</div>"
});

var app = new Vue({
    el: "#app",
    data: {
        issues: []
    }
});

socket.on("issues", function(issues){
    app.issues = issues;
});