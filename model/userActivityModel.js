
var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var userActivitySchema = new Schema({
    username : String ,
    browser : String ,
    date : String ,
    timestamp : Number
});

module.exports = mongoose.model('UsersActivity',userActivitySchema);