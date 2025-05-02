#!/usr/bin/env node

const { Command } = require('commander');
const fs = require('fs');
const path = require('path');
const PostmanGenerator = require('../src/index.js');
const packageJson = require('../package.json');

// 读取配置文件
const configPath = path.resolve(__dirname, '../config/node-postman-generator.json');
const defaultConfig = fs.existsSync(configPath)
  ? JSON.parse(fs.readFileSync(configPath, 'utf8'))
  : {};

// 初始化 CLI 命令
const program = new Command();
program
  // .version('2.8.0')
  .version(packageJson.version)
  .description(`📦 Express Router to Postman Collection Generator

  Documentation: https://github.com/KelvinTee58/node-postman-generator/blob/main/doc/README.md`)
  .option('-i, --input <path>', 'Specify Express routes directory path', defaultConfig.routesPath)
  .option('-o, --output <file>', 'Specify Postman Collection output file', defaultConfig.outputFile)
  .option('-u, --base-url <url>', 'Specify API base URL', defaultConfig.baseUrl)
  .option('-path, --path <url>', 'Specify config file path', "")
  .option('-s, --schema <version>', 'Specify Postman collection schema version (postman2.1)', 'postman2.1')

  .addHelpText('after', `
  Examples:
    $ npx node-postman-generator -i ./routes -o ./postman/collection.json
    $ npx node-postman-generator --input ./routes --output ./collection.json --base-url http://localhost:3000
    $ npx node-postman-generator -i ./routes -o ./collection.json -path ./config.json

  Config file example (config.json):
    {
      "routesPath": "./routes",
      "outputFile": "./postman/collection.json",
      "baseUrl": "{{base_url}}"
    }
  `)
  .action(async (options) => {

    // 读取用户配置文件
    const userConfigPath = options.path;
    const userConfig = fs.existsSync(userConfigPath) ? require(userConfigPath) : {};
    const generator = new PostmanGenerator({
      ...defaultConfig,
      routesPath: options.input,
      outputFile: options.output,
      baseUrl: options.baseUrl,
      path: options.path,
      collectionVersion: options.schema,
      ...userConfig
    });
    await generator.generate();
  });

// 解析 CLI 参数
program.parse(process.argv);
