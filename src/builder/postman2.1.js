const path = require('path');
const faker = require('faker'); // 生成示例数据

/**
 * Postman Collection Builder (v2.1 Schema)
 * 将解析后的路由构建成 Postman v2.1 JSON 对象。
 */
class Builder {
  constructor(options) {
    // 构造函数：合并和设置配置选项
    this.options = {
      routesPath: './routes',
      outputFile: './postman/collection.json',
      baseUrl: '{{base_url}}',
      ...options,
    };
    // faker.locale = "zh_CN"; //可选: 设置 faker 语言
  }

  /**
   * 构建 Postman 文件夹名称 (基于文件名)
   * @private
   */
  _buildFolderName(filePath) {
    if (!filePath) return 'Unnamed Folder';
    return path.basename(filePath, path.extname(filePath))
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, (str) => str.toUpperCase())
      .trim() + ' Routes';
  }

  /**
   * 根据类型生成 faker 示例值
   */
  generateExampleValue(type = 'string') {
    const safeType = type.toLowerCase();
    const generators = {
      string: () => faker.lorem.word(),
      number: () => faker.datatype.number({ min: 1, max: 100 }),
      boolean: () => faker.datatype.boolean(),
      date: () => faker.date.recent().toISOString(),
      email: () => faker.internet.email(),
      integer: () => faker.datatype.number({ min: 1, max: 1000, precision: 1 }),
      float: () => faker.datatype.float({ min: 0, max: 100, precision: 0.01 }),
      uuid: () => faker.datatype.uuid(),
      url: () => faker.internet.url(),
      array: () => [],
      object: () => ({}),
    };
    return (generators[safeType] || generators.string)(); // 未知类型用 string
  }

  /**
   * 构建包含 Postman 变量的 URL 路径字符串 (用于 url.raw)
   * @private
   */
  _buildUrlPathWithVariables(routePath, pathParams) {
    const pathParamsMap = new Map(pathParams.map(p => [p.name, p])); // 优化查找
    return (routePath || '').split('/').map(segment => {
      if (segment.startsWith(':')) {
        const paramName = segment.slice(1);
        const paramInfo = pathParamsMap.get(paramName);
        return paramInfo?.defaultValue ?? (pathParamsMap.has(paramName) ? `{{${paramName}}}` : segment);
      }
      return segment;
    }).join('/');
  }

  /**
   * 构建用于 Postman url.path 的路径段数组
   * @private
   */
  _buildUrlPathArray(routePath) {
    return (routePath || '').split('/') // 处理空路径
      .filter(segment => segment !== '')
      .map(segment => {
        if (segment.startsWith(':')) {
          return `:${segment.slice(1)}`; // 保持 Postman 路径参数格式 :param
        }
        return segment;
      });
  }

  /**
   * 生成示例请求体 (Request Body)
   */
  generateExampleBody(bodyDef) {
    if (!bodyDef || bodyDef.length === 0) return undefined;
    return bodyDef.reduce((acc, field) => {
      // 优先用默认值，否则生成示例值
      acc[field.name] = field.defaultValue !== undefined ? field.defaultValue : this.generateExampleValue(field.type);
      return acc;
    }, {});
  }

  /**
   * 生成 Postman 查询参数对象数组 (用于 url.query)
   */
  generateQueryParams(queryParams) {
    return queryParams.map(p => {
      const detailedDescription = [
        p.description || '',
        `(Type: ${p.type || 'string'})`,
        p.optional ? '[Optional]' : '',
        p.defaultValue !== undefined ? `(Default: ${p.defaultValue})` : ''
      ].filter(Boolean).join(' '); // 构建详细描述

      return {
        key: p.name,
        value: p.defaultValue !== undefined ? p.defaultValue : (p.optional ? "" : this.generateExampleValue(p.type)),
        description: detailedDescription,
        // disabled: p.optional === true, // 可选参数默认禁用
      };
    });
  }

  /**
  * 构建查询参数字符串 (用于 url.raw)
  * @private
  */
  _buildQueryString(queryParams) {
    // 只包含启用且有值的参数
    const queryString = queryParams
      .filter(p => p.value !== '')
      .map(p => `${encodeURIComponent(p.key)}=${encodeURIComponent(p.value)}`)
      .join('&');
    return queryString ? `?${queryString}` : ''; // 返回带 ? 的字符串或空串
  }


  /**
   * 构建单个 Postman 请求对象 (item)
   * @private
   */
  _buildRequestItem(route) {
    // 安全地获取解析信息，提供默认值
    const parseInfo = route.parseInfo || { params: [], headers: [], body: [] };
    const {
      name = `${route.method} ${route.path}`, // 默认名称
      group = 'Default', // 默认分组
      description = '',
      params = [],
      headers = [],
      body = []
    } = parseInfo;

    // 分离路径参数和查询参数
    const pathParams = params.filter(p => p.in === 'path');
    const queryParamsRaw = params.filter(p => p.in === 'query');

    // 处理查询参数和查询字符串
    const queryParamsForPostman = this.generateQueryParams(queryParamsRaw);
    const queryStringForRawUrl = this._buildQueryString(queryParamsForPostman);

    // 构建请求体
    const exampleBody = this.generateExampleBody(body);

    // 构建 URL 各部分
    const urlPathWithVars = this._buildUrlPathWithVariables(route.path, pathParams);
    const urlPathArray = this._buildUrlPathArray(route.path); // 用于 url.path
    const host = [`${this.options.baseUrl}`]; // host 通常是基础 URL

    return {
      name: name || `${route.method} ${route.path}`, // 请求名称
      request: {
        method: route.method, // HTTP 方法
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
        header: headers.map(h => ({ // 请求头
          key: h.name,
          value: `{{${h.name}_HEADER}}`, // 建议用变量
          description: `${h.description || ''} (Type: ${h.type || 'string'})`,
        })),
        body: exampleBody ? { // 请求体 (仅当存在时)
          mode: 'raw',
          options: { raw: { language: 'json' } },
          raw: JSON.stringify(exampleBody, null, 2)
        } : undefined,
        url: { // URL 对象
          raw: `${this.options.baseUrl}/${group}${urlPathWithVars}${queryStringForRawUrl}`, // 完整原始 URL
          host: host,
          path: [group, ...urlPathArray].filter(Boolean), // 路径段数组 (包含 group)
          query: queryParamsForPostman, // 结构化查询参数
        },
        description: description, // 请求描述
      },
      response: [], // 可选: 添加响应示例
    };
  }

  /**
   * 构建完整的 Postman 集合对象
   */
  buildCollection(fileRouteMap) {
    return {
      info: {
        _postman_id: faker.datatype.uuid(), // 添加 postman id
        name: this.options.collectionName || "Generated API Collection", // 集合名称
        description: this.options.collectionDescription || "Automatically generated by postman-generator", // 集合描述
        schema: "https://schema.getpostman.com/json/collection/v2.1.0/collection.json",
      },
      item: Array.from(fileRouteMap.entries()).map(([filePath, routes]) => ({
        // 文件夹级别
        name: this._buildFolderName(filePath), // 文件夹名称
        description: `APIs from ${path.basename(filePath)}`, //文件夹描述
        item: routes
          .filter(route => !route.parseInfo?.skip) // 跳过标记了 skip 的路由
          .map(route => this._buildRequestItem(route)), // 构建请求 item
      })),
      variable: [{ key: "base_url", value: "http://localhost:3000" }, { key: "token", value: "this is token" }]
    };
  }
}

module.exports = Builder;