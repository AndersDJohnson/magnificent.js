(function (root, factory) {
  var name = 'mag$';
  if (typeof define === 'function' && define.amd) {
    define(['mag',' jquery'], function (mag, $) {
        return (root[name] = factory(mag, $));
    });
  } else if (typeof exports === 'object') {
    module.exports = factory(require('./mag'), require('jquery'));
  } else {
    root[name] = factory(mag, $);
  }
}(this, function (mag, $) {

  var normalizeOffsets = function (e) {
    var offset = $(e.target).offset();
    return {
      x: e.pageX - offset.left,
      y: e.pageY - offset.top
    };
    return e;
  };

  var ratioOffsets = function (e) {
    var normOff = normalizeOffsets(e);
    var $target = $(e.target);
    return {
      x: normOff.x / $target.width(),
      y: normOff.y / $target.height()
    }
  };

  var ratioOffsetsFor = function ($target, x, y) {
    return {
      x: x / $target.width(),
      y: y / $target.height()
    }
  };

  var cssPerc = function (frac) {
    return (frac * 100) + '%';
  };

  var toCSS = function (pt) {
    var css = {};
    if (pt.x !== undefined) css.left = cssPerc(pt.x);
    if (pt.y !== undefined) css.top = cssPerc(pt.y);
    if (pt.w !== undefined) css.width = cssPerc(pt.w);
    if (pt.h !== undefined) css.height = cssPerc(pt.h);
    return css;
  };

  var mag$ = function (options) {

    return this.each(function() {

      var $el = $(this);

      options = $.extend({}, options);

      var model = {
        mode: 'overflow',
        focus: {
          x: 0.5,
          y: 0.5
        },
        zoom: 1
      };



      var render = function () {
        var lens, full;
        lens = model.lazyLens;
        full = model.lazyFull;
        var css = toCSS(lens);
        $lens.css(css);
        var fullCSS = toCSS(full);
        $full.css(fullCSS);
      };


      $el.addClass('mag-host');

      var $lens = $('<div class="mag-lens"></div>');
      $lens.appendTo($el);

      var $noflow = $('<div class="mag-noflow"></div>');
      $noflow.appendTo($el);

      var $zone = $('<div class="mag-zone"></div>');
      $zone.appendTo($noflow);

      var $full = $('<div class="mag-full"></div>');
      $full.html(options.content);
      $full.appendTo($noflow);


      mag.compute(model);

      model.lazyFocus = {
        x: model.focus.x,
        y: model.focus.y
      };
      model.lazyLens = {
        x: model.lens.x,
        y: model.lens.y,
        w: model.lens.w,
        h: model.lens.h
      };
      model.lazyFull = {
        x: model.full.x,
        y: model.full.y,
        w: model.full.w,
        h: model.full.h
      };
      model.lazyZoom = model.zoom;

      render();


      var rate = 5;
      var renderLoop = function () {
        model.lazyFocus.x += (model.focus.x - model.lazyFocus.x) / rate;
        model.lazyFocus.y += (model.focus.y - model.lazyFocus.y) / rate;
        model.lazyFull.x += (model.full.x - model.lazyFull.x) / rate;
        model.lazyFull.y += (model.full.y - model.lazyFull.y) / rate;
        model.lazyFull.w += (model.full.w - model.lazyFull.w) / rate;
        model.lazyFull.h += (model.full.h - model.lazyFull.h) / rate;
        // model.lazyLens.x += (model.lens.x - model.lazyLens.x) / rate;
        // model.lazyLens.y += (model.lens.y - model.lazyLens.y) / rate;
        // model.lazyLens.w += (model.lens.w - model.lazyLens.w) / rate;
        // model.lazyLens.h += (model.lens.h - model.lazyLens.h) / rate;
        model.lazyZoom += (model.zoom - model.lazyZoom) / rate;

        render();
      };


      var interval = setInterval(renderLoop, 50);

      var ratios = {
        x: model.focus.x,
        y: model.focus.y
      };

      var dragging = false;

      var dragInterval = setInterval(function () {
        // console.log('focus', model.focus);
        if (! dragging) return;

        var rate =  0.1 * (1 / model.zoom);
        model.focus.x += (ratios.x - 0.5) * rate;
        model.focus.y += (ratios.y - 0.5) * rate;

        mag.compute(model);
      }, 50);

      $zone.drag('start', function () {
        dragging = true;
      });

      $zone.drag('end', function () {
        dragging = false;
      });

      $zone.drag(function( e, dd ){
        console.log('drag', dd);
        console.log('e', e);

        var offset = $zone.offset();
        ratios = ratioOffsetsFor($zone, e.pageX - offset.left, e.pageY - offset.top);

        mag.compute(model);
      });

      $zone.on('mousewheel', function (e) {
        e.preventDefault();

        var delta = e.deltaY * 0.2;

        model.zoom += delta;

        mag.compute(model);

        console.log('full', model.full);
        console.log('focus', model.focus);
        console.log('zoom', model.zoom);
      });

    });
  };

  $.fn.mag = mag$;

  return mag$;
}));
