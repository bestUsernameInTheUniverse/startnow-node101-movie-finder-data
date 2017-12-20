var express = require('express');
var morgan = require('morgan');
var axios = require('axios');


var app = express();
var cacheArrayI = {};
var cacheArrayT = {};


app.use(morgan('dev'));


app.get('/', function (req, res) {
    var dataObj;

    if (req.query.i) {
        if (cacheArrayI[req.query.i]) {
            res.status(200).send(cacheArrayI[req.query.i]);
            return;
        }
        else {
            axios_get('i', req.query.i, function (dataObj) {
                if (dataObj) {
                    cacheArrayI[req.query.i] = dataObj;
                    res.status(200).send(dataObj);
                }
                else {
                    res.status(500);
                }      
            });
        }
        return;
    }
    else if (req.query.t) {
        if (cacheArrayT[req.query.t]) {
            res.status(200).send(cacheArrayT[req.query.t]);
            return;
        }
        else {
            axios_get('t', req.query.t, function (dataObj) {
                if (dataObj) {
                    cacheArrayT[req.query.t] = dataObj;
                    res.status(200).send(dataObj);
                }
                else {
                    res.status(500);
                }      
            });
        }
        return;
    }
    else {
        res.status(500).send("Howdy!\n\nPlease submit a proper OMDB query.");
    }
});


function axios_get(param, movieID, callback) {
    console.log('axios engaged', encodeURI(movieID));
    axios.get('http://www.omdbapi.com/?' + param + '=' + encodeURI(movieID) + '&apikey=8730e0e')
        .then(function (response) {
            console.log('returning');
            callback(response.data);
        })
        .catch(function (error) {
            console.log('axios error:' + error);
            console.log(response);
            callback(null);
        });
}


module.exports = app;