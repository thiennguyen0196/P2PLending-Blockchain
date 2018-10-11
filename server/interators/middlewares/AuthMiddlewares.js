/**
 * @description This file contains some useful middleware Functions for authentication API
 */

const Constant = require('./../../data/constant');
const Helpers = require('./../../utils/helpers');
const Messages = require('./../../data/messages.json');
const { HTTPRequest, HTTPResponse } = require('./../adapters');
const { Users } = require('./../../data/model/Users');
const { UserDetails } = require('./../../data/model/UserDetails');

const AuthMiddleware = (req, res, next) => {
	const feature = Helpers.createFeature('authMiddleware');

	const token = HTTPRequest.convertReqBody(feature, req);

	return Users.findByToken(token)
		.then(user => {
			req.user = user;
			req.token = token;

			next();
		})
		.catch((e) => HTTPResponse.sendError(res, Constant.failTokenCode, e));
};

const AuthLenderMiddleware = (req, res, next) => {
	const feature = Helpers.createFeature('authLenderMiddleware');

	const token = HTTPRequest.convertReqBody(feature, req);

	return Users.findByToken(token)
		.then(user => {
			if (!user.checkCategory(Constant.lenderRegex)) {
				return Promise.reject(Messages.common.permissionErr); 
			}

			req.user = user;
			req.token = token;
			req.userDetail = null;

			next();
		})
		.catch((e) => HTTPResponse.sendError(res, Constant.failTokenCode, e));
};

const AuthBorrowerMiddleware = (req, res, next) => {
	const feature = Helpers.createFeature('authBorrowerMiddleware');

	const token = HTTPRequest.convertReqBody(feature, req);

	return Users.findByToken(token)
		.then(user => {
			if (!user.checkCategory(Constant.borrowerRegex)) { 
				return Promise.reject(Messages.common.permissionErr); 
			}

			if (!user.checkDeclaredUserDetail()) { 
				return Promise.reject(Messages.common.missingInfoErr); 
			}

			req.user = user;
			req.token = token;

			return UserDetails.findById(user.detail._id);
		})
		.then(userDetail => {
			req.userDetail = userDetail;

			next();
		})
		.catch((e) => HTTPResponse.sendError(res, Constant.failTokenCode, e));
};

module.exports = {
	AuthBorrowerMiddleware,
	AuthMiddleware,
	AuthLenderMiddleware,
};
