"use strict";

const fs = require('fs')
const WebSocket = require('ws')
const redis = require('redis')
const bluebird = require('bluebird')
bluebird.promisifyAll(redis.RedisClient.prototype)
const redisc = redis.createClient()
const pub = redis.createClient()
const sub = redis.createClient()

const winston = require('winston')
const logger = winston.createLogger({
    level: 'info',
    format: winston.format.json(),
    transports: [
            new winston.transports.File({ filename: '../log/error.log', level: 'error' }),
        ]
})
if (process.env.NODE_ENV !== 'production') {
    logger.add(new winston.transports.Console({
        format: winston.format.simple()
    }))
}

const defaultServlet = (req, res)=> {
    res.writeHead(200, {'Content-Type': 'text/plain'})
    res.write('Look at my servlet!')
    res.end()
}

(() => {
    let path = `${process.cwd()}/servlet.js`
    let servlet = fs.existsSync(path) ? require(path)({redisc, pub, sub}, logger) : defaultServlet
    const port = +process.argv[2] || 3000;
    require('http').createServer(servlet).listen(port);
    console.log(`HTTP server is listening at port ${port}`);
})()
