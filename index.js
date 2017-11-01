"use strict";

const moment = require('moment')
const fs = require('fs')
const WebSocket = require('ws')
const redis = require('redis')
const bluebird = require('bluebird')
bluebird.promisifyAll(redis.RedisClient.prototype)
const redisc = redis.createClient()
const pub = redis.createClient()
const sub = redis.createClient()

const {createLogger, format, transports} = require('winston')
const { combine, timestamp, label, printf } = format
const fmt = printf(info => {
    return `${moment().format('YYYY-MM-DD HH:mm')} ${info.message}`;
})

const logger = createLogger({
    level: 'error',
    format: fmt,
    transports: [
        new transports.File({ filename: '../log/error.log', level: 'error' }),
    ]
})

if (process.env.NODE_ENV !== 'production') {
    logger.add(new transports.Console({
        format: fmt
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
