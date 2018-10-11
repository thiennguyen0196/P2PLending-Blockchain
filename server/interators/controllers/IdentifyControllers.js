/**
 * @description This file contains all Identify Functions
 */


const Constant = require('./../../data/constant');
const Helpers = require('./../../utils/helpers');
const Messages = require('./../../data/messages.json');
const { HTTPRequest, HTTPResponse } = require('./../adapters');
const { UserDetails } = require('./../../data/model/UserDetails');

const CreateUserInfoController = (req, res) => {
    const feature = Helpers.createFeature('createinfo');

    const userDetailData = HTTPRequest.convertReqBody(feature, req.body);
    const user = req.user;

    userDetailData.imageURLs = req.imageURLs;  
    userDetailData.score = req.score;
    
    if (user.checkDeclaredUserDetail()) {
        return HTTPResponse.sendError(res, Constant.badReqCode, Messages.userDetails.existDetails);
    }

    const userDetail = new UserDetails(userDetailData);

    let data;

    return userDetail.save()
        .then((newUserDetail) => {
            data = newUserDetail;

            return user.connectUserDetail(newUserDetail._id);
        })
        .then(() => HTTPResponse.sendData(res, feature, Constant.successResCode, null, data))
        .catch((e) => HTTPResponse.sendError(res, Constant.badReqCode, e));
};

const GetUserImgController = (req, res) => {
    const feature = Helpers.createFeature('getimg');

    const user = req.user;
    const imgName = req.params.name;

    return UserDetails.findById(user.detail._id)
        .then((userDetail) => userDetail.findImgURL(imgName))
        .then((imgPath) => HTTPResponse.sendData(res, 
            feature, Constant.successResCode, null, imgPath))
        .catch((e) => HTTPResponse.sendError(res, Constant.badReqCode, e));
};

const GetUserInfoController = (req, res) => {
    const feature = Helpers.createFeature('getinfo');

    const user = req.user;

    return UserDetails.findById(user.detail._id)
        .then((data) => HTTPResponse.sendData(res, feature, Constant.successResCode, null, data))
        .catch((e) => HTTPResponse.sendError(res, Constant.badReqCode, e));
};

const UpdateUserInfoController = (req, res) => {
    const feature = Helpers.createFeature('updateinfo');

    const userDetailData = HTTPRequest.convertReqBody(feature, req.body);
    const user = req.user;

    userDetailData.imageURLs = req.imageURLs;  
    userDetailData.score = req.score;

    if (!user.checkDeclaredUserDetail()) {
        return HTTPResponse.sendError(res, 
            Constant.badReqCode, Messages.userDetails.missingDetails);
    }

    return UserDetails.findById(user.detail._id)
        .then((userDetail) => userDetail.updateInfo(userDetailData))
        .then((data) => HTTPResponse.sendData(res, feature, Constant.successResCode, null, data))
        .catch((e) => HTTPResponse.sendError(res, Constant.badReqCode, e));
};

module.exports = {
    CreateUserInfoController,
    GetUserInfoController,
    GetUserImgController,
    UpdateUserInfoController,
};
