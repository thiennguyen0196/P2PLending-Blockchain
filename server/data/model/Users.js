/**
 * @description This file conatin the definition of User entity/model
 */

const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const _ = require('lodash');

const Constant = require('../constant');
const Helpers = require('./../../utils/helpers');
const Messages = require('./../messages.json');

const UserSchema = new mongoose.Schema({
    phone: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        minlength: 10,
        validate: {
            validator: (p) => {
                const regObj = Constant.phoneRegex;

                return regObj.test(p);
            },
            message: Messages.users.incorrectPhone
        }
    },
    password: {
        type: String,
        required: true,
        trim: true,
        minlength: 6,
    },
    connectedHL: {
        type: String,
    },
    certificateHL: {
        type: String
    },
    privateKey: {
        type: String
    },
    category: {
        type: String,
        required: true,
        trim: true,
        minlength: 6,
        validate: {
            validator: (category) => {
                const regObj = Constant.userCategoryRegex;

                return regObj.includes(category);
            },
            message: Messages.users.incorrectCategory
        }
    },
    detail: {
        declared: {
            type: Boolean,
            default: false,
            required: true
        },
        _id: {
            type: mongoose.Schema.Types.ObjectId,
            required: false
        }
    },
    token: {
        type: String,
        required: false
    }
});

// Instance methods
UserSchema.methods.checkCategory = function (type) {
    const instance = this;

    return instance.category === type;
};

UserSchema.methods.checkDeclaredUserDetail = function () {
    const instance = this;

    return instance.detail.declared;
};

UserSchema.methods.checkHLConnected = function () {
    const instance = this;

    if (instance.connectedHL) {
        return true;
    }

    return false;
};

UserSchema.methods.connectUserDetail = function (detailId) {
    const instance = this;

    instance.detail.declared = true;
    instance.detail._id = detailId;

    return instance.save();
};

UserSchema.methods.connectHLIdentity = function (userSecret, certificate, privateKey) {
    const instance = this;

    instance.connectedHL = userSecret;
    instance.certificateHL = certificate;
    instance.privateKey = privateKey;

    return instance.save();
};

UserSchema.methods.generateAuthToken = function () {
    const instance = this;
    const newToken = jwt.sign(
        { 
            _id: instance._id.toHexString(),
            extend: process.env.JWT_EXTEND_PAYLOAD
        }, 
        process.env.JWT_AUTH).toString();

    instance.token = newToken;

    return instance.save();
};

UserSchema.methods.removeAuthToken = function () {
    const instance = this;

    instance.token = '';

    return instance.save();
};

UserSchema.methods.toJSON = function () {
    const instance = this;

    const user = instance.toObject();
    const userObj = _.pick(user, ['_id', 'phone', 'category', 'detail']);

    return userObj;
};

//Static Methods
UserSchema.statics.checkExistByPhone = function (phone) {
    const instance = this;

    return instance.findOne({ 
            $or: [
                { phone: Helpers.covertPhone2LocalBase(phone) },
                { phone: Helpers.covertPhone2InterBase(phone) }
            ] 
        }).then(user => {
            if (user) { return Promise.resolve(true); }

            return Promise.resolve(false);
        })
        .catch((e) => Promise.reject(e));
};

UserSchema.statics.findByField = function (phone, password) {
    const instance = this;

    return instance.findOne({ 
            $or: [
                { phone: Helpers.covertPhone2LocalBase(phone) },
                { phone: Helpers.covertPhone2InterBase(phone) }
            ] 
        }).then(user => {
            if (!user) { return Promise.reject(Messages.users.incorrectAcc); }

            return new Promise((resolve, reject) => {
                bcrypt.compare(password, user.password, (err, res) => {
                    res ? resolve(user) : reject(Messages.users.incorrectPass);
                });
            });
        });
};

UserSchema.statics.findByToken = function (token) {
    const instance = this;

    let _id;

    try { 
        _id = jwt.verify(token, process.env.JWT_AUTH);
    } catch (e) {
        return Promise.reject(Messages.common.incorrectTokenErr);
    }

    return instance.findOne({ 
        _id, 
        token 
    }).then(user => {
        if (user) { return Promise.resolve(user); }

        return Promise.reject(Messages.common.incorrectTokenErr);
    });
};

//Middleware Methods
UserSchema.pre('save', function (next) {
    const instance = this;

    if (instance.isModified('password')) {
        bcrypt.genSalt(10, (error, salt) => {
            bcrypt.hash(instance.password, salt, (err, hash) => {
                instance.password = hash;
                next();
            });
        });
    } else {
        next();
    }
});

UserSchema.post('save', (err, user, next) => {
    if (err) {
        next(err);
    } else {
        next(); 
    }
});

const Users = mongoose.model('Users', UserSchema);

module.exports = {
    Users
};
