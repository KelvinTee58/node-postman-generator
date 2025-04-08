function parseComment(comment) {
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

module.exports = parseComment;