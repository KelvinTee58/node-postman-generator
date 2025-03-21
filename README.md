# Postman Generator Documentation | [中文](README_CN.md)

## 🧠 Project Overview

**Postman Generator** is an intelligent conversion tool designed for Express.js developers, automating the entire workflow with a single CLI command:

🔄 Express Routes → 📦 Postman Collection → 🚀 One-Click Debugging

## ✨ Core Features

- **Fully Automated Conversion** - Accurately identifies route configurations like app.get/post/put/delete
- **Intelligent Parameter Mapping**
  - ✅ Path parameters /users/:id → Postman variables {{id}}
  - ✅ Query parameters ?page=1 → Auto-populates in Postman Query panel
- **Engineering Support**
  - 🧩 Batch processing of multiple route files
  - 📁 Outputs standard Postman v2.1 format

## 📦 Installation

### Global Install (Recommended)

```bash
npm install -g postman-generator
```

### Project Install

```bash
npm install postman-generator --save-dev
```

## 🚀 Quick Start

### Basic Usage

```bash
npx postman-generator -i ./routes -o ./postman/collection2025.json
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

2. **Generated File Example**
   View sample output:
   [generator.test.json](https://github.com/KelvinTee58/node-postman-generator/blob/main/test/generator.test.json)

3. **One-click Import**
   Simply import the generated JSON file in Postman to:

- ✅ Get full API collection structure
- ✅ Avoid manual endpoint setup
- ✅ Preserve all parameter definitions

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

- 📧 **Support**: [GitHub](https://github.com/KelvinTee58/node-postman-generator)
- 🐛 **Issues**: https://github.com/KelvinTee58/node-postman-generator/issues
- 📜 **Changelog**: See CHANGELOG.md
