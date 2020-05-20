const mongoose = require('../../common/services/mongoose.service').mongoose;
const Schema = mongoose.Schema;

const subjectSchema = new Schema({
    text: {
        type: String,
        required: true,
        minlength: 3
    },
    icon: {
        type: String,
        required: false
    },
    tags: [{
        type: String,
        lowercase: true,
        trim: true,
        minlength: 2
    }],
    votes: {
        type: Number,
        default: 0
    },
    dateApproved: {
        type: Date,
        required: false
    },
    approvedBy: {
        type: Schema.Types.ObjectId,
        ref: 'Users',
        required: false
    },
    dateCreated: {
        type: Date,
        default: Date.now,
        immutable: true
    },
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: 'Users',
        immutable: true
    }
});

var Subject = mongoose.model('Subjects', subjectSchema);

/**
 * @param {String} text
 */
exports.findByText = (text) => {
    return Subject.find({ text: RegExp(text, 'i') });
};

exports.findById = (id) => {
    return Subject.findById(id)
        .select('-_id -__v')
        .populate('createdBy', '-_id -__v')
        .populate('approvedBy', '-_id -__v');
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
            .populate('createdBy', '-_id -__v')
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
