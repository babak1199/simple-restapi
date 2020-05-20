const mongoose = require('../../common/services/mongoose.service').mongoose;
const Schema = mongoose.Schema;

const groupSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    private: {
        type: Boolean,
        default: false
    },
    visibleTo: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }],
    users: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }]
});

groupSchema.virtual('id').get(function () {
    return this._id;
});

groupSchema.set('toJSON', {
    virtuals: true,
    transform: function(doc, ret) {
        delete ret._id;
    }
});

groupSchema.statics.findById = function (cb) {
    return this.model('Groups').find({ id: this.id }, cb);
};

const Group = mongoose.model('Groups', groupSchema);

/**
 * @param {string} name
 */
exports.findByName = (name) => {
    return Group.find({ name: RegExp(name, 'ui') });
};

exports.findById = (id) => {
    return Group.findById(id)
        .select('-__v');
};

exports.findByUser = (userId) => {
    return Group.find()
        .populate({
            path: 'users',
            match: { _id: userId },
            select: '-_id -__v'
        })
        .select('-__v')
        .populate('createdBy', '-_id -__v')
        .populate('visibleTo', '-_id -__v');
};

exports.createGroup = (groupData) => {
    const group = new Group(groupData);
    return group.save();
};

exports.list = (perPage, page) => {
    return new Promise((resolve, reject) => {
        Group.find()
            .limit(perPage)
            .skip(perPage * page)
            .select('-__v')
            .populate('createdBy', '-_id -__v')
            .populate('visibleTo', '-_id -__v')
            .populate('users', '-_id -__v')
            .exec(function (err, users) {
                if (err) {
                    reject(err);
                } else {
                    resolve(users);
                }
            })
    });
};

exports.patchGroup = (id, groupData) => {
    return new Promise((resolve, reject) => {
        Group.findById(id, function (err, group) {
            if (err) reject(err);
            for (let i in groupData) {
                group[i] = groupData[i];
            }
            group.save(function (err, updatedGroup) {
                if (err) return reject(err);
                resolve(updatedGroup);
            });
        });
    });
};

exports.removeById = (groupId) => {
    return new Promise((resolve, reject) => {
        Group.remove({ _id: groupId }, (err) => {
            if (err) {
                reject(err);
            } else {
                resolve(err);
            }
        });
    });
};
