var Promise = require("bluebird");
var express = require("express");
var boom = require('express-boom');
var morgan = require("morgan");
var mongoose = Promise.promisifyAll(require("mongoose"));
const bodyParser = require("body-parser");


var fs = require("fs");
var allRoutes = require("./routes/allRoutes.js");
require('dotenv').config();

var app = express();
var router = express.Router();
var authTokenArray = [];

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());
app.use(express.static(__dirname + '/public'));
mongoose.set('debug',true);
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});
app.use(morgan('dev'));
app.use(boom());

app.use((req,res) => {
    req.json({ status : 'Requested resource not available'});
})

allRoutes(app);

mongoose.connect(process.env.db_url,function(err){
    if (err) throw err ;
    console.log("Database conneted !!");
});
app.listen(process.env.port,function(err) {
    if(err) throw err ;
    console.log("Server is listening on port ",process.env.port);
});


