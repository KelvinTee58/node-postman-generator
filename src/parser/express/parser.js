const acorn = require('acorn');
const walk = require('acorn-walk');
const parseComment = require('./comment.js')

class ExpressParser {
  constructor(code) {
    this.comments = [];
    this.ast;
    this.code = code;
  }

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
          const path = that._getRoutePath(node.arguments);

          // 智能注释匹配算法
          const relatedComment = comments.find(c =>
            c.endLine >= routeLine - 3 &&
            c.endLine <= routeLine &&
            c.text.includes('@api')
          );

          // 在这里解析注释，并存储在 parseInfo 中
          const parseInfo = parseComment(relatedComment?.text)

          routes.push({
            method,
            path,
            comment: relatedComment?.text || '',
            loc: node.loc,
            parseInfo
          });
        }
      },
    });

    // return routes;
    return routes.filter(r => {
      // 保留有有效路径且未标记跳过的路由
      return r.path && !r.parseInfo.skip;
    });
  }
}

module.exports = ExpressParser; // 确保使用 module.exports 导出类