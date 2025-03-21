const acorn = require('acorn');
const walk = require('acorn-walk');
const fs = require('fs');
const path = require('path');

class Parser {
  constructor(options) {
    this.options = options;
    this.comments = [];
  }

  // 解析所有路由文件
  async parseRoutes() {
    const routes = [];
    const files = fs.readdirSync(this.options.routesPath).filter(f => f.endsWith('.js'));

    for (const file of files) {
      const filePath = path.join(this.options.routesPath, file);
      const code = fs.readFileSync(filePath, 'utf8');
      const fileRoutes = this.parseRouteCode(code, filePath);
      routes.push(...fileRoutes);
    }

    return routes;
  }

  // 使用 acorn 解析路由文件中的 AST
  parseRouteCode(code, filePath) {
    const routes = [];
    const ast = acorn.parse(code, {
      ecmaVersion: 2020,
      locations: true,
      onComment: (isBlock, text, start, end) => {
        if (isBlock) {
          this.comments.push({ text, startLine: start, endLine: end });
        }
      }
    });

    // 遍历 AST，查找路由定义
    walk.simple(ast, {
      CallExpression: (node) => {
        const callee = node.callee;
        if (callee.object?.name === 'router' && /^(get|post|put|delete|all)$/i.test(callee.property?.name)) {
          const method = callee.property.name.toUpperCase();
          const path = this.getRoutePath(node.arguments);
          const relatedComment = this.getRelatedComment(node.loc.start.line);
          routes.push({
            method,
            path,
            comment: relatedComment?.text || '',
            loc: node.loc
          });
        }
      }
    });

    return routes;
  }

  // 获取注释和路由行号的相关匹配
  getRelatedComment(line) {
    return this.comments.find(c => c.endLine >= line - 3 && c.endLine <= line);
  }

  // 从 AST 中提取路由路径
  getRoutePath(args) {
    for (const arg of args) {
      if (arg.type === 'Literal' && typeof arg.value === 'string') {
        return arg.value;
      }
    }
    return '';
  }
}

module.exports = Parser;
