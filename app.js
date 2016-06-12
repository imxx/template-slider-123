'use strict';

var express = require('express'),
    app = express(),
    port = process.env.PORT || 5000,
    environment = process.env.NODE_ENV;

switch(environment){

    case "production":
        app.use(express.static("./build"));
        app.get("/*", function(req, res){
            res.sendfile("./build/index.html");
        });
        break;

    default:
        app.use(express.static("./src/"));
        app.get("/*", function(req, res){
            res.sendFile('./src/index.html');
        });
        break;
}

app.use(express.static('public'));
app.use(express.static("libs"))
app.get('/', function(req, res) {
    res.sendFile('./public/index.html');
});

app.listen(port, function() {
    console.log(
        "Listening on port " + port +
        " in " + (environment || "default") + " environment."
    );
});