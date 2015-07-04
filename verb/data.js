exports.bowerShim = function (name, json) {
  if (name === 'jquery.threedubmedia') {
    json.main = 'event.drag/jquery.event.drag.js';
  }
};
