const mongoose = require('../../common/services/mongoose.service').mongoose;
const Schema = mongoose.Schema;

const voteSchema = new Schema({
    subject: {
        type: Schema.Types.ObjectId,
        ref: 'Subjects',
        required: true,
    },
    votes: {
        type: Number,
        default: 0
    }
});

var Vote = mongoose.model('Votes', voteSchema);

/**
 * @param {any} subjectId
 */
exports.findBySubjectId = (subjectId) => {
    return Vote.find()
        .populate({
            path: 'subject',
            match: { _id: subjectId }
        });
};

exports.findById = (id) => {
    return Vote.findById(id)
        .select('-_id -__v')
        .populate('subject', '-_id -__v');
};

exports.createVote = (data) => {
    const subject = new Vote(data);
    return subject.save();
};

/**
 * @param {number} perPage
 * @param {number} page
 */
exports.list = (perPage, page) => {
    return new Promise((resolve, reject) => {
        Vote.find()
            .limit(perPage)
            .skip(perPage * page)
            .select('-__v')
            .populate('subject', '-_id -__v')
            .exec(function (err, users) {
                if (err) {
                    reject(err);
                } else {
                    resolve(users);
                }
            });
    });
};

exports.patchVote = (id, voteData) => {
    return new Promise((resolve, reject) => {
        Vote.findById(id, function (err, vote) {
            if (err) reject(err);
            for (let i in voteData) {
                vote[i] = voteData[i];
            }
            vote.save(function (err, updatedVote) {
                if (err) return reject(err);
                resolve(updatedVote);
            });
        });
    });
};

exports.removeById = (voteId) => {
    return new Promise((resolve, reject) => {
        Vote.remove({ _id: voteId }, (err) => {
            if (err) {
                reject(err);
            } else {
                resolve(err);
            }
        });
    });
};
