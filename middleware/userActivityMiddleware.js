var userActivityModel = require('./../model/userActivityModel.js');
var moment = require('moment');
module.exports.logUsersDetails = function logUsersDetails (req,res,next) {
    var date = moment().format('MMMM Do YYYY, h:mm:ss a');
    var browser = req.headers['user-agent'];
    var username = req.body.username;

    var userActivityData = new userActivityModel({
        username : username,
        browser : browser ,
        date : date,
        timestamp : moment().format('x')
    });

    userActivityData.save(function(err,result) {
        if(err) throw err;
        console.log('users activity logged!!');
        next();
    })
}