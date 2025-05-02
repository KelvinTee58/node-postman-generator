# Node Postman Generator Documentation

## 🧠 Project Overview

**Node Postman Generator** is an intelligent conversion tool designed for Node.js developers, automating the entire workflow with a single CLI command:

🔄 Express Routes → 📦 Postman Collection → 🚀 One-Click Debugging

## ✨ Core Features

- **Fully Automated Conversion** - Accurately identifies route configurations like app.get/post/put/delete
- **Intelligent Parameter Mapping**
  - ✅ Path parameters /users/:id → Postman variables {{id}} or use faker data if configured
  - ✅ Query parameters ?page=1 → Auto-populates in Postman Query panel
  - ✅ Body parameters → Auto-fills Postman Body panel
- **Engineering Support**
  - 🧩 Batch processing of multiple route files
  - 📁 Outputs standard Postman v2.1 format

## 📦 Installation

### Global Install (Recommended)

```bash
npm install -g node-postman-generator
```

### Project Install

```bash
npm install node-postman-generator --save-dev
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
| -u, --base-url <url> | Base URL variable     | {{base_url}}              |

## ℹ️ Supported Node.js Frameworks

| Name    | Supported | Production Tested |
| ------- | --------- | ----------------- |
| Express | ✅        | ✅                |
| Koa     | ✅        | ✅                |

## 📝 Annotation Standards

### JSDoc Reference

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

### Parameter Format Differences

1. `name`: Value generated using faker data
2. `[name=defaultValue]`: Uses defaultValue
3. `[name]`: Forced to be empty (no faker used)

### Basic Route Annotation

```javascript
/**
 * @api {get} /users Get user list
 * @apiGroup User
 * @apiParam {Number} [page=1] Page number
 */
router.get("/users", getUserList);
```

### About apiParamGroup

```javascript
/**
 * @api {get} /users Get user list
 * @apiGroup User
 * @apiParam {Number} [page=1] Page number
 * @apiParamGroup [
 *   {"type": "String", "name": "username", "description": "Username"},
 *   {"type": "Number", "name": "phone", "description": "User phone"}
 * ]
 * Path parameters will be replaced in order according to the URL below: /users/:name/:phone/:sex (supports faker/default/empty)
 */
router.get("/users/:name/:phone/:sex", getUserList);
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
2. Custom recognition strategies
3. Support for additional builders to generate JSON for other tools

## 📚 Best Practices

1. **Route Organization**

```bash
src/
├── routes/
│   ├── user.js
│   ├── product.js
│   └── order.js
│   └── ...
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
4. Config file priority < CLI parameters
5. If you mix multiple Nodejs frameworks in a project, this tool may not handle them correctly.

## 🆘 FAQ

### Q1: Why are some routes missing?

A: Verify:

1. Currently only Express and Koa frameworks have been tested, or ensure the default recognition logic applies to your code
2. Make sure no `@postman-skip` tags are present
3. Ensure your route comments follow the required JSDoc format

### Q2: Can I use this with other frameworks or projects?

A: You can submit a feature request or open a `Pull Request` for support in other environments.

## 🛠 Framework Adaptation Guide

### Project Structure

```
project-root/
├── bin/ # CLI Entry
├── src/
│ ├── builder/ # Postman Collection Builder
│ ├── parser/ # Route Parser
│ │ ├── index.js # Main Parser
│ │ └── [framework]/ # Framework-specific Parsers
│ └── index.js # Module Entry
└── test/ # Test Cases
```

### Steps to Add New Framework

1. **Create Parser Directory**  
   Add new folder under `parser/` matching framework name (e.g. `koa/`)

2. **Implement Core Files**

   - `parser.js`: Route parsing logic
   - `comment.js`: JSDoc comment processing

3. **Auto-Detection Mechanism**  
   System will automatically match parser when detecting `require("[framework-name]")`

4. **Testing**  
   Run `npm run test` to verify adaptation

### Supporting Other Postman Versions

1. **Add New Builder**  
   Create new version generator in `builder/` (e.g. `postman3.0.js`)

2. **Testing**  
   Modify test files and run `npm run test` for verification

---

- 📧 **Support**: [GitHub](https://github.com/KelvinTee58/node-postman-generator)
- 🐛 **Issues**: https://github.com/KelvinTee58/node-postman-generator/issues
- 📜 **Changelog**: See [CHANGELOG File](./CHANGELOG.md)
