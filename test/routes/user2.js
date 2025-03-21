const express = require('express');
const router = express.Router();

/**
 * @api {get} /user 获取用户列表
 * @apiName GetUserList333
 * @apiGroup User2
 */
router.get('/user2', (req, res) => {
  res.json({ users: [] });
});

/**
 * @api {post} /user 创建用户
 * @apiName CreateUser333
 * @apiGroup User2
 * @apiParam {String} name 用户名
 */
router.post('/user3', (req, res) => {
  res.status(201).json({ message: 'User created' });
});

module.exports = router;
