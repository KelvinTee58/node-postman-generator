const express = require('express');
const router = express.Router();

// /**
//  * @api {get} / 获取用户列表
//  * @apiName house
//  * @apiGroup house
//  */
// router.get('/house', (req, res) => {
//   res.json({ houses: [] });
// });

// /**
// * @postman-skip 
//  * @api {get} /postmanskip
//  * @apiName house
//  * @apiGroup house
//  */
// router.get('/postman_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx_skip', (req, res) => {
//   res.json({ houses: [] });
// });


/**
 * @api {post} /querysTestDefault
 * @apiName querysTestDefault
 * @apiGroup house
 * @apiQuery {String} name1 用户名
 */
router.post('/querysTestDefault', (req, res) => {
  res.status(201).json({ message: 'house created' });
});

/**
 * @api {post} /querysTestHasDefaultValue
 * @apiName querysTestHasDefaultValue
 * @apiGroup house
 * @apiQuery {String} [name2=Mike] 用户名
 */
router.post('/querysTestHasDefaultValue', (req, res) => {
  res.status(201).json({ message: 'house created' });
});

/**
 * @api {post} /querysTestNotDefaultValue
 * @apiName querysTestNotDefaultValue
 * @apiGroup house
 * @apiQuery {String} [name3] 用户名
 */
router.post('/querysTestNotDefaultValue', (req, res) => {
  res.status(201).json({ message: 'house created' });
});

/**
 * @api {post} /querysGroupTest 获取用户列表
 * @apiName houseGroupTest
 * @apiGroup house
 * @apiQueryGroup [[{String} name4 用户名],[{String} [phone=123456789] 手机号],[{String} [sex] 性别]]
 */
router.post('/querysGroupTest', (req, res) => {
  res.status(201).json({ message: 'house created' });
});


module.exports = router;
