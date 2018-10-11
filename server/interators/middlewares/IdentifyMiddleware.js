/**
 * @description This file contains some useful middleware Functions for identify API
 */

const multer = require('multer');

const Constant = require('./../../data/constant');
const Messages = require('./../../data/messages.json');
const { HTTPResponse } = require('./../adapters');

/*eslint-disable object-shorthand  */
/*eslint-disable prefer-const */
const imgStorage = multer.diskStorage({
    destination: function (req, file, cb) { 
        cb(null, Constant.imageDirPath);
        //cb(null, 'uploads/');
    },
    filename: function (req, file, cb) { 
        cb(null, `${req.user._id}_${file.originalname}`);
    }
});

const imgFilter = (req, file, cb) => {
    if (Constant.imageExt.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(null, false);
    }
};

const CalculateScoreMiddleware = (req, res, next) => {
    if (req.user.checkCategory(Constant.borrowerRegex)) {
        req.score = Constant.defaultScore;

        next();
    } else if (req.user.checkCategory(Constant.lenderRegex)) {
        req.score = 0;

        next();
    } else {
        return HTTPResponse.sendError(res, 
            Constant.badReqCode, Messages.users.incorrectCategory);
    }
};

const HandleImgMiddleware = multer({ 
    storage: imgStorage, 
    fileFilter: imgFilter
});

const EvaluateUserImageMiddleware = (req, res, next) => {
    if (req.user.checkCategory(Constant.borrowerRegex)) {
        if (req.files && req.files.length === Constant.reqImgFiles) {
            const imageURLs = req.files.map(item => item.path);
            console.log(imageURLs);
            
            req.imageURLs = imageURLs;
            
            next();
        } else {
            return HTTPResponse.sendError(res, 
                Constant.badReqCode, Messages.userDetails.missingFile);
        }     
    } else if (req.user.checkCategory(Constant.lenderRegex)) {
        if (req.files) {
            const imageURLs = req.files.map(item => item.path);

            req.imageURLs = imageURLs;

            next();
        }
    } else {
        return HTTPResponse.sendError(res, 
            Constant.badReqCode, Messages.users.incorrectCategory);
    }
};

module.exports = {
    CalculateScoreMiddleware,
    EvaluateUserImageMiddleware,
    HandleImgMiddleware
};
