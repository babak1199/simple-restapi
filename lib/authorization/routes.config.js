const VerifyUserMiddleware = require('./middlewares/verify.user.middleware');
const AuthorizationController = require('./controllers/authorization.controller');
const AuthValidationMiddleware = require('../common/middlewares/auth.validation.middleware');
const AuthFieldValidationMiddleware = require('./validators/authorization.validate');

const trimRequest = require('trim-request');

exports.routesConfig = function (app) {

    app.post('/v1/auth/login', [
        VerifyUserMiddleware.hasAuthValidFields,
        trimRequest.all,
        AuthFieldValidationMiddleware.login,
        VerifyUserMiddleware.isPasswordAndUserMatch,
        AuthorizationController.login,
    ]);

    app.post('/v1/auth/refresh', [
        AuthValidationMiddleware.validJWTNeeded,
        AuthValidationMiddleware.verifyRefreshBodyField,
        trimRequest.all,
        AuthValidationMiddleware.validRefreshNeeded,
        AuthorizationController.refresh_token,
    ]);

    app.post('/v1/auth/verify', [
        AuthValidationMiddleware.validJWTNeeded,
        AuthorizationController.verifyToken,
    ]);
};
