var mongoose = require('mongoose');
var uuid = require('node-uuid');

var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;

var userSchema = new Schema({
    username: {type: String, required: true, index: {unique: true}},
    apikey: {type: String},
    email: {type: String, required: true},
    active: {type: Boolean, default: false},
    startDate: {type: Date, default: Date.now},
});

userSchema.pre('save', function(next) {
    console.log("PRE SAVE HOOK CALLED");
    var user = this;
    user.apikey = uuid();
    next();
});

module.exports = mongoose.model('User', userSchema);
