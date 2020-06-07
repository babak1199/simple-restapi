
exports.addVirtualId = function(schema, modelName) {

    schema.virtual('id').get(function () {
        return this._id;
    });

    schema.set('toJSON', {
        virtuals: true,
        transform: function(doc, ret) {
            delete ret._id;
        }
    });

    /**
     * @param {Function} cb Callback function
     */
    schema.statics.findByVirtualId = function (cb) {
        return this.model(modelName).find({ id: this.id }, cb);
    };
};