#!/usr/bin/env node

const { Command } = require('commander');
const fs = require('fs');
const path = require('path');
const PostmanGenerator = require('../src/generator');

// 读取配置文件
const configPath = path.resolve(__dirname, '../config/node-postman-generator.json');
const defaultConfig = fs.existsSync(configPath)
  ? JSON.parse(fs.readFileSync(configPath, 'utf8'))
  : {};

// 初始化 CLI 命令
const program = new Command();
program
  .version('1.0.0')
  .description('📦 Express 路由转 Postman Collection 工具')
  .option('-r, --routes <path>', '指定 Express 路由文件夹路径', defaultConfig.routesPath)
  .option('-o, --output <file>', '指定 Postman Collection 生成文件', defaultConfig.outputFile)
  .option('-b, --base-url <url>', '指定 API 的基础 URL', defaultConfig.baseUrl)
  .action((options) => {
    const generator = new PostmanGenerator({
      routesPath: options.routes,
      outputFile: options.output,
      baseUrl: options.baseUrl
    });

    generator.generate();
  });

// 解析 CLI 参数
program.parse(process.argv);
