const axios = require('axios');
const express = require('express');
const app = express();
const fakebox = require('factcat-fakebox');

app.use(require('body-parser').json());

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Cache-Control, Pragma, Origin, Authorization, Content-Type, X-Requested-With");
    res.header("Access-Control-Allow-Methods", "GET, PUT, POST");
    return next();
});

app.post('/', (req, res) => {
    fakebox(req.body.link, function (score) {
        console.log(score);
        res.json({ score });
    });
});

app.listen(9090);
