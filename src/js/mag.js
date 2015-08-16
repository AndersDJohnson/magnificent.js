/**
 * mag
 */

(function (root, factory) {
  var name = 'Mag';
  if (typeof define === 'function' && define.amd) {
    define(['./mag-analytics'], function (MagnificentAnalytics) {
        return (root[name] = factory(MagnificentAnalytics));
    });
  } else if (typeof exports === 'object') {
    module.exports = factory(require('./mag-analytics'));
  } else {
    root[name] = factory(root.MagnificentAnalytics);
  }
}(this, function (MagnificentAnalytics) {


  /**
   * @typedef {Object} MagModelFocus
   * @property {number} x - X position, from [0,1].
   * @property {number} y - Y position, from [0,1].
   */

  /**
   * @typedef {Object} MagModelLens
   * @property {number} w - Width, from (0,∞).
   * @property {number} h - Height, from (0,∞).
   */

  /**
   * @typedef {Object} MagModel
   * @property {number} zoom - Zoom level, from (0,∞).
   * @property {MagModelFocus} focus - Focus object.
   * @property {MagModelLens} lens - Lens object.
   */

  /**
   * @typedef {Object} MagOptions
   * @property {MagModel} model - A model.
   * @property {number} zoomMin - Minimum zoom level allowed, from (0,∞).
   * @property {number} zoomMax - Maximum zoom level allowed, from (0,∞).
   * @property {boolean} constrainLens - Whether lens position is constrained.
   * @property {boolean} constrainZoomed - Whether zoomed position is constrained.
   */


  /**
   * Mag constructor.
   * 
   * @alias module:mag
   * 
   * @class
   * 
   * @param {MagOptions} options - Options.
   */
  var Mag = function (options) {
    options = options || {};
    options.model = options.model || {};
    options.zoomMin = options.zoomMin || 1;
    options.zoomMax = options.zoomMax || 10;
    options.constrainLens = options.constrainLens !== false;
    options.constrainZoomed = options.constrainZoomed !== false;

    this.id = options.id;

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
    model.ratio = model.ratio || 1;
  };

  /**
   * Update computed model state, especially lens and zoomed.
   */
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
    dh = dh / model.ratio;

    lens.w = dw;
    lens.h = dh;

    if (options.constrainLens) {
      lens = this.constrainLensWH(lens);
    }
    lens.x = focus.x - (lens.w / 2);
    lens.y = focus.y - (lens.h / 2);
    if (options.constrainLens) {
      lens = this.constrainLensXY(lens);
    }

    zoomed.w = 1 / dw;
    zoomed.h = 1 / dh;

    var z = this.constrainZoomed(zoomed, options);
    if (z.w !== zoomed.w) {
      zoom *= z.w / zoomed.w;
    }
    zoomed = z;

    zoomed.x = 0.5 - focus.x * zoomed.w;
    zoomed.y = 0.5 - focus.y * zoomed.h;

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

  Mag.prototype.constrainZoomed = function (r, options) {
    var wm;
    var hm;
    wm = this.minMax(r.w, options.zoomMin, options.zoomMax);
    if (wm !== r.w) {
      hm *= wm / r.w;
      hm  = this.minMax(hm, options.zoomMin, options.zoomMax);
    }
    else {
      hm = this.minMax(r.h, options.zoomMin, options.zoomMax);
      if (hm !== r.h) {
        wm *= hm / r.h;
        wm = this.minMax(wm, options.zoomMin, options.zoomMax);
      }
    }
    return {
      w: wm,
      h: hm,
      x: r.x,
      y: r.y
    };
  };

  Mag.prototype.constrainLensWH = function (r) {
    var wm;
    var hm;
    wm = this.minMax1(r.w, 0.1);
    if (wm !== r.w) {
      hm *= wm / r.w;
      hm  = this.minMax1(hm, 0.1);
    }
    else {
      hm = this.minMax1(r.h, 0.1);
      if (hm !== r.h) {
        wm *= hm / r.h;
        wm = this.minMax1(wm, 0.1);
      }
    }
    return {
      w: wm,
      h: hm,
      x: r.x,
      y: r.y
    };
  };

  Mag.prototype.constrainLensXY = function (r) {
    return {
      x: this.minMax(r.x, 0, 1 - r.w),
      y: this.minMax(r.y, 0, 1 - r.h),
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


  if (MagnificentAnalytics) {
    MagnificentAnalytics.track('mag.js');
  }

  return Mag;
}));
