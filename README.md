# Postman Generator Documentation | [中文](README_CN.md)

## 🧠 Project Overview

**Postman Generator** is an intelligent conversion tool designed for Node.js developers, automating the entire workflow with a single CLI command:

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

### JSDoc Reference

```
@apiParam {Number} name Description
@apiParam {Number} [name=defaultValue]
@apiParam {String} [name] Description

@apiParamGroup [[{String} name Description],[{String} [name=defaultValue] Description],[{String} [name] Description]]
@apiBody [[{String} [name=defaultValue] Description],[{String} name Description],[{String} [name] Description]]
```

### Basic Route Annotation

```javascript
/**
 * @api {get} /users Get user list
 * @apiGroup User
 * @apiParam {Number} [page=1] Page number
 * @apiBody [[{String} name username],[{String} [phone=123456789] phoneNumber],[{String} [gender] genderType]]
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
4. Config file priority < CLI parameters
5. If you mix multiple Nodejs frameworks in a project, this tool may not handle them correctly.

## 🆘 FAQ

### Q1: Why are some routes missing?

A: Verify:

1. Currently only tested with Express
2. Presence of @postman-skip tags
3. Route annotation compliance

### Q2: Supported frameworks?

- Express

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
- 📜 **Changelog**: See CHANGELOG.md
