#!/usr/bin/env node

const acorn = require('acorn');
const walk = require('acorn-walk');
const fs = require('fs');
const path = require('path');
const { program } = require('commander');
const faker = require('faker');

class PostmanGenerator {
  constructor(options) {
    this.options = {
      routesPath: './routes',
      outputFile: './postman/collection.json',
      baseUrl: '{{base_url}}',
      ...options
    };
  }

  async generate() {
    try {
      console.log('🚀 开始生成Postman集合...');

      // 创建输出目录
      fs.mkdirSync(path.dirname(this.options.outputFile), { recursive: true });

      const routes = await this.parseRoutes();
      const collection = this.buildCollection(routes);

      fs.writeFileSync(this.options.outputFile, JSON.stringify(collection, null, 2));
      console.log(`✅ 成功生成Postman集合至：${this.options.outputFile}`);
      console.log(`📊 共生成 ${routes.size} 个API端点`);
    } catch (error) {
      console.error('❌ 生成失败:', error.message);
      process.exit(1);
    }
  }

  async parseRoutes() {
    if (!fs.existsSync(this.options.routesPath)) {
      throw new Error(`路由目录不存在：${this.options.routesPath}`);
    }

    const fileRouteMap = new Map();

    const routeFiles = fs.readdirSync(this.options.routesPath)
      .filter(f => {
        // 跳过非JS文件
        if (!f.endsWith('.js')) return false;

        // 检查文件头排除标记
        const content = fs.readFileSync(
          path.join(this.options.routesPath, f),
          'utf8'
        );
        return !this.hasSkipTag(content);
      })
      .map(f => path.join(this.options.routesPath, f));

    for (const file of routeFiles) {
      console.log(`🔍 正在解析路由文件：${path.basename(file)}`);
      const code = fs.readFileSync(file, 'utf-8');
      const routes = this.parseRouteCode(code);
      fileRouteMap.set(file, routes);
    }

    return fileRouteMap;
  }


  // 增强版路由解析逻辑
  parseRouteCode(code) {
    const comments = [];
    let ast;
    let that = this;

    // 改进的AST解析配置
    try {
      ast = acorn.parse(code, {
        ecmaVersion: 2020,
        locations: true,
        allowHashBang: true,
        onComment: (isBlock, text, start, end) => {
          if (isBlock) {
            const startLine = code.slice(0, start).split('\n').length;
            const endLine = code.slice(0, end).split('\n').length;

            comments.push({
              text: text.replace(/^\s*\* ?/gm, ''), // 清理注释格式
              startLine,
              endLine,
              type: 'jsdoc'
            });
          }
        }
      });
    } catch (e) {
      console.error('AST解析失败:', e.message);
      return [];
    }

    const routes = [];

    // 整合后的路由遍历逻辑
    walk.simple(ast, {
      CallExpression(node) {
        const callee = node.callee;
        let isRoute = false;
        let method = '';

        // 增强路由类型检测
        if (callee.object?.name === 'router' &&
          /^(get|post|put|delete|all)$/i.test(callee.property?.name)) {
          isRoute = true;
          method = callee.property.name.toUpperCase();
        }
        else if (callee.name === 'createRouter') {
          isRoute = true;
          method = 'VUE_ROUTER';
        }

        if (isRoute) {
          const routeLine = node.loc.start.line;
          const path = this._getRoutePath(node.arguments);

          // 智能注释匹配算法
          const relatedComment = comments.find(c =>
            c.endLine >= routeLine - 3 &&
            c.endLine <= routeLine &&
            c.text.includes('@api')
          );
          // 在这里解析注释，并存储在 parseInfo 中
          const parseInfo = that.parseComment(relatedComment?.text) ?? {}

          routes.push({
            method,
            path,
            comment: relatedComment?.text || '',
            loc: node.loc,
            parseInfo
          });
        }
      },

      // 整合的路径提取方法
      _getRoutePath(args) {
        for (const arg of args) {
          // 处理对象式定义 (Vue Router)
          if (arg.type === 'ObjectExpression') {
            const pathProp = arg.properties.find(p =>
              p.key.name === 'path' &&
              p.value.type === 'Literal'
            );
            if (pathProp) return pathProp.value.value;
          }
          // 处理字符串式定义 (Express)
          else if (arg.type === 'Literal' && typeof arg.value === 'string') {
            return arg.value;
          }
        }
        return '';
      }
    });

    // return routes.filter(r => r.path);
    return routes.filter(r => r.path && !r.parseInfo.skip);
  }

  _formatFolderName(filePath) {
    // 示例：将 "src/routes/user.js" 转换为 "User Routes"
    return path.basename(filePath, path.extname(filePath))
      .replace(/([A-Z])/g, ' $1')
      .trim() + ' Routes';
  }

  _buildRequestItem(route) {
    // console.log('route :>> ', route);
    // 原buildCollection中单个请求的构建逻辑
    const { name, group, description, params, headers, body } = route.parseInfo;


    return {
      name: name || `${route.method} ${route.path}`,
      request: {
        method: route.method,
        auth: {
          type: "bearer",
          bearer: [
            {
              "key": "token",
              "value": "{{token}}",
              "type": "string"
            }
          ]
        },
        header: headers.map(h => ({
          key: h.name,
          value: h.description,
          description: h.type
        })),
        body: body ? {
          mode: 'raw',
          options: {
            raw: {
              language: 'json'
            }
          },
          raw: JSON.stringify(
            this.generateExampleBody(body),
            null, 2
          )
        } : undefined,
        url: {
          raw: `${this.options.baseUrl}/${group}${this.processPathParams(route.path, params)}`,
          host: [this.options.baseUrl],
          path: this.parsePathSegments(route.path),
          query: this.generateQueryParams(params)
        },
        description: description
      }
    };
  }

  buildCollection(fileRouteMap) {
    return {
      info: {
        name: "Generated API Collection",
        description: "Automatically generated from route files",
        schema: "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
      },
      item: Array.from(fileRouteMap.entries()).map(([filePath, routes]) => ({
        name: this._formatFolderName(filePath),
        description: `API endpoints in ${path.basename(filePath)}`,
        item: routes.map(route => this._buildRequestItem(route))
      }))
    };
  }

  parseComment(comment) {
    const meta = {
      group: 'Default',
      name: '',
      description: '',
      params: [],
      headers: [],
      body: [],
      skip: false
    };

    (comment || '').split('\n').forEach(line => {
      line = line.replace(/^\s*\*\s?/, '').trim();

      // 跳过标记检测
      if (line === '@postman-skip') {
        meta.skip = true;
      }

      // @api {get} /path Description
      if (line.startsWith('@api')) {
        const match = line.match(/@api\s+{(\w+)}\s+(\S+)\s*(.*)/);
        if (match) {
          meta.method = match[1];
          meta.path = match[2];
          meta.description = match[3] || '';
        }
      }

      // @apiParam {Number} name Description  (必选参数，没有方括号)
      // @apiParam {Number} [name=defaultValue] Description (有方括号和默认值)
      // @apiParam {String} [name] Description (可选参数，只有方括号，没有默认值)
      if (line.startsWith('@apiParam ')) {
        const match = line.match(/@apiParam\s+{(\w+)}\s+(?:\[(\w+)(?:=(\S+))?\]|(\S+))\s+(.*)/);
        if (match) {
          let paramType = match[1];
          let paramName = match[2] || match[4];
          let paramDefaultValue = match[3];
          let paramDescription = match[5];
          let isOptional = !!match[2];

          meta.params.push({
            in: 'query',
            name: paramName,
            type: paramType,
            description: paramDescription,
            defaultValue: paramDefaultValue,
            optional: isOptional
          });
        }
      }


      // @apiParamGroup [[{String} name Description],[{String} name Description]]
      // @apiParamGroup [[{String} [name=defaultValue] Description],[{String} name Description]]
      if (line.startsWith('@apiParamGroup ')) {
        const paramsGroupStr = line.replace(/@apiParamGroup\s+/, "").trim();
        const paramGroups = paramsGroupStr.slice(2, -2).split('],[');

        if (paramGroups) {
          paramGroups.forEach(paramDefStr => {
            // 改进的正则表达式，处理可选参数和默认值
            const paramMatch = paramDefStr.match(/{(\w+)}\s+(?:\[(\w+)(?:=(\S+))?\]|(\S+))\s+(.*)/);
            if (paramMatch) {
              let paramType = paramMatch[1];
              let paramName = paramMatch[2] || paramMatch[4];
              let paramDefaultValue = paramMatch[3];
              let paramDescription = paramMatch[5];
              let isOptional = !!paramMatch[2];

              let paramIn = 'query'; // 默认参数位置
              if (meta.path && meta.path.includes(`:${paramName}`)) {
                paramIn = 'path';
              }

              meta.params.push({
                in: paramIn,
                name: paramName,
                type: paramType,
                description: paramDescription,
                defaultValue: paramDefaultValue, // 添加默认值
                optional: isOptional // 添加 optional 属性
              });
            }
          });
        }
      }


      // @apiHeader {String} Authorization Token description
      if (line.startsWith('@apiHeader')) {
        const match = line.match(/@apiHeader\s+{(\w+)}\s+(\S+)\s+(.*)/);
        if (match) {
          meta.headers.push({
            name: match[2],
            type: match[1],
            description: match[3]
          });
        }
      }

      // @apiBody [[{String} [name=defaultValue] Description],[{String} name Description],[{String} [name] Description]]
      if (line.startsWith('@apiBody')) {
        const bodyParamsStr = line.replace(/@apiBody\s+/, "").trim();
        const bodyParams = bodyParamsStr.slice(2, -2).split('],[');

        if (bodyParams && bodyParams.length > 0) { // 确保有 body 参数定义
          bodyParams.forEach(paramDefStr => {
            const paramMatch = paramDefStr.match(/{(\w+)}\s+(?:\[(\w+)(?:=(\S+))?\]|(\S+))\s+(.*)/);
            if (paramMatch) {
              let paramType = paramMatch[1];
              let paramName = paramMatch[2] || paramMatch[4];
              let paramDefaultValue = paramMatch[3];
              let paramDescription = paramMatch[5];
              let isOptional = !!paramMatch[2];

              meta.body.push({ // 注意这里使用 meta.body
                name: paramName,
                type: paramType,
                description: paramDescription,
                defaultValue: paramDefaultValue,
                optional: isOptional
              });
            }
          });
        }
      }


      // @apiGroup {Object} Group name
      if (line.startsWith('@apiGroup')) {
        meta.group = line.replace('@apiGroup', '').trim();
      }

      // @apiName {Object} api name
      if (line.startsWith('@apiName')) {
        meta.name = line.replace('@apiName', '').trim();
      }

    });

    return meta;
  }

  processPathParams(path, params) {
    return path.split('/').map(segment => {
      if (segment.startsWith(':')) {
        const paramName = segment.slice(1);
        const param = params.find(p => p.name === paramName);
        return param ? `{{${paramName}}}` : segment; // 使用Postman变量格式
      }
      return segment;
    }).join('/');
  }


  parsePathSegments(path) {
    return path.split('/')
      .filter(segment => segment !== '')
      .map(segment => {
        if (segment.startsWith(':')) {
          return `:${segment.slice(1)}`; // 保持Postman路径参数格式
        }
        return segment;
      });
  }


  generateExampleValue(type) {
    const generators = {
      string: () => faker.lorem.word(),
      number: () => faker.datatype.number(),
      boolean: () => faker.datatype.boolean(),
      date: () => faker.date.recent().toISOString(),
      email: () => faker.internet.email(),
      // 添加更多类型支持...
    };
    return (generators[type.toLowerCase()] || generators.string)();
  }

  generateExampleBody(bodyDef) {
    return bodyDef.reduce((acc, field) => {
      acc[field.name] = field.defaultValue || this.generateExampleValue(field.type);
      return acc;
    }, {});
  }

  generateQueryParams(params) {
    return params
      .filter(p => p.in === 'query')
      .map(p => ({
        key: p.name,
        value: p.defaultValue || this.generateExampleValue(p.type),
        description: p.description
      }));
  }

  // hasSkipTag 方法
  hasSkipTag(content) {
    const first100Chars = content.trim().substring(0, 100);
    return /\/\/\s*@postman-skip\b|\/\*\s*@postman-skip-file\b/.test(first100Chars);
  }
}

// 命令行配置
program
  .version('1.0.0')
  .description('自动生成Postman集合的工具')
  .option('-i, --input <path>', '路由文件目录', './routes')
  .option('-o, --output <path>', '输出文件路径', './postman/collection.json')
  .option('-b, --base-url <url>', '基础URL变量', '{{base_url}}')
  .action(async (options) => {
    const generator = new PostmanGenerator({
      routesPath: options.input,
      outputFile: options.output,
      baseUrl: options.baseUrl
    });
    await generator.generate();
  });

// 执行命令行解析
program.parseAsync(process.argv)
  .catch(error => {
    console.error('❌ 发生未捕获的错误:', error);
    process.exit(1);
  });
