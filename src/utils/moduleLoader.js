const fs = require('fs');
const path = require('path');

/**
 * 加载指定路径的模块，并验证是否为类/构造函数。
 * @param {string} basePath 基础路径
 * @param {string} moduleName 模块名称（不包含扩展名）
 * @returns {function|null} 如果模块存在且导出类/构造函数，则返回该类/构造函数；否则返回 null。
 */
function loadModule(basePath, moduleName) {

  const modulePath = path.join(basePath, `${moduleName}.js`);
  if (fs.existsSync(modulePath)) {
    const ModuleClass = require(modulePath);
    if (typeof ModuleClass === 'function') {
      return ModuleClass;
    } else {
      console.error(`Error: ${moduleName}.js did not export a class or constructor.`);
      return null;
    }
  } else {
    console.error(`Error: Module file not found: ${modulePath}`);
    return null;
  }
}

module.exports = { loadModule };