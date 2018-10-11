/**
 * @description This file contains all autheticate function 
 * 1. Sign Up
 * 2. Sign In
 * 3. Confirmation
 * 4. Sign Out
 */

const Constant = require('./../../data/constant');
const Helpers = require('./../../utils/helpers');
const Hyperledger = require('./../connectors/Hyperledger');
const Messages = require('./../../data/messages.json');
const Twilio = require('./../connectors/Twilio');
const { HTTPRequest, HTTPResponse } = require('./../adapters');
const { recoverUserCard } = require('./../middlewares/BlockchainMiddlewares');
const { Registers } = require('./../../data/model/Registers');
const { Users } = require('./../../data/model/Users');
const { UserDetails } = require('./../../data/model/UserDetails');
const { UserTxs } = require('./../../data/model/UserTransaction');

const ConfirmController = (req, res) => {
	const feature = Helpers.createFeature('confirm');

	const inputCode = req.body.code;
    const userData = HTTPRequest.convertReqBody(feature, req.body);
	
	return Users.checkExistByPhone(userData.phone)
		.then((phoneExist) => {
			if (phoneExist) { return Promise.reject(Messages.users.existPhone); }

			return Registers.checkCorrectCode(userData.phone, inputCode);
		})
		.then((correctCode) => {
			if (!correctCode) { return Promise.reject(Messages.registers.incorrectCode); }
			const user = new Users(userData);

			return user.generateAuthToken();		
		})
		.then((newUser) => HTTPResponse.sendData(res, 
			feature, Constant.successResCode, newUser.token, newUser)) 
		.catch((e) => HTTPResponse.sendError(res, Constant.badReqCode, e));
};

const LenderSignInController = (req, res, data) => {
	const feature = Helpers.createFeature('lendersignin');
	let resBody;

	if (data.checkHLConnected()) {
		return Hyperledger.findInvestByStatus(data, Constant.investStatus.success)
			.then((invest) => {
				resBody = data.toJSON();
				resBody.invest = invest;

				if (invest && invest.length > 0) {
					return UserTxs.findByUserId(data._id)
						.then((userTx) => {
							resBody.invest = invest.map((item) => {
								item.txId = userTx.findTxByloanId(item.loanId).id;
	
								return item;
							});
	
							return HTTPResponse.sendData(res, 
								feature, Constant.successResCode, data.token, resBody);
						})
						.catch((e) => Promise.reject(e));
				}

				return HTTPResponse.sendData(res, 
					feature, Constant.successResCode, data.token, resBody);
			})
			.catch(e => Promise.reject(e));
	}

	return HTTPResponse.sendData(res, feature, Constant.successResCode, data.token, data);
};

const BorrowerSignInController = (req, res, data) => {
	const feature = Helpers.createFeature('borrowersignin');
	const { investingStageDay } = Constant;
	const resBody = data.toJSON();

	const task1 = new Promise((resolve, reject) => {
		if (data.checkDeclaredUserDetail()) {
			return UserDetails.findById(data.detail._id)
				.then((userDetail) => {
					resBody.detail = userDetail;
					resBody.detail.declared = true;

					return resolve();
				})
				.catch(e => reject(e));
		}

		return resolve();
	});

	const task2 = new Promise((resolve, reject) => {
		if (data.checkHLConnected()) {
			return Hyperledger.findLoanByStatus(data, Constant.loanStatus.current)
				.then((loanContract) => {
					if (loanContract && loanContract.length > 0) {
						resBody.loan = loanContract[0];	

						return UserTxs.findByUserId(data._id)
							.then((userTx) => {
								resBody.loan.txId = userTx.findLastestTx().id;

								if (loanContract[0].status === Constant.loanStatus.waiting) {
									const investingDateArr = Array(investingStageDay + 1)
										.fill(0).map((item, index) => {
											const startDate = new Date(loanContract[0].info.createdDate);
		
											startDate.setDate(startDate.getDate() + index);
											startDate.setHours(0);
											startDate.setMinutes(0);
											startDate.setSeconds(0);
											startDate.setMilliseconds(0);
									
											return startDate;
										});
		
									return Hyperledger.calculateInvestedNotesByDate(loanContract[0].contractId,
										investingDateArr)
										.then((payload) => {
											if (resBody.loan.status === Constant.loanStatus.waiting) {
												resBody.loan.investedNotes = payload.investedNotes;
												resBody.investedDate = payload.investedNotesByDate;
											}
		
											return resolve();
										})
										.catch(e => reject(e));
								}
								
								if (loanContract[0].status === Constant.loanStatus.success) {
									return Hyperledger.findSettlementByLoanId(loanContract[0].contractId)
										.then((settlementList) => {
											resBody.settlement = settlementList;
											
											return resolve();
										})
										.catch(e => reject(e));
								}
							})
							.catch(e => reject(e));
					}

					return resolve();
				})
				.catch(e => reject(e));
		}
				
		return resolve();
	});

	return Promise.all([task1, task2])
		.then(() => HTTPResponse.sendData(res, feature, Constant.successResCode, data.token, resBody))
		.catch((e) => HTTPResponse.sendError(res, Constant.badReqCode, e));
};

const SignInController = (req, res) => {
	const feature = Helpers.createFeature('signin');

	let data;
	const userData = HTTPRequest.convertReqBody(feature, req.body);

	return Users.findByField(userData.phone, userData.password)
		.then((user) => user.generateAuthToken())
		.then((newUser) => {
			data = newUser;	
			
			return recoverUserCard(data);
		})
		.then(() => {
			if (data.checkCategory(Constant.borrowerRegex)) {
				return BorrowerSignInController(req, res, data);
			}

			return LenderSignInController(req, res, data);
		})
		.catch((e) => HTTPResponse.sendError(res, Constant.badReqCode, e));
};

const SignOutController = (req, res) => {
	const feature = Helpers.createFeature('signout');

	const user = req.user;

	return user.removeAuthToken()
		.then(() => HTTPResponse.sendData(res, feature, Constant.successResCode, null, null))
		.catch((e) => HTTPResponse.sendError(res, Constant.badReqCode, e));
};

const SignUpController = (req, res) => {
	const feature = Helpers.createFeature('signup');

    const regData = HTTPRequest.convertReqBody(feature, req.body);
	
	return Users.checkExistByPhone(regData.phone)
		.then((phoneExist) => {
			if (phoneExist) { return Promise.reject(Messages.users.existPhone); }

			return Registers.checkRegisterExist(regData.phone);
		})
		.then((regExist) => {
			if (regExist) { return Registers.findByField(regData.phone); }

			const reg = new Registers(regData);

			return Promise.resolve(reg);
		})
		.then((reg) => reg.save())
		.then((newReg) => Twilio.verifyPhoneNumber(newReg.phone, newReg.code))
		.then((smsID) => {
			if (smsID) { 
				return HTTPResponse.sendData(res, feature, Constant.successResCode, null, null); 
			}	

			return HTTPResponse.sendError(res, Constant.serverErrCode, Messages.common.verifyingErr);
		}) 
		.catch((e) => HTTPResponse.sendError(res, Constant.badReqCode, e));
};

module.exports = {
	ConfirmController,
    SignUpController,
	SignInController,
	SignOutController,
};
