const TagsController = require('./controllers/tags.controller');
const PermissionMiddleware = require('../common/middlewares/auth.permission.middleware');
const ValidationMiddleware = require('../common/middlewares/auth.validation.middleware');
const UserInfoMiddleware = require('../common/middlewares/user-info.middleware');
const config = require('../common/config/env.config');

const ADMIN = config.permissionLevels.ADMIN;
const FREE = config.permissionLevels.NORMAL_USER;

exports.routesConfig = function (app) {
    app.get('/v1/tags', [
        ValidationMiddleware.validJWTNeeded,
        PermissionMiddleware.minimumPermissionLevelRequired(FREE),
        TagsController.list
    ]);
    app.put('/v1/tags/:tag', [
        ValidationMiddleware.validJWTNeeded,
        PermissionMiddleware.minimumPermissionLevelRequired(FREE),
        UserInfoMiddleware.addCreatedBy,
        TagsController.insertIfNotExist
    ]);
    app.delete('/v1/tags/:tag', [
        ValidationMiddleware.validJWTNeeded,
        PermissionMiddleware.minimumPermissionLevelRequired(ADMIN),
        TagsController.removeById
    ]);
};
