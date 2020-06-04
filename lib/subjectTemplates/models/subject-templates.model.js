const mongoose = require('../../common/services/mongoose.service').mongoose;
const Schema = mongoose.Schema;
const mongooseHelper = require('../../common/helpers/mongoose.helper');

const templateSchema = new Schema({
    name: {
        type: String,
    },
    pattern: {
        type: String,
        required: true,
        minlength: 3,
    },
    description: {
        type: String,
        required: false,
        minlength: 3,
    },
    placeholders: [{
        type: String,
    }],
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: 'Users',
        immutable: true,
    }
}, {
    timestamps: true,
});

mongooseHelper.addVirtualId(templateSchema, 'SubjectTemplates');

var SubjectTemplate = mongoose.model('SubjectTemplates', templateSchema);

/**
 * @param {String} name Name of the template
 */
exports.findByName = (name) => {
    return SubjectTemplate.find({ name: RegExp(name, 'i') });
};

exports.findById = (id) => {
    return SubjectTemplate.findById(id)
        .select('-_id -__v')
        .populate('createdBy', '-_id -__v -canRate');
};

exports.createTemplate = (data) => {
    const template = new SubjectTemplate(data);
    return template.save();
};

/**
 * @param {number} perPage
 * @param {number} page
 */
exports.list = (perPage, page) => {
    return new Promise((resolve, reject) => {
        SubjectTemplate.find()
            .limit(perPage)
            .skip(perPage * page)
            .select('-__v')
            .populate('tags')
            .populate('createdBy', '-_id -__v -canRate')
            .exec(function (err, users) {
                if (err) {
                    reject(err);
                } else {
                    resolve(users);
                }
            });
    });
};

exports.patchTemplate = (id, templateData) => {
    return new Promise((resolve, reject) => {
        SubjectTemplate.findById(id, function (err, template) {
            if (err) reject(err);
            for (let i in templateData) {
                template[i] = templateData[i];
            }
            template.save(function (err, updatedTemplate) {
                if (err) return reject(err);
                resolve(updatedTemplate);
            });
        });
    });
};

exports.removeById = (id) => {
    return new Promise((resolve, reject) => {
        SubjectTemplate.remove({_id: id}, (err) => {
            if (err) {
                reject(err);
            } else {
                resolve(err);
            }
        });
    });
};
