const fs = require('fs');
const path = require('path');

class Utils {
  static ensureDirectoryExistence(filePath) {
    const dirName = path.dirname(filePath);
    if (!fs.existsSync(dirName)) {
      fs.mkdirSync(dirName, { recursive: true });
    }
  }

  static readJsonFile(filePath) {
    if (fs.existsSync(filePath)) {
      return JSON.parse(fs.readFileSync(filePath, 'utf8'));
    }
    return {};
  }

  static formatPath(routePath) {
    if (!routePath.startsWith('/')) {
      return `/${routePath}`;
    }
    return routePath;
  }
}

module.exports = Utils;
