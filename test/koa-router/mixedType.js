var router = require('koa-router')();

/**
 * @api {post} /mixedTypeTest 混合多行参数测试
 * @apiName mixedTypeTest
 * @apiGroup mixedType
 * @apiParamGroup [
 *   {"type": "String", "name": "name", "description": "用户名"}
 *]
 * @apiQueryGroup [
 *  {"type": "String", "name": "phone", "description": "手机号", "optional": true, "defaultValue": "123456789"}
 *]
* @apiBody [
 *  {"type": "String", "name": "sex", "description": "性别"}
 *]
 */
router.post('/mixedTypeTest/:name', (req, res) => {
  res.status(201).json({ message: 'User created' });
});


module.exports = router;
