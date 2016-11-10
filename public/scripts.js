let socket = io();

socket.on("issues", function(issues){
    app.issues = issues;
});