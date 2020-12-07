const path = require("path");
const fs = require("fs");

const isString = (dir) => {
  return typeof dir === "string";
};

const isBool = (sub) => {
  return typeof sub === "boolean";
};

const isReg = (reg) => {
  return Object.prototype.toString.call(reg) === "[object RegExp]";
};

const isFunc = (fun) => {
  return typeof fun === "function";
};

function formatPath(directory, useSubdirectories, regExp, rootPath, callback) {
  let keysArr = [];
  directory = path.join(rootPath, directory);

  /* read file and dir */
  const filesArr = fs.readdirSync(directory);
  filesArr.forEach((fileItemName) => {
    const relPath = path.join(directory, fileItemName);
    const stat = fs.statSync(relPath);

    /* Recursion if it's a directory */
    if (useSubdirectories && stat.isDirectory()) {
      keysArr = keysArr.concat(formatPath(relPath, true, regExp, "", callback));
    } else {
      if (regExp.test(fileItemName)) {
        /* use regExp check */
        keysArr.push(relPath);
        isFunc(callback) && callback(relPath);
      }
    }
  });

  return keysArr;
}

/* format RootPath */
function handleRootPath(rootPath) {
  let effectRootPath = "";
  try {
    fs.statSync(rootPath);
    effectRootPath = rootPath;
  } catch {
    rootPath = rootPath.slice(0, rootPath.length - 1);
    effectRootPath = handleRootPath(rootPath);
  }
  /* path.resolve 来统一 RootPath 的风格 */
  return path.resolve(effectRootPath);
}

/* parhArr => pathObj */
function formatKeysArr(keysArr, rootPath) {
  // const keysArr = [
  //   '/Users/bbb/Desktop/xxx/vue-mock-demo/src/main.js',
  //   '/Users/bbb/Desktop/xxx/vue-mock-demo/src/mock/_mock.js',
  //   '/Users/bbb/Desktop/xxx/vue-mock-demo/src/mock/index.js'
  // ];
  // let rootPath = "/Users/bbb/Desktop/xxx/vue-mock-demo/src/mock";

  let minSamePathIndex = 0;
  keysArr.forEach((pathStr) => {
    const pathItemArr = pathStr.split("");
    for (let index = 0; index < pathItemArr.length; index++) {
      if (rootPath.charAt(index) === pathItemArr[index]) {
        if (minSamePathIndex < index) {
          minSamePathIndex = index;
        }
      } else {
        rootPath = rootPath.slice(0, minSamePathIndex + 1);
        break;
      }
    }
  });

  rootPath = handleRootPath(rootPath);

  const keysMap = {};
  keysArr.forEach((pathItem) => {
    const rootPathReg = new RegExp(rootPath);
    const newRelPath = pathItem.replace(rootPathReg, ".");
    keysMap[newRelPath] = pathItem;
  });

  return keysMap;
}

function requireContext() {
  // 3. formatPath
  const keysArr = formatPath(...arguments);
  const rootPath = arguments[3];
  // 4. pathArr => pathObj
  const keysMap = formatKeysArr(keysArr, rootPath);

  // 5. return context
  const context = function (key) {
    return require(keysMap[key]);
  };

  context.resolve = function (key) {
    return keysMap[key];
  };

  context.keys = function () {
    return Object.keys(keysMap);
  };

  return context;
}

/* 
  1. export function
*/
module.exports = (directory, useSubdirectories, regExp, rootPath, callback) => {
  // 2. Calibration parameters
  if (!isString(directory)) {
    throw new Error(`directory must be a string type`);
  } else if (!isBool(useSubdirectories)) {
    throw new Error(`useSubdirectories must be a boolean type`);
  } else if (!isReg(regExp)) {
    throw new Error(`regExp must be a regular expression type`);
  } else {
    return requireContext(directory, useSubdirectories, regExp, rootPath, callback);
  }
};
