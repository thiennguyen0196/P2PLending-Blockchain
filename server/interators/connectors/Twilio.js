/**
 * @description This file contains the implementation of Twillo Service sending verify Code
 */

const twilio = require('twilio');

const Helpers = require('./../../utils/helpers');

const verifyPhoneNumber = (phone, code) => {
	const { 
		TWILLIO_ACCOUNT_ID, 
		TWILLIO_ACCOUNT_TOKEN, 
		TWILLIO_PHONE_NUMBER 
	} = process.env;

	const Sender = new twilio(TWILLIO_ACCOUNT_ID, TWILLIO_ACCOUNT_TOKEN);

	const reqObj = {
		body: `${code}`,
		from: TWILLIO_PHONE_NUMBER,
		to: Helpers.covertPhone2InterBase(phone)
	};

	return Sender.messages.create(reqObj);
};

module.exports = {
    verifyPhoneNumber
};
