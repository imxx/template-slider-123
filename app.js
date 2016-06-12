'use strict';

var express = require('express'),
    app = express(),
    path = require("path"),
    port = process.env.PORT || 5000,
    environment = process.env.NODE_ENV;

switch(environment){

    case "production":
        app.use(express.static("./build"));
        app.get("/*", function(req, res){
            res.sendFile(path.join(__dirname+"/build/index-12d72601cf.html"));
        });
        break;

    default:
        app.use(express.static("./src/"));
        app.get("/*", function(req, res){
            res.sendFile('./src/index.html');
        });
        break;
}

app.listen(port, function() {
    console.log(
        "Listening on port " + port +
        " in " + (environment || "default") + " environment."
    );
});