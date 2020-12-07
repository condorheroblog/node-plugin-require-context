# node-plugin-require-context

[![NPM version](https://img.shields.io/npm/v/node-plugin-require-context)](https://www.npmjs.com/package/node-plugin-require-context)
![Downloads](https://img.shields.io/npm/dw/node-plugin-require-context)
[![License](https://img.shields.io/npm/l/node-plugin-require-context)](./LICENSE)

> nodejs plugin like webpack require-context.

Inspiration from [ webpack's require.context](https://webpack.js.org/guides/dependency-management/#requirecontext)，You can batch import files in NodeJs.


## Usage

*install*

```npm
npm install --save-dev node-plugin-require-context
```

*Example*

```js
const requireContext = require('node-plugin-require-context');
const context = requireContext('./', true, /\.js$/, __dirname);

context.keys().forEach(modulePath => {
    /* get module */
    context(modulePath);
});
```

## Options

`requireContext ( directory, useSubdirectories, regExp, rootPath, fn )`  

- `directory`
>  search dir, you can input like './' or '../' and so on, Required parameter.

- `useSubdirectories`

> `true` will search all child file; `false` only search current dir, Required parameter.

- `regExp`

> RegExp match; match the files you need,Required parameter.

- `rootPath`
> this is indispensable，The fixed value is `__dirname`, Required parameter.

- `fn`
> A callback function; when matching to the correct file will call it,Optional parameters

## API

The `context` function has 2 properties: resolve and keys.

- resolve is a function and when passed in the module relative path and returns absolute path.
- keys is a function that returns an array of all possible requests that the context module can handle.