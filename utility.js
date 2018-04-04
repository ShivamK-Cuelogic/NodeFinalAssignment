 var authTokenArray = [];

 module.exports = {

    getAuthTokensArray : function() {
        return authTokenArray;
    },

    setAuthTokenIdInArray : function(tokenId) {
        authTokenArray.push(tokenId);
    }
 }