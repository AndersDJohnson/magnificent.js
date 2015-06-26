
var fs = require('fs');
var arrayify = require('arrayify');

var parse = function () {
  var f = fs.readFileSync('bower.json', 'utf8');
  var j = JSON.parse(f);
  return j;
};

var mdList = function (list) {
  return list.map(function (item) {
    return '* ' + item;
  }).join('\n');
};


var main = function (fp, opts) {
  j = parse();
  var ts = [];
  if (j.main) {
    var ms = arrayify(j.main);
    ms.forEach(function (m) {
      ts.push('`' + m + '`');
    });
  }
  t = mdList(ts);
  return t;
};


var deps = function (fp, opts) {
  j = parse();
  var ts = [];
  if (j.dependencies) {
    var ms = arrayify(j.dependencies);
    ms.forEach(function (v, k) {
      ts.push('`' + k + '@' + v + '`');
    });
  }
  t = mdList(ts);
  return t;
};


exports.main = main;
exports.deps = deps;
