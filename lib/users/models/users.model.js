const mongoose = require('../../common/services/mongoose.service').mongoose;
const Schema = mongoose.Schema;
const mongooseHelper = require('../../common/helpers/mongoose.helper');

const userSchema = new Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: false
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true,
        select: false
    },
    permissionLevel: {
        type: Number,
        required: false
    },
    verified: {
        type: Boolean,
        required: false
    },
    createdDate: {
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

mongooseHelper.addVirtualId(userSchema, 'Users');

userSchema.virtual('fullName')
    .get(function() { return `${this.firstName} ${this.lastName}`; })
    .set(/**
         * @param {string} v
         */
        function(v) {
            const firstName = v.substring(0, v.indexOf(' '));
            const lastName = v.substring(v.indexOf(' ') + 1);
            this.set({ firstName, lastName });
        });

const User = mongoose.model('Users', userSchema);


exports.findByEmail = (email) => {
    return User.find({email: email}).select('+password');
};

exports.findById = (id) => {
    return User.findById(id)
        .select('-__v');
};

exports.createUser = (userData) => {
    const user = new User(userData);
    return user.save();
};

exports.list = (perPage, page) => {
    return new Promise((resolve, reject) => {
        User.find()
            .limit(perPage)
            .skip(perPage * page)
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

exports.patchUser = (id, userData) => {
    return new Promise((resolve, reject) => {
        User.findById(id, function (err, user) {
            if (err) reject(err);
            for (let i in userData) {
                user[i] = userData[i];
            }
            user.save(function (err, updatedUser) {
                if (err) return reject(err);
                resolve(updatedUser);
            });
        });
    })

};

exports.removeById = (userId) => {
    return new Promise((resolve, reject) => {
        User.remove({_id: userId}, (err) => {
            if (err) {
                reject(err);
            } else {
                resolve(err);
            }
        });
    });
};
