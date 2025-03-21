const express = require('express');
const router = express.Router();

/**
 * @api {get} /user 获取用户列表
 * @apiName GetUserList
 * @apiGroup User
 */
router.get('/user', (req, res) => {
  res.json({ users: [] });
});

/**
 * @api {post} /user 创建用户
 * @apiName CreateUser
 * @apiGroup User
 * @apiParam {String} name 用户名
 */
router.post('/user', (req, res) => {
  res.status(201).json({ message: 'User created' });
});

module.exports = router;
