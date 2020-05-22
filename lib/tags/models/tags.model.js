const mongoose = require('../../common/services/mongoose.service').mongoose;
const Schema = mongoose.Schema;
const mongooseHelper = require('../../common/helpers/mongoose.helper');

const tagSchema = new Schema({

    text: {
        type: String,
        required: true,
        minlength: 2,
        lowercase: true,
        trim: true
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

mongooseHelper.addVirtualId(tagSchema, 'Tags');

var Tag = mongoose.model('Tags', tagSchema);

/**
 * @param {String} text
 */
exports.findByText = (text) => {
    return Tag.findOne({ text: RegExp(text, 'i') });
};

/**
 * @param {String} text
 */
exports.exists = (text) => {
    return Tag.exists({ text: RegExp(text, 'i') });
}

/**
 * @param {any} data
 */
exports.createTag = (data) => {
    const tag = new Tag(data);
    return tag.save();
};

/**
 * @param {number} perPage
 * @param {number} page
 */
exports.list = (perPage, page) => {
    return new Promise((resolve, reject) => {
        Tag.find()
            .limit(perPage)
            .skip(perPage * page)
            .select('-__v')
            .populate('createdBy', '-__v')
            .exec(function (err, users) {
                if (err) {
                    reject(err);
                } else {
                    resolve(users);
                }
            });
    });
};

exports.patchTag = (id, tagData) => {
    return new Promise((resolve, reject) => {
        Tag.findById(id, function (err, tag) {
            if (err) reject(err);
            for (let i in tagData) {
                tag[i] = tagData[i];
            }
            tag.save(function (err, updatedTag) {
                if (err) return reject(err);
                resolve(updatedTag);
            });
        });
    });
};

exports.removeById = (tagId) => {
    return new Promise((resolve, reject) => {
        Tag.remove({ _id: tagId }, (err) => {
            if (err) {
                reject(err);
            } else {
                resolve(err);
            }
        });
    });
};
