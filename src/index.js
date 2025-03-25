const fs = require('fs');
const path = require('path');
const Parser = require('./parser');
const { loadModule } = require('./utils/moduleLoader'); // 导入工具方法

class PostmanGenerator {
  constructor(options) {
    this.options = {
      routesPath: './routes',
      outputFile: './postman/collection.json',
      baseUrl: '{{base_url}}',
      ...options,
    };
  }

  buildClass() {
    const builder = loadModule(__dirname, `/builder/${this.options.collectionVersion}`); // 使用工具方法
    if (builder) {
      return new builder(this.options)
    } else {
      console.error('❌ 不支持该builder');
    }
  }


  async generate() {
    try {
      console.log('🚀 开始生成Postman集合...');
      // 创建输出目录
      fs.mkdirSync(path.dirname(this.options.outputFile), { recursive: true });
      let parser = new Parser(this.options)
      const routes = await parser.parseRoutes();
      // 生成器
      const builder = this.buildClass();
      const collection = builder.buildCollection(routes)
      fs.writeFileSync(this.options.outputFile, JSON.stringify(collection, null, 2));
      console.log(`✅ 成功生成Postman集合至：${this.options.outputFile}`);
      console.log(`📊 共生成 ${routes.size} 个API端点`); ``
    } catch (error) {
      console.error('❌ 生成失败:', error.message);
      process.exit(1);
    }
  }
}

module.exports = PostmanGenerator;
