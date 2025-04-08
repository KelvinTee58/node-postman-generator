const router = require('koa-router')(); // 建议改用 const

/**
 * @api {get} /order 获取用户列表
 * @apiName Order
 * @apiGroup order
 */
router.get('/order', (ctx) => {
  ctx.body = { order: [] }; // 使用 ctx.body 代替 res.json
});

/**
 * @api {post} /orderBodyTest
 * @apiName BodyTest
 * @apiGroup order
 * @apiBody [[{String} name 用户名],[{String} [phone=123456789] 手机号],[{String} [sex] 性别]]
 */
router.post('/orderBodyTest', (ctx) => {
  ctx.status = 201; // 设置状态码
  ctx.body = { message: 'User created' }; // 响应内容
});

module.exports = router;