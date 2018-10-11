/**
 * @description This file conatin the definition of User Transaction model
 * This will be synchronizes automatically after invoking chaincode by user
 */

const mongoose = require('mongoose');
const Messages = require('./../messages.json');


const UserTransactionSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        unique: true
    },
    transaction: [{
        entry: {
            type: String,
            required: true,
        },
        loanId: {
            type: mongoose.Schema.Types.ObjectId
        },
        id: {
            type: String,
            required: true
        }
    }]
});

UserTransactionSchema.methods.addLastestTx = function (txData) {
    const instance = this;
    const newTx = {
        entry: txData.entry,
        id: txData.txId,
        loanId: txData.loanId
    };

    if (!instance.transaction) {
        instance.transaction = [];
    }
    instance.transaction.push(newTx);

    return instance.save();
};

UserTransactionSchema.methods.findLastestTx = function () {
    const instance = this;
    let result = {};

    result.id = -1;
    if (instance.transaction && instance.transaction.length > 0) {
        result = instance.transaction[instance.transaction.length - 1];
    }

    return result;
};

UserTransactionSchema.methods.findTxByloanId = function (loanId) {
    const instance = this;
    let result = {};

    result.id = -1;
    if (instance.transaction && instance.transaction.length > 0) {
        result = instance.transaction.filter(item => item.loanId.toString() === loanId);

        if (result && result.length > 0) {
            result = result[result.length - 1];
        }
    }

    return result;
};

//Static method 
UserTransactionSchema.statics.checkExistByUserId = function (userId) {
    const instance = this;

    return instance.findOne({ userId })
        .then((userTx) => {
            if (!userTx) { 
                return Promise.resolve(false); 
            }

            return Promise.resolve(true);
        });
};

UserTransactionSchema.statics.findByUserId = function (userId) {
    const instance = this;

    return instance.findOne({ userId })
        .then((userTx) => {
            if (!userTx) {
                return Promise.reject(Messages.common.internalErr);
            }

            return Promise.resolve(userTx);
        });
};

const UserTxs = mongoose.model('UserTxs', UserTransactionSchema);

module.exports = {
    UserTxs
};
