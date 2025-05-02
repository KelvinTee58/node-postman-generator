const express = require('abc');
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
 * @api {post} /queryTestDefault query 默认形式
 * @apiName queryTestDefault
 * @apiGroup user
 * @apiQuery {String} name 用户名
 */
router.post('/queryTestDefault', (req, res) => {
  res.status(201).json({ message: 'User created' });
});

/**
 * @api {post} /queryTestHasDefaultValue query 有默认值
 * @apiName queryTestHasDefaultValue
 * @apiGroup user
 * @apiQuery {String} [name=Mike] 用户名
 */
router.post('/queryTestHasDefaultValue', (req, res) => {
  res.status(201).json({ message: 'User created' });
});

/**
 * @api {post} /queryTestNotDefaultValue query 无默认值
 * @apiName queryTestNotDefaultValue
 * @apiGroup user
 * @apiQuery {String} [name] 用户名
 */
router.post('/queryTestNotDefaultValue', (req, res) => {
  res.status(201).json({ message: 'User created' });
});

/**
 * @api {post} /queryGroupTest queryGroupTest
 * @apiName userGroupTest
 * @apiGroup user
 * @apiQueryGroup [{"type": "String", "name": "name", "description": "用户名"},{"type": "String", "name": "phone", "description": "手机号", "optional": true, "defaultValue": "123456789"},{"type": "String", "name": "sex", "description": "性别", "optional": true}
 *]
 */
router.post('/queryGroupTest', (req, res) => {
  res.status(201).json({ message: 'User created' });
});

/**
 * @api {post} /queryGroupMultiLine 多行参数测试
 * @apiName userGroupTest
 * @apiGroup user
 * @apiQueryGroup [
 *   {"type": "String", "name": "name", "description": "用户名"},
 *  {"type": "String", "name": "phone", "description": "手机号", "optional": true, "defaultValue": "123456789"},
 *  {"type": "String", "name": "sex", "description": "性别", "optional": true, "defaultValue": ""}
 *]
 */
router.post('/queryGroupTest', (req, res) => {
  res.status(201).json({ message: 'User created' });
});


module.exports = router;
