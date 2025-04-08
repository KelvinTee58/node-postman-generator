/* @postman-skip-file */
var express = require("express");
var router = express.Router();
const models = require("../models");
const send = require("../common/send");
const { Op } = require("sequelize");


/**
 * @api {get} /user 获取用户列表
 * @apiName GetUserList
 * @apiGroup User
 */
router.get('/ignore', (req, res) => {

});

