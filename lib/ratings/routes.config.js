const RatingsController = require('./controllers/ratings.controller');
const PermissionMiddleware = require('../common/middlewares/auth.permission.middleware');
const ValidationMiddleware = require('../common/middlewares/auth.validation.middleware');
const config = require('../common/config/env.config');

const ADMIN = config.permissionLevels.ADMIN;
const FREE = config.permissionLevels.NORMAL_USER;

exports.routesConfig = function (app) {
    app.post('/v1/ratings', [
        ValidationMiddleware.validJWTNeeded,
        PermissionMiddleware.minimumPermissionLevelRequired(FREE),
        PermissionMiddleware.onlySameUserOrAdminCanDoThisAction,
        PermissionMiddleware.onlyVerifiedUserOrAdminCanDoThisAction,
        PermissionMiddleware.onlyUserAllowedByRateeOrAdminCanDoThisAction,
        RatingsController.insert
    ]);
    app.get('/v1/ratings', [
        ValidationMiddleware.validJWTNeeded,
        PermissionMiddleware.minimumPermissionLevelRequired(FREE),
        PermissionMiddleware.onlySameUserOrAdminCanDoThisAction,
        RatingsController.list
    ]);
    app.get('/v1/ratings/:ratingId', [
        ValidationMiddleware.validJWTNeeded,
        PermissionMiddleware.minimumPermissionLevelRequired(FREE),
        PermissionMiddleware.onlySameUserOrAdminCanDoThisAction,
        RatingsController.getById
    ]);
    app.patch('/v1/ratings/:ratingId', [
        ValidationMiddleware.validJWTNeeded,
        PermissionMiddleware.minimumPermissionLevelRequired(FREE),
        PermissionMiddleware.onlySameUserOrAdminCanDoThisAction,
        RatingsController.patchById
    ]);
    app.delete('/v1/ratings/:ratingId', [
        ValidationMiddleware.validJWTNeeded,
        PermissionMiddleware.minimumPermissionLevelRequired(ADMIN),
        PermissionMiddleware.onlySameUserOrAdminCanDoThisAction,
        RatingsController.removeById
    ]);
};
