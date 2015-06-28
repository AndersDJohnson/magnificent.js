
var fs = require('fs');
var path = require('path');
var arrayify = require('arrayify');
var gh = require('parse-github-url');

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
    var ret;
    var name;
    var children = '';
    if (typeof item === 'string') {
      name = item;
    }
    else {
      name = item.name;
      children = (item.children ? '\n' + mdList(item.children, indent+1) : '');
    }
    ret = nest + name + children;
    return ret;
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

var getGitHubUrlFromBowerJson = function (bowerJson) {
  var ghRepo = gh(bowerJson._source);
  url = 'https://github.com/' + ghRepo.repopath;
  return url;
};

var getGitHubRawUrlFromBowerJson = function (bowerJson) {
  var ghRepo = gh(bowerJson._source);
  url = 'https://raw.githubusercontent.com/' + ghRepo.repopath;
  return url;
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
      var name = mp;
      if (j._resolution) {
        // var ghBaseUrl = getGitHubUrlFromBowerJson(j);
        // var url = ghBaseUrl + '/blob/' + j._resolution.tag + '/' + m;
        var ghRawBaseUrl = getGitHubRawUrlFromBowerJson(j);
        var commitish = j._resolution.tag || j._resolution.branch || j._resolution.commit;
        var url = ghRawBaseUrl + '/' + commitish + '/' + m;
        name = '[' + name + '](' + url + ')';
      }
      else {
        name = '`' + name + '`';
      }
      ts.push({
        name: name
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
      var dj;
      try {
        var nb = getBasePathForDep(n);
        nf = getBowerFileForDep(n);
        dj = parse({bowerFile: nf});
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
      // var v = d[n];
      var v;
      if (dj) {
        v = dj._target;
      }
      if (!v) {
        v = d[n];
      }
      var url;
      try {
        url = getGitHubUrlFromBowerJson(dj);
      }
      catch (e) {
        url = j.homepage;
      }

      if (url) {
        // n = '[`' + n + '`](' + url + ')';
        n = '[' + n + '](' + url + ')';
      }
      else {
        // n = '`' + n + '`';
      }
      v = '@' + v;
      // var name = n + '`@' + v + '`';
      // var name = n + '`' + v + '`';
      var name = n;
      if (v) {
        name += v;
      }
      var item = {
        name: name
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
