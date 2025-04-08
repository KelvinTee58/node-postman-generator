
const path = require('path');
const faker = require('faker');
class Builder {
  constructor(options) {
    this.options = {
      routesPath: './routes',
      outputFile: './postman/collection.json',
      baseUrl: '{{base_url}}',
      ...options
    };
  }
  _formatFolderName(filePath) {
    // 示例：将 "src/routes/user.js" 转换为 "User Routes"
    return path.basename(filePath, path.extname(filePath))
      .replace(/([A-Z])/g, ' $1')
      .trim() + ' Routes';
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

  _buildRequestItem(route) {
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

  // 生成文件 方法
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
}

module.exports = Builder