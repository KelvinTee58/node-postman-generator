# Node Postman Generator 使用文档

## 🧠 项目概述

**Node Postman Generator** 是专为 Node.js 开发者打造的智能转换工具，通过一条 CLI 指令自动完成以下工作：

🔄 Express 路由 → 📦 Postman 集合 → 🚀 一键调试

## ✨ 核心优势

- **全自动转换** - 精准识别路由文件中的 app.get/post/put/delete 等配置
- **参数智能映射**
  - ✅ 路径参数 /users/:id → Postman 变量 {{id}}或者根据设置的 faker 数据
  - ✅ 查询参数 ?page=1 → Postman Query 面板自动填充
  - ✅ 请求体参数 存储在 body 中 → Postman Body 面板中填充
- **工程化支持**
  - 🧩 支持多路由文件批量处理
  - 📁 输出标准 Postman v2.1 格式

## 📦 安装指南

### 全局安装（推荐）

```bash
npm install -g node-postman-generator
```

### 项目内安装

```bash
npm install node-postman-generator --save-dev
```

## 🚀 快速开始

### 基础使用

```bash
npx postman-generator -i ./routes -o ./postman/collection2025.json
```

## 🔧 配置选项

### 命令行参数

| 参数                 | 说明          | 默认值                    |
| -------------------- | ------------- | ------------------------- |
| -i, --input <path>   | 路由文件目录  | ./routes                  |
| -o, --output <path>  | 输出文件路径  | ./postman/collection.json |
| -u, --base-url <url> | 基础 URL 变量 | {{base_url}}              |

## ℹ️ 支持的 Node.js 框架

| 名称    | 是否支持 | 实际项目测试 |
| ------- | -------- | ------------ |
| Express | ✅       | ✅           |
| Koa     | ✅       | ✅           |

## 📝 注释规范

### JSDoc 参考

```javascript
/**
 * @apiParam {Number} name Description
 * @apiParam {Number} [name=defaultValue]
 * @apiParam {String} [name] Description
 */

/**
 * @apiParamGroup [
 *   {"type": "String", "name": "username", "description": "Username"},
 *   {"type": "Number", "name": "age", "description": "User age"}
 * ]
 */
```

```javascript
/**
 * @apiQuery {Number} name Description
 * @apiQuery {Number} [name=defaultValue]
 * @apiQuery {String} [name] Description
 */

/**
 * @apiQueryGroup [
 *   {"type": "String", "name": "username", "description": "Username"},
 *   {"type": "Number", "name": "age", "description": "User age", "optional": true}
 * ]
 */
```

```javascript
/**
 * @apiBody [
 *   {"type": "String", "name": "username", "description": "Username"},
 *   {"type": "Number", "name": "age", "description": "User age"}
 * ]
 */
```

### 三种结构区别

1. `name`: 使用的是 faker data 进行数据补充
2. `[name=defaultValue]`:使用的是 defaultValue
3. `[name]`: 强制为空(也不需要 faker data)

### 基础路由注释

```javascript
/**
 * @api {get} /users 获取用户列表
 * @apiGroup User
 * @apiParam {Number} [page=1] 页面数
 */
router.get("/users", getUserList);
```

### 对于 apiParamGroup

```javascript
/**
 * @api {get} /users 获取用户列表
 * @apiGroup User
 * @apiParam {Number} [page=1] 页面数
 * @apiParamGroup [
 *   {"type": "String", "name": "username", "description": "Username"},
 *   {"type": "Number", "name": "phone", "description": "User phone"}
 * ]
 * 路径参数将根据下方 URL 中的 /users/:username/:phone 依次进行替换（支持 faker/default/空值）
 */
router.get("/users/:username/:phone", getUserList);
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
2. 自定义识别策略
3. 支持其他 builder 可以支持其他软件的 Json 结构导入

## 📚 最佳实践

1. **路由组织规范**

```bash
src/
├── routes/
│   ├── user.js     # 用户相关路由
│   ├── product.js  # 商品模块路由
│   └── order.js    # 订单业务路由
│   └── ...
```

2. **生成文件示例**
   查看测试用例文件：
   [generator.test.json](https://github.com/KelvinTee58/node-postman-generator/blob/main/test/generator.test.json)

3. **一键导入功能**
   将生成的 JSON 文件导入 Postman 可实现：

- ✅ 自动生成完整 API 集合结构
- ✅ 免除手动创建请求的繁琐操作
- ✅ 完整保留参数定义和注释说明

## ⚠️ 注意事项

1. 注释必须使用 JSDoc 格式（/\*\* \*/）
2. 路由路径参数需使用冒号语法（:param）
3. 跳过标记需放置在注释块首行
4. 命令行参数的优先级高于配置文件
5. 如果您在一个项目中混用了多个 Nodejs 框架，这个工具可能无法正确处理。

## 🆘 常见问题

### Q1: 为什么某些路由没有生成？

A: 请检查：

1. 目前只测试了 Express,Koa 框架，或者使用 default 识别逻辑进行识别
2. 是否添加了`@postman-skip` 标记
3. 路由注释是否符合规范

### Q2: 支持其他项目?

- 需要支持其他项目可通过联系开发者或者 `Pull Request` 等待管理员通过

## 🆒 如何支持其他框架

### 项目根目录

```
项目根目录/
├── bin/ # CLI入口
├── src/
│ ├── builder/ # Postman集合构建器
│ ├── parser/ # 路由解析器
│ │ ├── index.js # 主解析逻辑
│ │ └── [框架名称]/ # 各框架专用解析器
│ └── index.js # 模块入口
└── test/ # 测试用例
```

### 适配新框架步骤

1. **创建解析目录**  
   在`parser/`下新建与框架同名的文件夹（如`koa/`）

2. **实现核心文件**

   - `parser.js`：路由解析逻辑
   - `comment.js`：注释处理逻辑

3. **自动检测机制**  
   当代码中出现`require("[框架名称]")`时，系统会自动匹配对应解析器

4. **测试验证**  
   通过`npm run test`运行测试用例验证适配效果

### 适配其他 Postman 版本

1. **新增构建器**  
   在`builder/`目录下创建新版生成器（如`postman3.0.js`）

2. **测试验证**  
   修改测试文件后运行`npm run test`进行验证

---

- 📧 **技术支持**：[GitHub](https://github.com/KelvinTee58/node-postman-generator)
- 🐛 **问题反馈**：https://github.com/KelvinTee58/node-postman-generator/issues
- 📜 **更新日志**：参见 [CHANGELOG File](./CHANGELOG.md)
