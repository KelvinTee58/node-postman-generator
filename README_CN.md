# Postman Genius 使用文档 | [English](README.md)

## 📦 安装指南

### 全局安装（推荐）

```bash
npm install -g postman-genius
```

### 项目内安装

```bash
npm install postman-genius --save-dev
```

## 🚀 快速开始

### 基础使用

```bash
npx postman-genius -i ./routes -o ./postman/collection2025.json
```

## 🔧 配置选项

### 命令行参数

| 参数                 | 说明          | 默认值                    |
| -------------------- | ------------- | ------------------------- |
| -i, --input <path>   | 路由文件目录  | ./routes                  |
| -o, --output <path>  | 输出文件路径  | ./postman/collection.json |
| -b, --base-url <url> | 基础 URL 变量 | {{base_url}}              |

## 📝 注释规范

### 基础路由注释

```javascript
/**
 * @api {get} /users 获取用户列表
 * @apiGroup User
 * @apiParam {Number} [page=1] 页码
 * @apiHeader {String} X-Request-ID 请求唯一标识
 * @apiBody {Object} filter 过滤条件
 */
router.get("/users", getUserList);
```

### 跳过路由生成

```javascript
/**
 * @api {get} /health 健康检查
 * @postman-skip <-- 添加此标记跳过生成
 */
app.get("/health", healthCheck);
```

### 跳过文件生成

```javascript
/* @postman-skip-file */
/**
 * @api {get} /health 健康检查
 */
app.get("/health", healthCheck);
```

## 🛠 待实现高级功能

1. 根据配置文件 (.postmancfg.json)进行配置
2. 支持多种框架
3. 自定义识别策略

## 📚 最佳实践

1. **路由组织**

```bash
src/
├── routes/
│   ├── user.js
│   ├── product.js
│   └── order.js
```

## ⚠️ 注意事项

1. 注释必须使用 JSDoc 格式（/\*\* \*/）
2. 路由路径参数需使用冒号语法（:param）
3. 跳过标记需放置在注释块首行
4. 配置文件的优先级高于命令行参数

## 🆘 常见问题

### Q1: 为什么某些路由没有生成？

A: 请检查：

1. 目前只测试了 Express 框架
2. 是否添加了@postman-skip 标记
3. 路由注释是否符合规范

### Q3: 支持哪些框架？

- Express

---

📧 **技术支持**：[GitHub](https://github.com/KelvinTee58/node-postman-genius)
🐛 **问题反馈**：https://github.com/KelvinTee58/node-postman-genius/issues
📜 **更新日志**：参见 CHANGELOG.md

---
