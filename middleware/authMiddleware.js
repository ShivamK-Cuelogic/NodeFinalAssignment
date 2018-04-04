
var utility = require('./../utility.js');
module.exports = {
    checkAuthToken : function(req,res,next) {
        var tokenIdsArray = utility.getAuthTokensArray();
        var tokenId = req.body.authToken;
        console.log('tokenId===>','tokenIdArry===>',utility.getAuthTokensArray());
        if(tokenId != null) {
            if (tokenIdsArray.includes(tokenId)) {
                next();
            } else {
                res.json({success : false , message : 'auth token does not match.. plz login again' });
            }
        } else {
            res.json({success : false , message : 'auth token does not exist.. plz login' });
        }
    }
}