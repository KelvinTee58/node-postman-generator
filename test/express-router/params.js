const express = require('express');
const router = express.Router();

/**
 * @api {get} / 获取用户列表
 * @apiName params
 * @apiGroup params
 */
router.get('/params', (req, res) => {
  res.json({ paramss: [] });
});

/**
* @postman-skip 
 * @api {get} /postmanskip
 * @apiName params
 * @apiGroup params
 */
router.get('/postman_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx_skip', (req, res) => {
  res.json({ paramss: [] });
});


/**
 * @api {post} /paramsTestDefault params  默认形式,自动假数据
 * @apiName paramsTestDefault
 * @apiGroup params
 * @apiParam {String} name 用户名
 */
router.post('/paramsTestDefault/:name', (req, res) => {
  res.status(201).json({ message: 'params created' });
});

/**
 * @api {post} /paramsTestHasDefaultValue params 有默认值
 * @apiName paramsTestHasDefaultValue
 * @apiGroup params
 * @apiParam {String} [name=Mike] 用户名
 */
router.post('/paramsTestHasDefaultValue/:name', (req, res) => {
  res.status(201).json({ message: 'params created' });
});

/**
 * @api {post} /paramsTestNotDefaultValue params Force no default value 强制无默认值
 * @apiName paramsTestNotDefaultValue
 * @apiGroup params
 * @apiParam {String} [name] 用户名
 */
router.post('/paramsTestNotDefaultValue/:name', (req, res) => {
  res.status(201).json({ message: 'params created' });
});

/**
 * @api {post} /paramsGroupTest paramsGroupSingle单行测试
 * @apiName paramsGroupTest
 * @apiGroup params
 * @apiParamGroup [{"type": "String", "name": "name", "description": "用户名"},{"type": "String", "name": "phone", "description": "手机号", "optional": true, "defaultValue": "123456789"},{"type": "String", "name": "sex", "description": "性别", "optional": true}
 *]
 */
router.post('/paramsGroupTest/:name/:phone/:sex', (req, res) => {
  res.status(201).json({ message: 'params created' });
});

/**
 * @api {post} /paramsGroupMultiLine params Group MultiLine 多行参数测试
 * @apiName paramsGroupMultiLine
 * @apiGroup params
 * @apiParamGroup [
 *   {"type": "String", "name": "name", "description": "用户名"},
 *  {"type": "String", "name": "phone", "description": "手机号", "optional": true, "defaultValue": "123456789"},
 *  {"type": "String", "name": "sex", "description": "性别", "optional": true, "defaultValue": ""}
 *]
 */
router.post('/paramsGroupMultiLine/:name/:phone/:sex', (req, res) => {
  res.status(201).json({ message: 'params created' });
});


module.exports = router;
