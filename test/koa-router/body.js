var router = require('koa-router')();

/**
 * @api {get} /order 获取用户列表
 * @apiName Order
 * @apiGroup order
 */
router.get('/order', (req, res) => {
  res.json({ order: [] });
});

/**
 * @api {post} /orderBodyTest orderBodyTest 默认形式
 * @apiName BodyTest
 * @apiGroup order
 * @apiBody [
 *   {"type": "String", "name": "name", "description": "用户名"},
 *  {"type": "String", "name": "phone", "description": "手机号","defaultValue": "123456789"},
 *  {"type": "String", "name": "sex", "description": "性别"}
 *]
 */
router.post('/orderBodyTest', (req, res) => {
  res.status(201).json({ message: 'User created' });
});

module.exports = router;
