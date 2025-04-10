const express = require('express');
const router = express.Router();

/**
 * @api {get} / 获取用户列表
 * @apiName house
 * @apiGroup house
 */
router.get('/house', (req, res) => {
  res.json({ houses: [] });
});

/**
* @postman-skip 
 * @api {get} /postmanskip
 * @apiName house
 * @apiGroup house
 */
router.get('/postman_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx_skip', (req, res) => {
  res.json({ houses: [] });
});


/**
 * @api {post} /queryTestDefault
 * @apiName queryTestDefault
 * @apiGroup house
 * @apiQuery {String} name 用户名
 */
router.post('/queryTestDefault', (req, res) => {
  res.status(201).json({ message: 'house created' });
});

/**
 * @api {post} /queryTestHasDefaultValue
 * @apiName queryTestHasDefaultValue
 * @apiGroup house
 * @apiQuery {String} [name=Mike] 用户名
 */
router.post('/queryTestHasDefaultValue', (req, res) => {
  res.status(201).json({ message: 'house created' });
});

/**
 * @api {post} /queryTestNotDefaultValue
 * @apiName queryTestNotDefaultValue
 * @apiGroup house
 * @apiQuery {String} [name] 用户名
 */
router.post('/queryTestNotDefaultValue', (req, res) => {
  res.status(201).json({ message: 'house created' });
});

/**
 * @api {post} /queryGroupTest 获取用户列表
 * @apiName houseGroupTest
 * @apiGroup house
 * @apiQueryGroup [[{String} name 用户名],[{String} [phone=123456789] 手机号],[{String} [sex] 性别]]
 */
router.post('/queryGroupTest', (req, res) => {
  res.status(201).json({ message: 'house created' });
});


module.exports = router;
