
var fs = require('fs');
var path = require('path');
var arrayify = require('arrayify');
var gh = require('parse-github-url');
var traverse = require('traverse');
var _ = require('lodash');

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
      children = (item.children ? mdList(item.children, indent+1) : '');
    }
    ret = nest + name + '\n' + children;
    return ret;
  }).join('');
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
  var url = 'https://github.com/' + ghRepo.repopath;
  return url;
};

var getGitHubVersionUrlFromBowerJson = function (bowerJson) {
  var ghRepo = gh(bowerJson._source);
  var resolution = bowerJson._resolution;
  var tree = resolution.tag || resolution.branch || resolution.commit;
  var url = 'https://github.com/' + ghRepo.repopath + '/tree/' + tree;
  return url;
};

var getGitHubRawUrlFromBowerJson = function (bowerJson) {
  var ghRepo = gh(bowerJson._source);
  var url = 'https://raw.githubusercontent.com/' + ghRepo.repopath;
  return url;
};

var replaceGitHubUrlWithRaw = function (url) {
  return url.replace(/^https?:\/\/github\.com/, 'https://raw.githubusercontent.com');
};


var mainList = function (opts) {
  opts = opts || {};
  if (!opts.basePath) opts.basePath = '';
  var j = parse(opts);
  var parentBowerJson = opts.parentBowerJson || j;
  var ts = [];
  if (j.main) {
    var ms = arrayify(j.main);
    ms.forEach(function (m) {
      var children = [];
      var file = cleanPath(opts.basePath, m);
      var name = file;
      var url;
      if (j._resolution) {
        // var ghBaseUrl = getGitHubUrlFromBowerJson(j);
        // var url = ghBaseUrl + '/blob/' + j._resolution.tag + '/' + m;
        var ghRawBaseUrl = getGitHubRawUrlFromBowerJson(j);
        var commitish = j._resolution.tag || j._resolution.branch || j._resolution.commit;
        url = ghRawBaseUrl + '/' + commitish + '/' + m;
      }
      else {
        url = name;
      }
      name = '[' + name + '](' + url + ')';

      if (parentBowerJson) {
        if (parentBowerJson.optional) {
          var optFiles = parentBowerJson.optional.files;
          if (optFiles) {
            var norm = {};
            Object.keys(optFiles).forEach(function (k) {
              var v = optFiles[k];
              k = cleanPath(k);
              norm[k] = v;
            });
            if (norm[file]) {
              var optMsg = norm[file];
              children.push('Optional: ' + optMsg);
            }
          }
        }
      }

      ts.push({
        name: name,
        file: file,
        children: children
      });
    });
  }
  return ts;
};


var main = function (opts) {
  opts = opts || {};
  var ts = mainList(opts);
  var t = mdList(ts, opts.indent);
  return t;
};


var fileToHTML = function (file, opts) {
  var j = parse(opts);
  var prefix;
  if (typeof opts.prefix === 'string') {
    prefix = opts.prefix;
  }
  else {
    prefix = 'bower_components/' + j.name + '/';
  }
  var ext = path.extname(file);
  file = prefix + file;
  var html;
  if (ext === '.css') {
    html = '<link rel="stylesheet" href="' + file + '" />';
  }
  else if (ext === '.js') {
    html = '<script src="' + file + '"></script>';
  }
  return html;
};

var sortHTMLs = function (htmls) {
  return _.sortBy(htmls, function (o) {
    // JS at the bottom
    if (o.ext === '.js') return 1;
    return -1;
  })
  .map(function (o) {
    return o.html;
  });
};

var getHTMLsForList = function (ts, opts) {
  var htmls = [];
  traverse(ts).forEach(function (o) {
    var file = o.file;
    if (file) {
      var h = fileToHTML(file, opts);
      htmls.push({
        ext: h.ext,
        html: h
      });
    }
  });
  return htmls;
};

var markdownHTMLCode = function (t) {
  return '```html\n' + t.join('\n') + '\n```\n';
};

var mainHTML = function (opts) {
  opts = opts || {};
  var j = parse(opts);
  var ts = mainList(opts);
  var htmls = getHTMLsForList(ts, opts);
  htmls = sortHTMLs(htmls);
  return markdownHTMLCode(htmls);
};

var mdLinkify = function (text, url) {
  if (url) {
    return '[' + text + '](' + url + ')';
  }
  else {
    return text;
  }
};

var depsList = function (opts) {
  opts = opts || {};
  var j = parse(opts);
  var ts = [];
  if (j.dependencies) {
    var d = j.dependencies;
    for (var n in d) {
      var ch;
      var dj;
      try {
        var nb = getBasePathForDep(n);
        var nf = getBowerFileForDep(n);
        dj = parse({bowerFile: nf});
        ch = mainList({
          basePath: nb,
          bowerFile: nf,
          indent: opts.indent,
          shim: opts.shim,
          name: n,
          parentBowerJson: j
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

      // n = '`' + n + '`';
      n = mdLinkify(n, url);

      var vUrl;
      try {
        vUrl = getGitHubVersionUrlFromBowerJson(dj);
      }
      catch (e) {}

      // v = '`' + v + '`';
      v = mdLinkify(v, vUrl);

      var name = n + '@' + v;
      var item = {
        name: name
      };
      if (ch && ch.length) {
        item.children = ch;
      }
      ts.push(item);
    }
  }
  return ts;
};

var deps = function (opts) {
  opts = opts || {};
  var j = parse(opts);
  var ts = depsList(opts);
  var t = mdList(ts, opts.indent);
  return t;
};

var depsHTML = function (opts) {
  opts = opts || {};
  var j = parse(opts);
  var ts = depsList(opts);
  var htmls = getHTMLsForList(ts, _.defaults({
    prefix: ''
  }, opts));
  htmls = sortHTMLs(htmls);
  return markdownHTMLCode(htmls);
};


exports.main = main;
exports.mainHTML = mainHTML;
exports.deps = deps;
exports.depsHTML = depsHTML;
