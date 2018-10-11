/**
 * @description This file is used to set up API Router handling HTTP Request
 */

const express = require('express');

const Auth = require('./auth');
const Identify = require('./identify');
const Loan = require('./loan');
const Invest = require('./invest');
const Settle = require('./settle');
const Schedule = require('./schedule');

const root = express.Router();

root.use('/auth', Auth);
root.use('/identify', Identify);
root.use('/loan', Loan);
root.use('/invest', Invest);
root.use('/settle', Settle);
root.use('/schedule', Schedule);

module.exports = root;
