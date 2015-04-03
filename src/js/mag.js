(function (root, factory) {
  var name = 'Mag';
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

  var Mag = function (options) {
    options = options || {};
    options.model = options.model || {};
    options.zoomMin = options.zoomMin || 1;
    options.zoomMax = options.zoomMax || 10;
    options.constrainLens = ! (options.constrainLens === false);
    options.constrainZoomed = ! (options.constrainZoomed === false);

    this.model = options.model;
    this.options = options;

    this.fillModel();
  };

  Mag.prototype.fillXY = function (r) {
    r = r || {};
    r.x = r.x || 0;
    r.y = r.y || 0;
    return r;
  };

  Mag.prototype.fillWH = function (r) {
    r = r || {};
    r.w = r.w || 0;
    r.h = r.h || 0;
    return r;
  };

  Mag.prototype.fillModel = function () {
    var model = this.model;
    model.mode = model.mode || 'lag';
    model.focus = this.fillXY(model.focus);
    model.lens = this.fillXY(this.fillWH(model.lens));
    model.zoomed = this.fillXY(this.fillWH(model.zoomed));
    model.boundedLens = this.fillXY(this.fillWH(model.boundedLens));
    model.zoom = model.zoom || 1;
  };

  Mag.prototype.compute = function () {
    var lens, focus, zoomed, zoom, dw, dh;
    var options = this.options;
    var model = this.model;
    lens = model.lens;
    focus = model.focus;
    zoomed = model.zoomed;
    zoom = model.zoom;

    zoom = this.minMax(zoom, options.zoomMin, options.zoomMax);

    focus.x = this.minMax(focus.x, 0, 1);
    focus.y = this.minMax(focus.y, 0, 1);

    dw = 1 / zoom;
    dh = 1 / zoom;
    lens.x = focus.x - (dw / 2);
    lens.y = focus.y - (dh / 2);
    lens.w = dw;
    lens.h = dh;

    if (options.constrainLens) {
      lens = this.constrainLens(lens);
    }

    zoomed.w = zoom;
    zoomed.h = zoom;
    zoomed.x = 0.5 - focus.x * zoom;
    zoomed.y = 0.5 - focus.y * zoom;

    // the following is better equation for constrained zoom
    // zoomed.x = focus.x * (1 - zoom);
    // zoomed.y = focus.y * (1 - zoom);

    if (options.constrainZoomed) {
      zoomed.x = this.minMax(zoomed.x, 1 - zoom, 0);
      zoomed.y = this.minMax(zoomed.y, 1 - zoom, 0);
    }

    model.lens = lens;
    model.focus = focus;
    model.zoomed = zoomed;
    model.zoom = zoom;
  };


  Mag.prototype.minMax = function (val, min, max) {
    return val < min ? min : ( val > max ? max : val );
  };

  Mag.prototype.minMax1 = function (val, min) {
    return this.minMax(val, min, 1);
  };


  Mag.prototype.constrainLensWH = function (r) {
    return {
      w: this.minMax1(r.w, 0.1),
      h: this.minMax1(r.h, 0.1),
      x: r.x,
      y: r.y
    };
  };

  Mag.prototype.constrainLensXY = function (r) {
    return {
      x: this.minMax(r.x, 0),
      y: this.minMax(r.y, 0),
      w: r.w,
      h: r.h
    };
  };

  Mag.prototype.constrainLens = function (r) {
    var c = this.constrainLensXY(this.constrainLensWH(r));
    if (((c.w + c.x) > 1)) {
      c.x = Math.max(0, 1 - c.w);
    }
    if (((c.h + c.y) > 1)) {
      c.y = Math.max(0, 1 - c.h);
    }
    return c;
  };


  Mag.prototype.project = function (frame) {
    var model = this.model;
    var lens = model.lens;
    return {
      x: lens.x * frame.w,
      y: lens.y * frame.h,
      w: lens.w * frame.w,
      h: lens.h * frame.h
    };
  };

  return Mag;
}));
