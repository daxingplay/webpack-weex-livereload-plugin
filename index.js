var wsServer = require('ws').Server;
var servers = {};

function LiveReloadPlugin(options) {
  this.options = options || {};
  this.port = this.options.port || 8082;
  this.message = this.options.message || 'refresh';
  this.ignore = this.options.ignore || null;
  this.lastHash = null;
  this.lastChildHashes = [];
  this.host = this.options.host || '0.0.0.0';
  this.server = null;
  this.connection = null;
}

function arraysEqual(a1, a2) {
  return a1.length == a2.length && a1.every(function(v, i) {
    return v === a2[i];
  });
}

Object.defineProperty(LiveReloadPlugin.prototype, 'isRunning', {
  get: function() {
    return !!this.server;
  }
});

LiveReloadPlugin.prototype.start = function start(watching, cb) {
  var port = this.port;
  if (servers[port]) {
    this.server = servers[port];
    cb();
  } else {
    var self = this;
    this.server = servers[port] = wsServer({
      port: port,
      host: this.host,
    });
    // this.server.errorListener = function serverError(err) {
    //   console.error('Live Reload disabled: ' + err.message);
    //   if (err.code !== 'EADDRINUSE') {
    //     console.error(err.stack);
    //   }
    //   cb();
    // };
    console.info((new Date()) + `WebSocket  is listening on port ${this.host}:${port}`);
    this.server.on('connection', function connection(ws) {
      ws.on('message', function incoming(message) {
        console.info('received: %s', message);
      });
      ws.send('ws server ok');
      self.connection = ws;
    });
    cb();
  }
};

LiveReloadPlugin.prototype.done = function done(stats) {
  var hash = stats.compilation.hash;
  var childHashes = (stats.compilation.children || []).map(child => child.hash);
  var files = Object.keys(stats.compilation.assets);
  var include = files.filter(function(file) {
    return !file.match(this.ignore);
  }, this);

  if (this.isRunning && (hash !== this.lastHash || !arraysEqual(childHashes, this.lastChildHashes)) && include.length > 0) {
    this.lastHash = hash;
    this.lastChildHashes = childHashes;
    setTimeout(function onTimeout() {
      if (this.connection) {
        this.connection.send(this.message, function(error) {});
      }
    }.bind(this));
  }
};

LiveReloadPlugin.prototype.failed = function failed() {
  this.lastHash = null;
  this.lastChildHashes = [];
};

LiveReloadPlugin.prototype.apply = function apply(compiler) {
  this.compiler = compiler;
  compiler.plugin('watch-run', this.start.bind(this));
  compiler.plugin('done', this.done.bind(this));
  compiler.plugin('failed', this.failed.bind(this));
};

module.exports = LiveReloadPlugin;
