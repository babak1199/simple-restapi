const mongoose = require('../../common/services/mongoose.service').mongoose;
const Schema = mongoose.Schema;
const mongooseHelper = require('../../common/helpers/mongoose.helper');

const subjectSchema = new Schema({
    text: {
        type: String,
        required: true,
        minlength: 3,
    },
    description: {
        type: String,
        required: false,
        minlength: 3,
    },
    icon: {
        type: String,
        required: false,
    },
    tags: [{
        type: Schema.Types.ObjectId,
        ref: 'Tags',
    }],
    rateMeanings: [{    // [ { 1: 'Not kind at all' }, { 2: 'A bit kind' } ]
        type: Map,
        of: String,
        required: false,
    }],
    template: {
        type: Schema.Types.ObjectId,
        ref: 'SubjectTemplates',
    },
    approvedDate: {
        type: Date,
        required: false,
    },
    approvedBy: {
        type: Schema.Types.ObjectId,
        ref: 'Users',
        required: false,
    },
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: 'Users',
        immutable: true,
    }
}, {
    timestamps: true,
});

mongooseHelper.addVirtualId(subjectSchema, 'Subjects');

var Subject = mongoose.model('Subjects', subjectSchema);

/**
 * @param {String} text
 */
exports.findByText = (text) => {
    return Subject.find({ text: RegExp(text, 'i') })
        .populate('template', '-_id -__v')
        .populate('createdBy', '-_id -__v -canRate')
        .populate('approvedBy', '-_id -__v');
};

exports.findById = (id) => {
    return Subject.findById(id, '-__v')
        .populate('tags', '-_id -__v')
        .populate('template');
};

exports.createSubject = (data) => {
    const subject = new Subject(data);
    return subject.save();
};

/**
 * @param {number} perPage
 * @param {number} page
 */
exports.list = (perPage, page) => {
    return new Promise((resolve, reject) => {
        Subject.find()
            .limit(perPage)
            .skip(perPage * page)
            .select('-__v')
            .populate('tags')
            .populate('template', '-_id -__v')
            .populate('createdBy', '-_id -__v -canRate')
            .populate('approvedBy', '-_id -__v')
            .exec(function (err, users) {
                if (err) {
                    reject(err);
                } else {
                    resolve(users);
                }
            });
    });
};

exports.patchSubject = (id, subjectData) => {
    return new Promise((resolve, reject) => {
        Subject.findById(id, function (err, subject) {
            if (err) reject(err);
            for (let i in subjectData) {
                subject[i] = subjectData[i];
            }
            subject.save(function (err, updatedSubject) {
                if (err) return reject(err);
                resolve(updatedSubject);
            });
        });
    });
};

exports.removeById = (subjectId) => {
    return new Promise((resolve, reject) => {
        Subject.remove({_id: subjectId}, (err) => {
            if (err) {
                reject(err);
            } else {
                resolve(err);
            }
        });
    });
};
