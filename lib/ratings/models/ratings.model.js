const mongoose = require('../../common/services/mongoose.service').mongoose;
const Schema = mongoose.Schema;

const ratingSchema = new Schema({
    subject: {
        type: Schema.Types.ObjectId,
        ref: 'Subject',
        required: true
    },
    by: {
        type: Schema.Types.ObjectId,
        ref: 'Users',
        required: true
    },
    ratee: {
        type: Schema.Types.ObjectId,
        ref: 'Users',
        required: true
    },
    rate: {
        type: Number,
        min: 1,
        max: 10
    },
    dateCreated: {
        type: Date,
        default: Date.now,
        immutable: true
    }
});

var Rating = mongoose.model('Ratings', ratingSchema);

exports.findBySubjectId = (subjectId) => {
    return Rating.find()
        .populate({
            path: 'subject',
            match: { id: subjectId },
            select: '-_id -__v'
        })
        .populate('by', '-_id -__v')
        .populate('ratee', '-_id -__v');
};

exports.findByRaterId = (raterId) => {
    return Rating.find()
        .populate({
            path: 'by',
            match: { id: raterId },
            select: '-_id -__v'
        })
        .populate('subject', '-_id -__v')
        .populate('ratee', '-_id -__v');
};

exports.findByRateeId = (rateeId) => {
    return Rating.find()
        .populate({
            path: 'ratee',
            match: { id: rateeId },
            select: '-_id -__v'
        })
        .populate('subject', '-_id -__v')
        .populate('by', '-_id -__v');
};

exports.findById = (id) => {
    return Rating.findById(id)
        .select('-_id -__v')
        .populate('subject', '-_id -__v')
        .populate('by', '-_id -__v')
        .populate('ratee', '-_id -__v');
};

exports.createRating = (data) => {
    const rating = new Rating(data);
    return rating.save();
};

/**
 * @param {number} perPage
 * @param {number} page
 */
exports.list = (perPage, page) => {
    return new Promise((resolve, reject) => {
        Rating.find()
            .limit(perPage)
            .skip(perPage * page)
            .select('-__v')
            .populate('subject', '-_id -__v')
            .populate('by', '-_id -__v')
            .populate('ratee', '-_id -__v')
            .exec(function (err, users) {
                if (err) {
                    reject(err);
                } else {
                    resolve(users);
                }
            });
    });
};

exports.patchRating = (id, ratingData) => {
    return new Promise((resolve, reject) => {
        Rating.findById(id, function (err, subject) {
            if (err) reject(err);
            for (let i in ratingData) {
                subject[i] = ratingData[i];
            }
            subject.save(function (err, updatedSubject) {
                if (err) return reject(err);
                resolve(updatedSubject);
            });
        });
    })

};

exports.removeById = (id) => {
    return new Promise((resolve, reject) => {
        Rating.remove({_id: id}, (err) => {
            if (err) {
                reject(err);
            } else {
                resolve(err);
            }
        });
    });
};
