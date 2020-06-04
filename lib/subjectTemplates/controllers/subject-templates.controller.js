const SubjectTemplateModel = require('../models/subject-templates.model');

exports.insert = (req, res) => {

    const body = req.body;
    SubjectTemplateModel.createTemplate({
        ...req.body,
        createdBy: body.createdBy,
    }).then((result) => {
        res.status(201).send({id: result._id});
    });
};

exports.getById = (req, res) => {
    SubjectTemplateModel.findById(req.params.templateId).then((result) => {
        res.status(200).send(result);
    });
};

exports.patchById = (req, res) => {
    SubjectTemplateModel.patchTemplate(req.params.templateId, req.body).then(() => {
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
    SubjectTemplateModel.list(limit, page).then((result) => {
        res.status(200).send(result);
    }, function(err) {
        console.error(err);
    })
};

exports.removeById = (req, res) => {
    SubjectTemplateModel.removeById(req.params.templateId)
        .then(()=>{
            res.status(204).send({});
        });
};
