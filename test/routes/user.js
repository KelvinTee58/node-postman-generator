const express = require('express');
const router = express.Router();

/**
 * @api {get} / 获取用户列表
 * @apiName User
 * @apiGroup user
 */
router.get('/user', (req, res) => {
  res.json({ users: [] });
});

/**
* @postman-skip 
 * @api {get} /postmanskip
 * @apiName User
 * @apiGroup user
 */
router.get('/postman_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx_skip', (req, res) => {
  res.json({ users: [] });
});


/**
 * @api {post} /paramsTestDefault
 * @apiName paramsTestDefault
 * @apiGroup user
 * @apiParam {String} name 用户名
 */
router.post('/paramsTestDefault/:name', (req, res) => {
  res.status(201).json({ message: 'User created' });
});

/**
 * @api {post} /paramsTestHasDefaultValue
 * @apiName paramsTestHasDefaultValue
 * @apiGroup user
 * @apiParam {String} [name=Mike] 用户名
 */
router.post('/paramsTestHasDefaultValue/:name', (req, res) => {
  res.status(201).json({ message: 'User created' });
});

/**
 * @api {post} /paramsTestNotDefaultValue
 * @apiName paramsTestNotDefaultValue
 * @apiGroup user
 * @apiParam {String} [name] 用户名
 */
router.post('/paramsTestNotDefaultValue/:name', (req, res) => {
  res.status(201).json({ message: 'User created' });
});

/**
 * @api {post} /paramsGroupTest 获取用户列表
 * @apiName userGroupTest
 * @apiGroup user
 * @apiParamGroup [[{String} name 用户名],[{String} [phone=123456789] 手机号],[{String} [sex] 性别]]
 */
router.post('/paramsGroupTest/:name/:phone/:sex', (req, res) => {
  res.status(201).json({ message: 'User created' });
});


module.exports = router;
