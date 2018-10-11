/**
 * @description This file contains definition of UserDetails Model
 */

const mongoose = require('mongoose');
const validator = require('validator');

const Constant = require('./../constant');
const Messages = require('./../messages.json');

const UserDetailSchema = new mongoose.Schema({
    name: {
        type: String,
        required: false
    },  
    birth: {
        type: Date,
        required: false
    },
    sex: {
        type: String,
        required: false,
        trim: true,
        validate: {
            validator: (category) => {
                const regObj = Constant.genderRegex;

                return regObj.includes(category);
            },
            message: Messages.users.incorrectCategory
        }
    },
    email: {
        type: String,
        required: false,
        minlength: 6,
        trim: true,
        validate: {
            validator: validator.isEmail,
            message: '{VALUE} is not a valid email'
        }
    },
    address: {
        type: String,
        required: false
    },
    city: {
        type: String,
        required: false,
    },
    ssn: {
        type: String,
        required: true,
        trim: true,
        minlength: 9,
        validate: {
            validator: (p) => {
                const regObj = Constant.ssnRegex;

                return regObj.test(p);
            },
            message: Messages.userDetails.incorrectSSN
        }
    },
    job: {
        type: String,
        required: true
    },
    income: {
        type: Number,
        required: true
    },
    imageURLs: [String],
    score: {
        type: Number,
        required: false,
        default: Constant.defaultScore
    }
});

//Static Method
UserDetailSchema.statics.findById = function (_id) {
    const instance = this;

    return instance.findOne({ _id })
        .then(userDetail => {
            if (!userDetail) { return Promise.reject(Messages.userDetails.missingDetails); }
            
            return Promise.resolve(userDetail); 
        })
        .catch(e => Promise.reject(e));
};

//Instace Method
UserDetailSchema.methods.findImgURL = function (name) {
    const instance = this;

    const filePath = instance.imageURLs.find(item => item.includes(name));

    if (!filePath) { return Promise.reject(Messages.userDetails.missingFile); }

    return Promise.resolve(filePath);
};

UserDetailSchema.methods.updateInfo = function (data) {
    const instance = this;

    Object.keys(data).forEach((prop) => {
		instance[prop] = data[prop];
	});

    return instance.save();
};

//UserDetail middleware methods
UserDetailSchema.post('save', (err, user, next) => {
    if (err) {
        next(err);
    } else {
        next();
    }
});

//UserDetails model
const UserDetails = mongoose.model('UserDetails', UserDetailSchema);

module.exports = {
    UserDetails
};

