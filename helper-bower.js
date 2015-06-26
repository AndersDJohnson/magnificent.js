
var fs = require('fs');
var path = require('path');
var arrayify = require('arrayify');

var parse = function (opts) {
  opts = opts || {};
  if (! opts.bowerFile) opts.bowerFile = 'bower.json';
  var f;
  var j;
  try {
    f = fs.readFileSync(opts.bowerFile, 'utf8');
    j = JSON.parse(f);
  }
  catch (e) {
    console.error('Error reading file "' + opts.bowerFile + '".', e);
  }
  if (opts.shim) {
    if (!j) j = {};
    opts.shim(opts.name, j);
  }
  return j;
};

var times = function (str, num) {
  var out = '';
  for (var i = 0; i < num; ++i) {
    out += str;
  }
  return out;
};

var mdList = function (list, indent) {
  if (!indent) indent = 0;
  var nest = times('  ', indent) + '* ';
  return list.map(function (item) {
    if (typeof item === 'string') {
      return nest + item;
    }
    else {
      return nest + item.name + (item.children ? '\n' + mdList(item.children, indent+1) : '');
    }
  }).join('\n');
};

var getBasePathForDep = function (depName) {
  return 'bower_components/' + depName + '/';
};

var getBowerFileForDep = function (depName) {
  return getBasePathForDep(depName) + '.bower.json';
};


var cleanPath = function () {
  var mp = path.join.apply(path, arguments);
  mp = path.normalize(mp);
  mp = mp.replace(/\\/g, '/');
  return mp;
};


var mainList = function (opts) {
  opts = opts || {};
  if (!opts.basePath) opts.basePath = '';
  j = parse(opts);
  var ts = [];
  if (j.main) {
    var ms = arrayify(j.main);
    ms.forEach(function (m) {
      var mp = cleanPath(opts.basePath, m);
      ts.push({
        name: '`' + mp + '`'
      });
    });
  }
  return ts;
};


var main = function (opts) {
  opts = opts || {};
  var ts = mainList(opts);
  t = mdList(ts, opts.indent);
  return t;
};


var deps = function (opts) {
  opts = opts || {};
  j = parse(opts);
  var ts = [];
  if (j.dependencies) {
    var d = j.dependencies;
    for (var n in d) {
      var ch;
      try {
        var nb = getBasePathForDep(n);
        var nf = getBowerFileForDep(n);
        ch = mainList({
          basePath: nb,
          bowerFile: nf,
          indent: opts.indent,
          shim: opts.shim,
          name: n
        });
      } catch (e) {
        console.error(e, e.stack);
      }
      var v = d[n];
      var item = {
        name: '`' + n + '@' + v + '`'
      };
      if (ch && ch.length) {
        item.children = ch;
      }
      ts.push(item);
    }
  }
  t = mdList(ts, opts.indent);
  return t;
};


exports.main = main;
exports.deps = deps;
