const config = require('../config/env.config');
const UserModel = require('../../users/models/users.model');

const ADMIN_PERMISSION = config.permissionLevels.ADMIN;

exports.minimumPermissionLevelRequired = (required_permission_level) => {
    return (req, res, next) => {
        let user_permission_level = parseInt(req.jwt.permissionLevel);
        if (user_permission_level >= required_permission_level) {
            return next();
        } else {
            return res.status(403).send();
        }
    };
};

/**
 * Gets the requested UserId based on different requested object type
 * @param {any} req HTTP Request instance
 */
const getUserIdFromRequest = function (req) {

    if (req.params && req.params.userId) {
        return req.params.userId;     // users.controller
    } else if (req.body && req.body.by) {
        return req.body.by;           // ratings.controller
    }

    throw Error(`Authentication set to onlySameUserOrAdminCanDoThisAction but`
                + ' User ID could not be retrieved from the request.');
}

exports.onlySameUserOrAdminCanDoThisAction = (req, res, next) => {

    let user_permission_level = parseInt(req.jwt.permissionLevel);
    if (user_permission_level >= ADMIN_PERMISSION) {
        return next();
    }

    let userId;
    try {

        userId = getUserIdFromRequest(req);

    } catch(err) {
        return res.status(403).send({ error: err });
    }

    if (req.jwt.userId === userId) {
        return next();
    }

    return res.status(403).send();
};

exports.sameUserCantDoThisAction = (req, res, next) => {
    let userId = req.jwt.userId;

    if (req.params.userId !== userId) {
        return next();
    } else {
        return res.status(400).send();
    }
};

exports.onlyVerifiedUserOrAdminCanDoThisAction = (req, res, next) => {

    let user_permission_level = parseInt(req.jwt.permissionLevel);
    if (user_permission_level >= ADMIN_PERMISSION) {
        return next();
    }

    UserModel.findById(req.jwt.userId)
        .then((user) => {
            if (user && user.verified) {
                return next();
            }

            return res.status(403).send({ error: 'Not verified users are not allowed rate.' });

        }, (err) => {
            console.error(err);
        });
};

exports.onlyUserAllowedByRateeOrAdminCanDoThisAction = (req, res, next) => {

    if (!req.body) return res.status(403).send({ error: 'You are not allowed rate the selected user.' });

    const raterId = req.body.by;
    const rateeId = req.body.ratee;

    UserModel.findById(raterId)
        .populate({
            path: 'canRate',
            select: '_id',
            match: { _id: rateeId }
        }).exec(function(err, user) {
            if (user) {
                return next();
            }

            return res.status(403).send({ error: 'You are not allowed rate the selected user.' });
        });

};