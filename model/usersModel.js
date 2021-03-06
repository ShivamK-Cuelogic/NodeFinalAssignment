var Promise = require("bluebird");
var bcrypt = require('bcrypt');
var mongoose = Promise.promisifyAll(require("mongoose"));

var Schema = mongoose.Schema;

var userSchema = new Schema({
    username : {
        type : String,
        required : true
    },
    password : String,
    firstName : String,
    lastName : String,
    isAdmin : Boolean
});

userSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password,bcrypt.genSaltSync(9));
}


var userModel = mongoose.model('User',userSchema);

module.exports = userModel;