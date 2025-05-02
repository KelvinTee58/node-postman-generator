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
      console.error('❌ Unsupported builder version'); // 不支持该builder
    }
  }


  async generate() {
    try {
      console.log('🚀 Starting Postman collection generation...');
      // 创建输出目录
      fs.mkdirSync(path.dirname(this.options.outputFile), { recursive: true });
      let parser = new Parser(this.options)
      const routes = await parser.parseRoutes();
      // 生成器
      const builder = this.buildClass();
      const collection = builder.buildCollection(routes)
      fs.writeFileSync(this.options.outputFile, JSON.stringify(collection, null, 2));
      console.log(`✅ Successfully generated Postman collection to: ${this.options.outputFile}`); // 成功提示
      console.log(`📊 Generated ${routes.size} API endpoints`); // 统计信息
    } catch (error) {
      console.error('❌ Generation failed:', error.message); // 错误提示 生成失败
      process.exit(1);
    }
  }
}

module.exports = PostmanGenerator;
