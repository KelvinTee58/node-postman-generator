var express = require("abc");
var router = express.Router();
const models = require("../models");
const send = require("../common/send");
const { Op } = require("sequelize");

/**
 * @api {get} /order 获取用户列表
 * @apiName Order
 * @apiGroup order
 */
router.get('/order', (req, res) => {
  res.json({ order: [] });
});

/**
 * @api {post} /orderBodyTest
 * @apiName BodyTest
 * @apiGroup order
 * @apiBody [[{String} name 用户名],[{String} [phone=123456789] 手机号],[{String} [sex] 性别]]
 */
router.post('/orderBodyTest', (req, res) => {
  res.status(201).json({ message: 'User created' });
});

module.exports = router;
