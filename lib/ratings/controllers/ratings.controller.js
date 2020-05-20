const RatingModel = require('../models/ratings.model');

exports.insert = (req, res) => {
    RatingModel.createRating(req.body)
        .then((result) => {
            res.status(201).send({id: result._id});
        });
};

exports.getById = (req, res) => {
    RatingModel.findById(req.params.ratingId).then((result) => {
        res.status(200).send(result);
    });
};

exports.patchById = (req, res) => {
    RatingModel.patchRating(req.params.ratingId, req.body).then(() => {
        res.status(204).send({});
    });
};

exports.list = (req, res) => {
    let limit = req.query.limit && req.query.limit <= 100 ? parseInt(req.query.limit) : 10;
    let page = 0;
    if (req.query) {
        if (req.query.page) {
            req.query.page = parseInt(req.query.page);
            page = Number.isInteger(req.query.page) ? req.query.page : 0;
        }
    }
    RatingModel.list(limit, page).then((result) => {
        res.status(200).send(result);
    })
};

exports.removeById = (req, res) => {
    RatingModel.removeById(req.params.userId)
        .then(()=>{
            res.status(204).send({});
        });
};
