var JoiSchema = require("./joiValSchema.js");
var Joi = require("joi");

module.exports.checkValidation = function(req,res,next) {
    console.log("request data ===>",req.body);
    var validationResult = JoiSchema.validate(req.body);
    console.log('validationResult===>',validationResult);
    if(validationResult.error != null) {
        res.json({success : false , message : 'validation failed'});
        res.end();
    } else {
        next();
    }
    
}