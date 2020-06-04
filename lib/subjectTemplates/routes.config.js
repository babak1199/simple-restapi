const SubjectTemplatesController = require('./controllers/subject-templates.controller');
const PermissionMiddleware = require('../common/middlewares/auth.permission.middleware');
const ValidationMiddleware = require('../common/middlewares/auth.validation.middleware');
const UserInfoMiddleware = require('../common/middlewares/user-info.middleware');
const config = require('../common/config/env.config');

const ADMIN = config.permissionLevels.ADMIN;

exports.routesConfig = function (app) {
    app.post('/v1/templates', [
        ValidationMiddleware.validJWTNeeded,
        PermissionMiddleware.minimumPermissionLevelRequired(ADMIN),
        UserInfoMiddleware.addCreatedBy,
        SubjectTemplatesController.insert,
    ]);
    app.get('/v1/templates', [
        ValidationMiddleware.validJWTNeeded,
        PermissionMiddleware.minimumPermissionLevelRequired(ADMIN),
        SubjectTemplatesController.list,
    ]);
    app.get('/v1/templates/:templateId', [
        ValidationMiddleware.validJWTNeeded,
        PermissionMiddleware.minimumPermissionLevelRequired(ADMIN),
        PermissionMiddleware.onlySameUserOrAdminCanDoThisAction,
        SubjectTemplatesController.getById,
    ]);
    app.patch('/v1/templates/:templateId', [
        ValidationMiddleware.validJWTNeeded,
        PermissionMiddleware.minimumPermissionLevelRequired(ADMIN),
        PermissionMiddleware.onlySameUserOrAdminCanDoThisAction,
        SubjectTemplatesController.patchById,
    ]);
    app.delete('/v1/templates/:templateId', [
        ValidationMiddleware.validJWTNeeded,
        PermissionMiddleware.minimumPermissionLevelRequired(ADMIN),
        SubjectTemplatesController.removeById,
    ]);
};
