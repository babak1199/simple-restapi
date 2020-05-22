const TagModel = require('../models/tags.model');

exports.insertIfNotExist = (req, res) => {

    console.info('Tag: \'' + req.params.tag + '\'');
    TagModel.exists(req.params.tag).then(function(result) {
        if (result) {
            res.status(204).send({});
        } else {
            TagModel.createTag({
                text: req.params.tag,
                createdBy: req.body.createdBy
            }).then((result) => {
                res.status(201).send({ id: result._id });
            });
        }
    }, function(err) {
        console.error(err);
    });
};

exports.patchById = (req, res) => {
    TagModel.patchTag(req.params.tagId, req.body).then(() => {
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
    TagModel.list(limit, page).then((result) => {
        res.status(200).send(result);
    }, function(err) {
        console.error(err);
    })
};

exports.removeById = (req, res) => {
    TagModel.removeById(req.params.tag)
        .then(()=>{
            res.status(204).send({});
        });
};
