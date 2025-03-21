# Postman Genius 使用文档 | [中文](README_CN.md)

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

📧 **技术支持**：postman-genius-support@example.com
🐛 **问题反馈**：https://github.com/yourrepo/issues
📜 **更新日志**：参见 CHANGELOG.md

---

# Postman Genius Documentation | [中文](README_CN.md)

## 📦 Installation

### Global Install (Recommended)

```bash
npm install -g postman-genius
```

### Project Install

```bash
npm install postman-genius --save-dev
```

## 🚀 Quick Start

### Basic Usage

```bash
npx postman-genius -i ./routes -o ./postman/collection2025.json
```

## 🔧 Configuration Options

### CLI Parameters

| Parameter            | Description           | Default Value             |
| -------------------- | --------------------- | ------------------------- |
| -i, --input <path>   | Route files directory | ./routes                  |
| -o, --output <path>  | Output file path      | ./postman/collection.json |
| -b, --base-url <url> | Base URL variable     | {{base_url}}              |

## 📝 Annotation Standards

### Basic Route Annotation

```javascript
/**
 * @api {get} /users Get user list
 * @apiGroup User
 * @apiParam {Number} [page=1] Page number
 * @apiHeader {String} X-Request-ID Request ID
 * @apiBody {Object} filter Filter conditions
 */
router.get("/users", getUserList);
```

### Skip Route Generation

```javascript
/**
 * @api {get} /health Health check
 * @postman-skip <-- Add this tag to skip
 */
app.get("/health", healthCheck);
```

### Skip File Generation

```javascript
/* @postman-skip-file */
/**
 * @api {get} /health Health check
 */
app.get("/health", healthCheck);
```

## 🛠 Pending Advanced Features

1. Configuration via .postmancfg.json
2. Support for multiple frameworks
3. Custom recognition strategies

## 📚 Best Practices

1. **Route Organization**

```bash
src/
├── routes/
│   ├── user.js
│   ├── product.js
│   └── order.js
```

## ⚠️ Important Notes

1. Must use JSDoc format (/\*\* \*/)
2. Route path parameters require colon syntax (:param)
3. Skip tags must be placed in comment block's first line
4. Config file priority > CLI parameters

## 🆘 FAQ

### Q1: Why are some routes missing?

A: Verify:

1. Currently only tested with Express
2. Presence of @postman-skip tags
3. Route annotation compliance

### Q3: Supported frameworks?

- Express

---

📧 **Support**: postman-genius-support@example.com
🐛 **Issues**: https://github.com/yourrepo/issues
📜 **Changelog**: See CHANGELOG.md

---
