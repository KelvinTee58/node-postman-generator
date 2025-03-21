# Postman Genius 使用文档 | [English](README.md)

## 🧠 项目概述

**Postman Genius** 是专为 Express.js 开发者打造的智能转换工具，通过一条 CLI 指令自动完成以下工作：

🔄 Express 路由 → 📦 Postman 集合 → 🚀 一键调试

## ✨ 核心优势

- **全自动转换** - 精准识别路由文件中的 app.get/post/put/delete 等配置
- **参数智能映射**
  - ✅ 路径参数 /users/:id → Postman 变量 {{id}}
  - ✅ 查询参数 ?page=1 → Postman Query 面板自动填充
- **工程化支持**
  - 🧩 支持多路由文件批量处理
  - 📁 输出标准 Postman v2.1 格式

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

1. **路由组织规范**

```bash
src/
├── routes/
│   ├── user.js     # 用户相关路由
│   ├── product.js  # 商品模块路由
│   └── order.js    # 订单业务路由
```

2. **生成文件示例**
   查看测试用例文件：
   [generator.test.json](https://github.com/KelvinTee58/node-postman-genius/blob/main/test/generator.test.json)

3. **一键导入功能**
   将生成的 JSON 文件导入 Postman 可实现：

- ✅ 自动生成完整 API 集合结构
- ✅ 免除手动创建请求的繁琐操作
- ✅ 完整保留参数定义和注释说明

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

- 📧 **技术支持**：[GitHub](https://github.com/KelvinTee58/node-postman-genius)
- 🐛 **问题反馈**：https://github.com/KelvinTee58/node-postman-genius/issues
- 📜 **更新日志**：参见 CHANGELOG.md
