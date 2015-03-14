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

      options = $.extend({
        //move: 'follow'
        move: 'drag'
      }, options);

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


      var lazyRate = 0.5;
      var frameSpeed = 20;
      var baseDragRate = 0.2;
      var zoomRate = 0.5;


      var approximate = function (thresh, source, dest, prop, destProp) {
        destProp = destProp ? destProp : prop;
        var diff = source[prop] - dest[destProp];
        //if (Math.abs(diff) > thresh) {
        if (true) {
          dest[destProp] += diff * lazyRate;
        }
        else {
          console.log('blocked');
        }
      };

      var approximates = function (thresh, source, dest, props) {
        $.each(props, function (i, prop) {
          approximate(thresh, source, dest, prop);
        });
      };

      var renderLoop = function () {
        approximate(0, model, model, 'lazyZoom', 'zoom');
        approximates(0, model.focus, model.lazyFocus, ['x', 'y']);
        approximates(0, model.full, model.lazyFull, ['x', 'y', 'w', 'h']);
        approximates(0, model.lens, model.lazyLens, ['x', 'y', 'w', 'h']);

        render();
      };

      var ratios = {
        x: model.focus.x,
        y: model.focus.y
      };

      if (options.move === 'drag') {
        var dragging = false;

        var dragInterval = setInterval(function () {
          // console.log('focus', model.focus);
          if (! dragging) return;

          var focus = model.focus;

          var dragRate =  baseDragRate * (1 / model.zoom);
          focus.x += (ratios.x - 0.5) * dragRate;
          focus.y += (ratios.y - 0.5) * dragRate;

          console.log('focus', focus);

          focus = {
            x: mag.minMax(focus.x, 0, 1),
            y: mag.minMax(focus.y, 0, 1)
          };

          model.focus = focus;

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

          var offset = $zone.offset();
          ratios = ratioOffsetsFor($zone, e.pageX - offset.left, e.pageY - offset.top);
        });
      }

      $zone.on('mousewheel', function (e) {
        e.preventDefault();

        var zoom = model.zoom;

        console.log('zoom pre', zoom);

        var delta = e.deltaY * zoomRate;

        console.log('delta', delta);

        zoom += delta;

        console.log('zoom deltad', zoom);

        zoom = mag.minMax(zoom, 1, 10);

        console.log('zoom constrain', zoom);

        model.zoom = zoom;

        mag.compute(model);

        console.log('zoom post compute', model.zoom);

        console.log('full', model.full);
        console.log('focus', model.focus);
      });

      var interval = setInterval(renderLoop, frameSpeed);

    });
  };

  $.fn.mag = mag$;

  return mag$;
}));
