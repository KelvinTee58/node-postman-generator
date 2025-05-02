function parseComment(comment) {
  const meta = {
    group: 'Default',
    name: '',
    description: '',
    params: [],
    headers: [],
    body: [],
    method: '',
    skip: false
  };

  let collectingGroup = {
    active: false,
    type: '',
    content: []
  };

  const GROUP_CONFIGS = {
    '@apiQueryGroup': {
      type: 'query',
      target: 'params'
    },
    '@apiParamGroup': {
      type: 'param',
      target: 'params'
    },
    '@apiBody': {
      type: 'body',
      target: 'body'
    }
  };


  // 处理单行group内容的通用函数

  // Single-line writing
  /**
   * @apiParamGroup [{"type": "String", "name": "username", "description": "Username"}]
   */

  //  multi-line writing
  /**
   * @apiParamGroup [
   *   {"type": "String", "name": "username", "description": "Username"},
   *   {"type": "Number", "name": "age", "description": "User age", "optional": true}
   * ]
   */
  const processGroupContent = (content, groupConfig) => {
    // Check if using old format
    if (content.startsWith('[[') && content.endsWith(']]')) {
      console.warn(`[Comment Parser] Deprecated: The [[]] format will be removed in version 2.8.0.
      Please use the new JSON array format instead:
      
      Example:
      @apiParamGroup [
        {"type": "String", "name": "username", "description": "Username"},
        {"type": "Number", "name": "age", "description": "User age", "optional": true, "defaultValue": 18}
      ]
      
      Note: If you need to use the old [[]] format, please use version < 2.8.0
      CHANGELOG guide: https://github.com/KelvinTee58/node-postman-generator/blob/main/doc/CHANGELOG.md#280`);
      return;
    }

    try {
      // Try to parse JSON array
      let params;
      try {
        params = JSON.parse(content);
        if (!Array.isArray(params)) {
          throw new Error('Parameter format must be an array');
        }
      } catch (e) {
        console.warn(`[Comment Parser] Invalid JSON format in ${groupConfig.type}: "${content}"`);
        return;
      }

      params.forEach(param => {
        if (!param.type || !param.name) {
          console.warn('[Comment Parser] Missing required fields: type or name');
          return;
        }
        // console.log('param.defaultValue :>> ', param.defaultValue);

        const processedParam = {
          // 根据类型设置 in
          in: groupConfig.type === 'body' ? 'body' :
            groupConfig.type === 'query' ? 'query' : 'path',
          name: param.name,
          type: param.type,
          description: param.description || '',
          defaultValue: param.defaultValue,
          optional: param.optional || false
        };

        // 根据配置决定添加到哪个目标数组
        meta[groupConfig.target].push(processedParam);
      });
    } catch (error) {
      console.warn(`[Comment Parser] Error processing ${groupConfig.type}: ${error.message}`);
    }
  };


  (comment || '').split('\n').forEach(line => {
    line = line.replace(/^\s*\*\s?/, '').trim();

    // 修改多行内容收集的判断条件
    if (collectingGroup.active) {
      if (line.includes(']')) { // 改为检测 ] 而不是 ]]
        collectingGroup.content.push(line);
        const fullContent = collectingGroup.content.join('\n') // 改用 \n 连接
          .replace(/\/\*\*|\*\//g, '') // 移除注释标记
          .replace(/^\s*\*\s?/gm, '')  // 移除每行开头的星号
          .trim();
        processGroupContent(fullContent, GROUP_CONFIGS[collectingGroup.type]); // 使用 存储多行结束调用processGroupContent
        collectingGroup = { active: false, type: '', content: [] };
      } else {
        collectingGroup.content.push(line);
      }
      return;
    }

    // 检查是否是group开始
    const groupType = Object.keys(GROUP_CONFIGS).find(prefix => line.startsWith(prefix));
    if (groupType) {
      const content = line.replace(new RegExp(`${groupType}\\s+`), '').trim();
      const groupConfig = GROUP_CONFIGS[groupType];

      // 如果是完整的单行 JSON
      if (content.startsWith('[') && content.endsWith(']')) {
        processGroupContent(content, groupConfig);
      } else if (content.startsWith('[')) {
        // 开始多行收集
        collectingGroup = {
          active: true,
          type: groupType,
          content: [content]
        };
      }
      return;
    }


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
          in: 'path',
          name: paramName,
          type: paramType,
          description: paramDescription,
          defaultValue: paramDefaultValue,
          optional: isOptional
        });
      }
    }

    // @apiQuery {Number} name Description
    // @apiQuery {Number} [name=defaultValue] Description
    // @apiQuery {String} [name] Description
    if (line.startsWith('@apiQuery ')) {
      const match = line.match(/@apiQuery\s+{(\w+)}\s+(?:\[(\w+)(?:=(\S+))?\]|(\S+))\s+(.*)/);
      if (match) {
        let paramType = match[1];
        let paramName = match[2] || match[4]; // [name=defaultValue] or name
        let paramDefaultValue = match[3]; // defaultValue
        let paramDescription = match[5] || ''; // Handle empty description
        let isOptional = !!match[2]; // Check for brackets []

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

module.exports = parseComment;