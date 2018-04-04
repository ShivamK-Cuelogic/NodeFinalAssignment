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
        userModel.findOne({username : username },function(err,queryResult) {
            if (err) throw err ;
            console.log('queryresult===>',queryResult);
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
        userData.save(function(err) {
            if (err) {
                throw err ;
                res.json({success : false ,message : 'data not saved'});
            }
            else {
                res.json({success : true ,message : 'data saved successfully'});
            }
        })
    },

    userDetailsController : function(req,res) {
        var username = req.body.username;
        userModel.findOne({ username : username},function(err,result) {
            console.log('result===>',result);
            res.json({success : true , data : result});
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
         },{new : true} ,function(err,result) {
             if (err) throw err;
             console.log('result===>');
             res.json({success:true , message : 'user info updated successfully'});

         })
    },

    getAllUsersController : function(req,res) {
        userModel.find({isAdmin : false},function(err,queryResult) {
            if(err) throw err;
            console.log("queryres===>",queryResult);
            res.json({ success : true , data : queryResult});
        });
    },

    deleteUserController : function(req,res) {
        var objectId = req.body.objectId;
        userModel.findByIdAndRemove(objectId ,function(err,result) {
            if(err) throw err;
            res.json({ success : true , message : 'user deleted successfully'});
        })
    },

    getUsersActivityController : function(req,res) {
        userActivityModel.find({},function(err,result) {
            if(err) throw err;
            console.log("usersactivity===>",result);
            res.json({success: true , data : result});
        })
    },

    usersNotLoggedController : function(req,res) {
        userActivityModel.find({},function(err,queryResult) {
            var currentTimestamp = moment().format('x');
            var result = [];
            if(err) throw err ;
            queryResult.forEach(function(record) {
                var ts = parseInt(record.timestamp);
                if ((currentTimestamp-ts) > 432000000) {
                    result.push(record);
                }
            })

            console.log("result===>",result) 
            res.json({ success : true , data : result});
        })
    } ,


    searchController : function(req,res) {
        
        var searchText = req.body.searchText;
        userModel.find({username : searchText},function(err,result) {
            if(err) throw err;
            console.log("search result===>",result);
            res.json({ success : true , data : result });
        }) 
    }

}