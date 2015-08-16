(function (root, factory) {
  var name = 'MagnificentAnalytics';
  if (typeof define === 'function' && define.amd) {
    define(['google-analytics-js'], function (gaTrack) {
        return (root[name] = factory(root, false, gaTrack));
    });
  } else if (typeof exports === 'object') {
    module.exports = factory(root, require('detect-node'), require('google-analytics-js'));
  } else {
    root[name] = factory(root, false, root.gaTrack);
  }
}(this, function (root, detectNode, gaTrack) {

  var MagnificentAnalytics = function () {};

  var options = root.MAGNIFICENT_OPTIONS || {};

  MagnificentAnalytics.track = function (file) {
    if (detectNode) {
      return false;
    }

    if (! options.noTrack) {
      if (gaTrack) {
        gaTrack('UA-64799312-1', 'andrz.me/magnificent.js', file);
        return true;
      }
    }
  };

  return MagnificentAnalytics;
}));
