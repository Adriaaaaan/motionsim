var dgram = require("dgram");
var fs = require('fs');

var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var server = dgram.createSocket("udp4");

server.on("error", function (err) {
    console.log("server error:\n" + err.stack);
    server.close();
});

app.use(express.static('public'));

server.on("message", function (msg, rinfo) {
    var message = {
        heading: getValue(16,msg),
        pitch: getValue(20,msg),
        roll: getValue(24,msg),
        accelX: getValue(28,msg),
        accelY: getValue(32,msg),
        accelZ: getValue(36,msg),
        velocityX:getValue(40,msg),
        velocityY: getValue(44,msg),
        velocityZ: getValue(48,msg)
    };
    io.emit('update', message);
});

function getValue(offset,msg) {
    "use strict";
   return Math.round(msg.readFloatLE(offset)*10000)/10000
}

io.on('connection', function(socket){
    console.log('a user connected');
});

server.on("listening", function () {
    var address = server.address();
    console.log("server listening " +
        address.address + ":" + address.port);
});

server.bind(20777);
http.listen(80, function(){
    console.log('listening on *:80');
});
