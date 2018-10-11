/**
 * @description This file contains the definition of Register Model for User Entity
 */

const mongoose = require('mongoose');

const Constant = require('./../constant');
const Messages = require('./../messages.json');
const Helpers = require('./../../utils/helpers');

const RegisterSchema = new mongoose.Schema({
    phone: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        minlength: 10,
        validate: {
            validator: (p) => {
                const regObject = Constant.phoneRegex;
                
                return regObject.test(p);
            },
            message: Messages.users.incorrectPhone
        }
    },
    code: {
        type: String,
        required: false
    }

});

//Static Methods
RegisterSchema.statics.checkCorrectCode = function (phone, code) {
    const instance = this;
   
    return instance.findOne({
            $or: [
                { phone: Helpers.covertPhone2LocalBase(phone), code },
                { phone: Helpers.covertPhone2InterBase(phone), code }
            ]
        })
        .then(register => {
            if (!register) { return Promise.resolve(false); }

            return Promise.resolve(true);
        })
        .catch(e => Promise.reject(e));
};

RegisterSchema.statics.checkRegisterExist = function (phone) {
    const instance = this;

    return instance.findOne({ 
            $or: [
                { phone: Helpers.covertPhone2LocalBase(phone) },
                { phone: Helpers.covertPhone2InterBase(phone) }
            ]  
        })
        .then(register => {
            if (register) {
                return Promise.resolve(true);
            } 

            return Promise.resolve(false);
        });
};

RegisterSchema.statics.findByField = function (phone) {
    const instance = this;

    return instance.findOne({ 
            $or: [
                { phone: Helpers.covertPhone2LocalBase(phone) },
                { phone: Helpers.covertPhone2InterBase(phone) }
            ] 
        }).then(register => {
            if (!register) { return Promise.reject(Messages.registers.incorrectPhone); }

            return Promise.resolve(register);
        }).catch(e => Promise.reject(e));
};

//Middleware Methods
RegisterSchema.pre('save', function (next) {
    const instance = this;
    
    const code = Helpers.generateVerifyCode(Constant.verifyCodeLength);

    instance.code = code;

    next();
});

const Registers = mongoose.model('Register', RegisterSchema);

module.exports = { Registers };
