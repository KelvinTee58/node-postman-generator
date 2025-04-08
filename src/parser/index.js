const acorn = require('acorn');
const walk = require('acorn-walk');
const fs = require('fs');
const path = require('path');
const prompts = require('prompts');
const { loadModule } = require('../utils/moduleLoader'); // 导入工具方法
let parsers;

class Parser {
  constructor(options) {
    this.options = options;
    this.framework = ''
  }

  // 记载指定名称的解释器
  loadParser(framework) {
    const ParserClass = loadModule(__dirname, `${framework}/parser`); // 使用工具方法
    if (ParserClass) {
      parsers = new ParserClass();
    } else {
      return null
    }
  }

  // hasSkipTag 方法
  hasSkipTag(content) {
    const first100Chars = content.trim().substring(0, 100);
    return /\/\/\s*@postman-skip\b|\/\*\s*@postman-skip-file\b/.test(first100Chars);
  }

  // 加载框架类型
  detectFramework(code) {
    let framework = null;
    try {
      const ast = acorn.parse(code, { ecmaVersion: 2020 }); // 根据您的项目配置 ecmaVersion
      const parserDir = __dirname; // 获取当前目录 (src/parser)

      walk.simple(ast, {
        CallExpression(node) {
          if (node.callee.type === 'Identifier' && node.callee.name === 'require') {
            if (node.arguments.length > 0 && node.arguments[0].type === 'Literal') {
              // framework = node.arguments[0].value;
              const requiredModule = node.arguments[0].value;
              const frameworkPath = path.join(parserDir, requiredModule);

              // 检查是否存在同名文件夹
              if (fs.existsSync(frameworkPath) && fs.statSync(frameworkPath).isDirectory()) {
                const files = fs.readdirSync(frameworkPath); // 读取文件夹内容
                if (files.length > 0) { // 检查文件夹是否非空
                  framework = requiredModule;
                  return; // 找到框架后立即停止遍历
                }
              }
            }
          }
        }
      });
    } catch (error) {
      console.warn(`❌ Error detecting framework (possible syntax unsupported): ${error.message}`); // 解析代码以检测框架时发生错误
    }
    return framework;
  }

  async parseRoutes() {
    if (!fs.existsSync(this.options.routesPath)) {
      throw new Error(`Routes directory does not exist: ${this.options.routesPath}`); // 路由目录不存在：
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
    let isUseDefault = false

    for (const file of routeFiles) {
      console.log(`🔍 Parsing route file: ${path.basename(file)}`); // 正在解析路由文件
      const code = fs.readFileSync(file, 'utf-8');
      // const routes = this.parseRouteCode(code);
      if (!this.framework && !isUseDefault) {
        this.framework = this.detectFramework(code);
        console.log(`🔍 Detected framework: ${this.framework ?? 'unknown'}`); // 解析路由文件框架为

        if (this.framework) { // 确保成功检测到框架
          this.loadParser(this.framework);
        } else {
          // 默认解析逻辑
          console.warn("❓ No explicitly supported framework detected."); // ❓未检测到明确支持的框架。

          const response = await prompts({ // 使用 await
            type: 'confirm',
            name: 'useDefault',
            message: `Attempt to parse using default logic (may not succeed)?`, // 是否尝试使用默认逻辑解析
            initial: false // 默认为 No

          });

          // 检查用户是否按 Ctrl+C 或类似操作取消了提示
          if (typeof response.useDefault === 'undefined') {
            console.log("❌ User canceled operation, skipped."); // ❌用户取消操作，已跳过。
            break;
          }

          if (response.useDefault === true) {
            isUseDefault = true
            this.loadParser('default');
          } else {
            console.log(`❌ User chose not to use default parsing.`); // ❌用户选择不使用默认解析
            break;
          }
        }
      }
      let routes;

      if (parsers) {
        routes = parsers.parseRouteCode(code);
      } else if (this.framework) {
        // 如果 this.framework 不为空，说明检测到了框架，但是没有加载对应的解析器
        throw new Error(`未找到 ${this.framework} 框架的解析器`);
      } else {
        // 如果 this.framework 为空，说明没有检测到框架
        throw new Error('未检测到框架');
      }
      fileRouteMap.set(file, routes);
    }

    return fileRouteMap;
  }
}

module.exports = Parser;