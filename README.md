# webpack-weex-livereload-plugin
weex live reload plugin for webpack.

This project is heavily inspired by [webpack-livereload-plugin](https://github.com/statianzo/webpack-livereload-plugin) and [weex-tookit](https://github.com/weexteam/weex-toolkit).

## Introduction

LiveReload Weex Pages when running `webpack --watch`.

## Pre-requirements

You need implated a WebSocket connection in your iOS/Android App with Weex ViewController.

You can refer to [Weex Playground source code](https://github.com/alibaba/weex/blob/dev/ios/playground/) for more details.

## Installation

Install the package

```
npm install --save-dev webpack-weex-livereload-plugin
```

Add the plugin to your webpack config

```js
// webpack.config.js

var WeexLiveReloadPlugin = require('webpack-livereload-plugin');

module.exports = {
  plugins: [
    new WeexLiveReloadPlugin(options)
  ]
}
```

## Options

- `port` - (Default: 8082) The desired port for the livereload server
- `host` - (Default: `0.0.0.0`) The desired host for the WebSocket server to bind to.
- `ignore` - (Default: `null`) RegExp of files to ignore. Null value means ignore nothing.
- `message` - (Default: `refresh`) The WebSocket message that triggers App to refresh current weex view.
