/**
 * @author Thien Nguyen (1453045@student.hcmus.edu.vn)
 * @description This is the main entry point of P2P Lending service setting up server, database
 */

/*eslint-disable no-unused-vars */
const settingEnv = require('./config');
const settingDB = require('./data/config/mongoose');
const interfaces = require('./interfaces');

const express = require('express');
const bodyParser = require('body-parser');

//Create server
const app = express();

app.use(bodyParser.json());
app.use('/', interfaces);

app.listen(process.env.PORT, () => {
	console.log(`Server is listening at port ${process.env.PORT}`);
});

module.exports = { app };
