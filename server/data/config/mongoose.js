/**
 * @description This file sets up Mongo Database basing on node environment 
 */

const mongoose = require('mongoose');

mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGODB_URI);

module.exports = { mongoose };
