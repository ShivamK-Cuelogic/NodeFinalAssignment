var controller = require("./../controller/controller.js");
var validationMiddleware = require("./../middleware/joiValidation.js");
var authMiddleware = require('./../middleware/authMiddleware');
var userActivityMiddleware = require('./../middleware/userActivityMiddleware');
module.exports = function(app) {
    app.post('/signup',validationMiddleware.checkValidation,controller.signupController);
    app.post('/signin',userActivityMiddleware.logUsersDetails,controller.signinController);
    app.post('/user/details',authMiddleware.checkAuthToken,controller.userDetailsController);
    app.post('/user/updateInfo',controller.updateInfoController);
    app.post('/admin/getAllUsers',authMiddleware.checkAuthToken,controller.getAllUsersController);
    app.post('/admin/deleteUser',controller.deleteUserController);
    app.post('/admin/usersActivity',authMiddleware.checkAuthToken,controller.getUsersActivityController);
    app.post('/admin/usersNotLogged',authMiddleware.checkAuthToken,controller.usersNotLoggedController);
    app.post('/admin/search',authMiddleware.checkAuthToken,controller.searchController);
}