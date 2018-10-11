/**
 * @description This file is used to handle schedule API from UpBoot
 */

const express = require('express');

const { onFullFillController } = require('./../interators/controllers/ScheduleControllers');

const schedule = express.Router();

schedule.post('/hlfv1', onFullFillController);

module.exports = schedule;
