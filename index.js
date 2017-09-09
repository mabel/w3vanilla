"use strict";

const wss = require('ws');
const redis = require('redis');
const bluebird = require('bluebird');
bluebird.promisifyAll(redis.RedisClient.prototype);

const defaultServlet = (req, res)=> {
    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.write(`Look at my servlet!`);
    res.end();
}

const factory = (servlet = defaultServlet, websocket = false)=> {
    const port = +process.argv[2] || 3000;
    require('http').createServer(servlet).listen(port);
    console.log(`HTTP server is listening at port ${port}`);
    if(!websocket || typeof withsocket !== 'function') return;
    const wss = new WebSocket.Server({port: port + 500});
    console.log(`Websocket server is listening at port ${port + 500}`);
    wss.on('connection', websocket);
}

module.exports = {factory, redis};
