var jwt = require("jsonwebtoken");
var moment = require('moment');
var bcrypt = require('bcrypt');
var fs = require("fs");
var utility = require('./../utility.js');
var userModel = require("./../model/usersModel.js");
var userActivityModel = require('./../model/userActivityModel.js');
module.exports = {
    signinController : function(req,res) {
        var password = req.body.password;
        var username = req.body.username;
        userModel.findOne({username : username })
        .then((queryResult) => {
            
            if( queryResult != null) {

                if(bcrypt.compareSync(password,queryResult.password) || queryResult.password == password) {
                    var payload = {
                        username : username
                    }
                    var token = jwt.sign(payload,process.env.keyforauth,{ expiresIn: 144000 });
                    console.log('token ===>',token);
                    utility.setAuthTokenIdInArray(token);
                    res.json({success : true , message : 'Login in successful' ,token : token ,isAdmin : queryResult.isAdmin});
                } else {
                    res.json({success : false , message : 'password does not match' }); 
                }
                
            } else {
                res.json({ success : false , message : 'username or password is incorrect'});
            }
        })
        .catch((err) => {
            console.log("err==>",err);
            res.boom.serverUnavailabe('Sorry request cannot be processed.. plz try again later')
        })
    } ,


    signupController : function(req,res) {
        var firstName = req.body.firstName;
        var lastName = req.body.lastName;
        var password = req.body.password;
        var username = req.body.username;
        var userData = new userModel({
            username : username ,
            firstName : firstName ,
            lastName : lastName ,
            isAdmin : false
        });
        userData.password = userData.generateHash(password);
        userData.save()
        .then(()=> {
            res.json({success : true ,message : 'data saved successfully'});
        })
        .catch((err) => {
            console.log("err==>",err);
            res.boom.serverUnavailabe('Sorry request cannot be processed.. plz try again later')
        })
        
    },

    userDetailsController : function(req,res) {
        var username = req.body.username;
        userModel.findOne({ username : username})
        .then(function(result) {
            console.log('result===>',result);
            res.json({success : true , data : result});
        })
        .catch(err => {
            console.log("err==>",err);
            res.boom.serverUnavailabe('Sorry request cannot be processed.. plz try again later');

        })
    } ,

    updateInfoController : function(req,res) {
        var firstName = req.body.firstName;
        var lastName = req.body.lastName;
        var objectId = req.body.objectId;
        userModel.findByIdAndUpdate(objectId,{
            $set : {
                firstName : firstName,
                lastName : lastName
            }
         },{new : true} )
         .then(function(err,result) {
             console.log('result===>');
             res.json({success:true , message : 'user info updated successfully'});

         })
         .catch(err => {
            console.log("err==>",err);
            res.boom.serverUnavailabe('Sorry request cannot be processed.. plz try again later');

        })
    },

    getAllUsersController : function(req,res) {
        userModel.find({isAdmin : false})
        .then(function(queryResult) {
            console.log("queryres===>",queryResult);
            res.json({ success : true , data : queryResult});
        })
        .catch(err => {
            console.log("err==>",err);
            res.boom.serverUnavailabe('Sorry request cannot be processed.. plz try again later');

        })
    },

    deleteUserController : function(req,res) {
        var objectId = req.body.objectId;
        userModel.findByIdAndRemove(objectId )
        .then(function(result) {
            res.json({ success : true , message : 'user deleted successfully'});
        })
        .catch(err => {
            console.log("err==>",err);
            res.boom.serverUnavailabe('Sorry request cannot be processed.. plz try again later');

        })
    },

    getUsersActivityController : function(req,res) {
        userActivityModel.find({})
        .then(function(result) {
            console.log("usersactivity===>",result);
            res.json({success: true , data : result});
        })
        .catch(err => {
            console.log("err==>",err);
            res.boom.serverUnavailabe('Sorry request cannot be processed.. plz try again later');

        })
    },

    usersNotLoggedController : function(req,res) {
        userActivityModel.find({})
        .then(function(queryResult) {
            var currentTimestamp = moment().format('x');
            var result = [];
            queryResult.forEach(function(record) {
                var ts = parseInt(record.timestamp);
                if ((currentTimestamp-ts) > 432000000) {
                    result.push(record);
                }
            })

            console.log("result===>",result) 
            res.json({ success : true , data : result});
        })
        .catch(err => {
            console.log("err==>",err);
            res.boom.serverUnavailabe('Sorry request cannot be processed.. plz try again later');

        })
    } ,


    searchController : function(req,res) {

        var searchText = req.body.searchText;
        userModel.find({username : searchText})
        .then(function(result) {
            console.log("search result===>",result);
            res.json({ success : true , data : result });
        })
        .catch(err => {
            console.log("err==>",err);
            res.boom.serverUnavailabe('Sorry request cannot be processed.. plz try again later');
        })
    }

}