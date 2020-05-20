const SubjectModel = require('../models/subjects.model');

exports.insert = (req, res) => {

    const body = req.body;
    SubjectModel.createSubject({
        text: body.text,
        icon: body.icon,
        tags: body.tags,
        createdBy: req.jwt.userId
    }).then((result) => {
        res.status(201).send({id: result._id});
    });
};

exports.getById = (req, res) => {
    SubjectModel.findById(req.params.subjectId).then((result) => {
        res.status(200).send(result);
    });
};

exports.patchById = (req, res) => {
    SubjectModel.patchSubject(req.params.subjectId, req.body).then(() => {
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
    SubjectModel.list(limit, page).then((result) => {
        res.status(200).send(result);
    }, function(err) {
        console.error(err);
    })
};

exports.removeById = (req, res) => {
    SubjectModel.removeById(req.params.userId)
        .then(()=>{
            res.status(204).send({});
        });
};
