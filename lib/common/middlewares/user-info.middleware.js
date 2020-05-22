exports.addCreatedBy = (req, res, next) => {

    if (req.jwt && req.jwt.userId) {
        req.body.createdBy = req.jwt.userId;
    }

    return next();
};