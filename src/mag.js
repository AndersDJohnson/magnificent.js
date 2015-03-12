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
  //   lens: {
  //     x: 0,
  //     y: 0,
  //     w: 0.5,
  //     h: 0.5
  //   },
  //   focus: {
  //     x: 0,
  //     y: 0
  //   }
  // };

  // var world = {
  //   frame: {
  //     w: 100,
  //     h: 100
  //   },
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
    model.full = fillXY(fillWH(model.full));
    return model;
  };

  var compute = function (model) {
    var lens, focus, dw, dh, offset;
    model = fillModel(model);
    lens = model.lens;
    focus = model.focus;
    if (model.mode === 'lag') {
      dw = 1 - model.lens.w;
      dh = 1 - model.lens.h;
      offset = {
        x: 0,
        y: 0
      };
    }
    else {
      dw = 1;
      dh = 1;
      offset = {
        x: lens.w / 2,
        y: lens.h / 2,
      };
    }
    lens.x = (dw * focus.x) - offset.x;
    lens.y = (dh * focus.y) - offset.y;

    model.full = {
      w: 1 / lens.w,
      h: 1 / lens.h,
      x: (-1 * lens.x) / lens.w,
      y: (-1 * lens.y) / lens.h,
    };
  };


  var minMax = function (val, min, max) {
    return val < min ? min : ( val > max ? max : val );
  };

  var minMax1 = function (val) {
    return minMax(val, 0.01, 1);
  };


  var constrainWH = function (r) {
    return {
      w: minMax1(r.w),
      h: minMax1(r.h),
      x: r.x,
      y: r.y
    };
  };

  var constrainXY = function (r) {
    return {
      x: minMax1(r.x),
      y: minMax1(r.y),
      w: r.w,
      h: r.h
    };
  };

  var constrain = function (r) {
    return constrainXY(constrainWH(r));
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
  mag.constrain = constrain;
  mag.constrainWH = constrainWH;
  mag.constrainXY = constrainXY;

  return mag;
}));
