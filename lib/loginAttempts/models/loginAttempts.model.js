const mongoose = require('../../common/services/mongoose.service').mongoose;
const Schema = mongoose.Schema;
const mongooseHelper = require('../../common/helpers/mongoose.helper');

const loginAttemptSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'Users',
        required: true
    },
    numberOfAttempts: {
        type: Number,
        default: 0,
        min: 0
    },
}, {
    timestamps: true
});

mongooseHelper.addVirtualId(loginAttemptSchema, 'LoginAttempts');

const LoginAttempt = mongoose.model('LoginAttempts', loginAttemptSchema);


/**
 * @param {String} email
 */
exports.findByUserEmail = (email) => {
    return LoginAttempt.find()
        .populate({
            path: 'user',
            match: { email: email },
            select: 'id email'
        });
};

exports.findByUserId = (id) => {
    return LoginAttempt.find()
        .populate({
            path: 'user',
            match: { _id: id },
            select: 'id email'
        });
};

exports.findById = (id) => {
    return LoginAttempt.findOne({ _id: id })
        .select('-__v');
};

exports.createLoginAttempt = (loginAttemptData) => {
    const loginAttempt = new LoginAttempt(loginAttemptData);
    return loginAttempt.save();
};

/**
 * @param {number} perPage
 * @param {number} page
 */
exports.list = (perPage, page) => {
    return new Promise((resolve, reject) => {
        LoginAttempt.find()
            .limit(perPage)
            .skip(perPage * page)
            .populate('user')
            .select('-__v')
            .exec(function (err, users) {
                if (err) {
                    reject(err);
                } else {
                    resolve(users);
                }
            })
    });
};

exports.patchLoginAttempt = (id, loginAttemptData) => {
    return new Promise((resolve, reject) => {
        LoginAttempt.findById(id, function (err, loginAttempt) {
            if (err) reject(err);
            for (let i in loginAttemptData) {
                loginAttempt[i] = loginAttemptData[i];
            }
            loginAttempt.save(function (err, updatedLoginAttempt) {
                if (err) return reject(err);
                resolve(updatedLoginAttempt);
            });
        });
    });
};

exports.incrementLoginAttempts = (userId) => {
    return new Promise((resolve, reject) => {
        LoginAttempt.findOneAndUpdate({
            user: userId
        }, {
            $inc: { numberOfAttempts: 1 }
        }, {
            new: true
        }, (err, updatedLoginAttempt) => {
            if (err) {
                reject(err);
            }
            else {
                resolve(updatedLoginAttempt);
            }
        });
    });
};

exports.removeById = (id) => {
    return new Promise((resolve, reject) => {
        LoginAttempt.remove({ _id: id }, (err) => {
            if (err) {
                reject(err);
            } else {
                resolve(err);
            }
        });
    });
};

exports.removeByUserId = (userId) => {
    return new Promise((resolve, reject) => {
        LoginAttempt.findOneAndRemove()
            .populate({
                path: 'user',
                match: { _id: userId }
            }).exec((err, res) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(res);
                }
            });
    });
};
