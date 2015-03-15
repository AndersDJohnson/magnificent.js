(function (root, factory) {
  var name = 'mag';
  if (typeof define === 'function' && define.amd) {
    define([], function () {
        return (root[name] = factory());
    });
  } else if (typeof exports === 'object') {
    module.exports = factory();
  } else {
    root[name] = factory();
  }
}(this, function () {

  // var model = {
  //   zoom: 1,
  //   focus: {
  //     x: 0,
  //     y: 0
  //   },
  //   lens: {
  //     x: 0,
  //     y: 0,
  //     w: 0.5,
  //     h: 0.5
  //   },
  //   zoomed: {
  //     x: 0,
  //     y: 0,
  //     w: 0.5,
  //     h: 0.5
  //   }
  // };


  var fillXY = function (r) {
    r = r || {};
    r.x = r.x || 0;
    r.y = r.y || 0;
    return r;
  };

  var fillWH = function (r) {
    r = r || {};
    r.w = r.w || 0;
    r.h = r.h || 0;
    return r;
  };

  var fillModel = function (model) {
    model = model || {};
    model.mode = model.mode || 'lag';
    model.focus = fillXY(model.focus);
    model.lens = fillXY(fillWH(model.lens));
    model.zoomed = fillXY(fillWH(model.zoomed));
    model.boundedLens = fillXY(fillWH(model.boundedLens));
    model.zoom = model.zoom || 1;
    return model;
  };

  var compute = function (model, options) {
    var lens, focus, zoomed, zoom, dw, dh;
    options = options || {
      constrainLens: true
    };
    model = fillModel(model);
    lens = model.lens;
    focus = model.focus;
    zoomed = model.zoomed;
    zoom = model.zoom;

    dw = 1 / zoom;
    dh = 1 / zoom;
    lens.x = focus.x - (dw / 2);
    lens.y = focus.y - (dh / 2);
    lens.w = dw;
    lens.h = dh;

    if (options.constrainLens) {
      lens = constrainLens(lens);
    }

    zoomed.w = zoom;
    zoomed.h = zoom;
    zoomed.x = 0.5 - focus.x * zoom;
    zoomed.y = 0.5 - focus.y * zoom;

    if (options.constrainZoomed) {
      zoomed.x = minMax(zoomed.x, 1 - zoom, 0);
      zoomed.y = minMax(zoomed.y, 1 - zoom, 0);
    }

    model.lens = lens;
    model.focus = focus;
    model.zoomed = zoomed;
    model.zoom = zoom;
  };


  var minMax = function (val, min, max) {
    return val < min ? min : ( val > max ? max : val );
  };

  var minMax1 = function (val, min) {
    return minMax(val, min, 1);
  };


  var constrainLensWH = function (r) {
    return {
      w: minMax1(r.w, 0.1),
      h: minMax1(r.h, 0.1),
      x: r.x,
      y: r.y
    };
  };

  var constrainLensXY = function (r) {
    return {
      x: minMax(r.x, 0),
      y: minMax(r.y, 0),
      w: r.w,
      h: r.h
    };
  };

  var constrainLens = function (r) {
    var c = constrainLensXY(constrainLensWH(r));
    if (((c.w + c.x) > 1)) {
      c.x = Math.max(0, 1 - c.w);
    }
    if (((c.h + c.y) > 1)) {
      c.y = Math.max(0, 1 - c.h);
    }
    return c;
  };


  var project = function (model, frame) {
    model = fillModel(model);
    var lens = model.lens;
    return {
      x: lens.x * frame.w,
      y: lens.y * frame.h,
      w: lens.w * frame.w,
      h: lens.h * frame.h
    };
  };


  var mag = {};

  mag.compute = compute;
  mag.project = project;
  mag.constrainLens = constrainLens;
  mag.constrainLensWH = constrainLensWH;
  mag.constrainLensXY = constrainLensXY;
  mag.minMax = minMax;

  return mag;
}));
