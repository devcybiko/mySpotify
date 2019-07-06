#!/usr/bin/env node
const express = require('express');
const https = require('https');

const app = express();
var port = process.env.PORT || 80;

var bodyParser = require('body-parser');
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

app.use(function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
});

/* serves all the static files */
app.get(/^(.+)$/, function(req, res) {
    console.log('static file request : ');
    console.log(req);
    if (req.params[0].startsWith('/proxy/')) {
        return proxy(req, res);
    }
    res.sendFile(process.cwd() + req.params[0]);
});

//acts as a proxy server to a remote host
function proxy(req, res) {
    console.log('proxy request : ');
    //console.log(req);
    let query = '';
    let comma = '?';
    for (let key in req.query) {
        let value = req.query[key];
        query += comma + key + '=' + value;
        comma = '&';
    }

    let url = req.params[0].substring('/proxy/'.length) + query;
    console.log(url);
    https
        .get(url, resp => {
            let data = '';

            // A chunk of data has been recieved.
            resp.on('data', chunk => {
                data += chunk;
            });

            // The whole response has been received. Print out the result.
            resp.on('end', () => {
                console.log(data);
                res.send(data);
            });
        })
        .on('error', err => {
            console.log('Error: ' + err.message);
        });
}

app.listen(port, err => {
    if (err) {
        return console.log('something bad happened', err);
    }
    console.log(`server is listening on ${port}`);
});
