/**
 * @description This file contain the definition of Modified Business Connection
 */

const TransactionDeclaration = require('composer-common').TransactionDeclaration;
const BusinessNetworkConnection = require('composer-client').BusinessNetworkConnection;
const Util = require('composer-common').Util;

class ModifyBNConnection extends BusinessNetworkConnection {
    /*eslint-disable no-useless-constructor */
    constructor(options) {
        super(options);
    }

    submitTransaction(transaction) {
        const classDeclaration = transaction.getClassDeclaration();

        Util.securityCheck(this.securityContext);
        if (!transaction) {
            throw new Error('transaction not specified');
        }
        if (!(classDeclaration instanceof TransactionDeclaration)) {
            throw new Error(`${classDeclaration.getFullyQualifiedName()} is not a transaction`);
        }

        return Util.createTransactionId(this.securityContext)
            .then((id) => {
                transaction.setIdentifier(id.idStr);
                transaction.timestamp = new Date();

                const data = this.getBusinessNetwork().getSerializer().toJSON(transaction);
                return Util.invokeChainCode(this.securityContext, 'submitTransaction', 
                        [JSON.stringify(data)], { transactionId: id.id })
                    .then(() => Promise.resolve(id));
            });
    }
}

module.exports = ModifyBNConnection;
