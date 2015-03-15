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

      var $lens;

      options = $.extend({
        mode: 'inner',
        position: 'mirror',
        positionEvent: 'move',
        constrainLens: true,
        constrainZoomed: false,
        theme: 'default',
        initialShow: 'thumb'
      }, options);

      if (options.mode === 'outer' && options.showLens == null) {
        options.showLens = true;
      }

      if (! options.content) {
        options.content = $el.html();
      }

      if (! options.contentThumb) {
        options.contentThumb = options.content;
      }

      var model = {
        mode: 'overflow',
        focus: {
          x: 0.5,
          y: 0.5
        },
        zoom: 2,
        lens: {
          w: 0,
          h: 0
        }
      };

      var render = function () {
        var lens, zoomed;
        if ($lens) {
          lens = model.lazyLens;
          var lensCSS = toCSS(lens);
          $lens.css(lensCSS);
        }
        zoomed = model.lazyZoomed;
        var zoomedCSS = toCSS(zoomed);
        $zoomed.css(zoomedCSS);
      };


      $el.empty();
      $el.addClass('mag-host');


      if (options.mode) {
        $el.attr('mag-mode', options.mode);
      }

      if (options.theme) {
        $el.attr('mag-theme', 'default');
      }

      if (options.positionEvent) {
        $el.attr('mag-position-event', options.positionEvent);
      }

      if (options.showLens) {
        $lens = $('<div class="mag-lens"></div>');
        $el.append($lens);
      }

      var $noflow = $('<div class="mag-noflow" mag-theme="' + options.theme + '"></div>');
      $el.append($noflow);

      var $zone = $('<div class="mag-zone"></div>');
      $noflow.append($zone);


      var $zoomedContainer;
      if (options.mode === 'inner') {
        $zoomedContainer = $noflow;
        $noflow.addClass('mag-zoomed-bg');
      }
      else if (options.mode === 'outer') {
        if (! options.zoomedContainer) {
          throw new Error("Required 'zoomedContainer' option.");
        }
        $zoomedContainer = $(options.zoomedContainer);
        $zoomedContainer.addClass('mag-zoomed-container');
        $zoomedContainer.addClass('mag-zoomed-bg');
        $zoomedContainer.attr('mag-theme', options.theme);

        //$host.append(options.content);
      }
      else {
        throw new Error("Invalid 'mode' option.");
      }

      var $thumb = $('<div class="mag-thumb"></div>');
      $thumb.html(options.contentThumb);
      $host.append($thumb);


      var $zoomed = $('<div class="mag-zoomed"></div>');
      $zoomed.html(options.content);
      $zoomedContainer.append($zoomed);


      if (options.initialShow === 'thumb') {
        $zoomedContainer.hide();
      }
      else if (options.initialShow === 'zoomed') {
        //
      }
      else {
        throw new Error("Invalid 'initialShow' option.");
      }


      $el.on('mouseenter', function () {
        $zoomedContainer.show();
      });
      $el.on('mouseleave', function () {
        $zoomedContainer.hide();
      });


      mag.compute(model, options);

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
      model.lazyZoomed = {
        x: model.zoomed.x,
        y: model.zoomed.y,
        w: model.zoomed.w,
        h: model.zoomed.h
      };
      model.lazyZoom = model.zoom;

      render();


      var lazyRate = 1;
      var frameIntervalTime = 100;
      var dragRate = 0.2;
      var zoomRate = 0.5;

      var approach = function (rate, dest, src, props, srcProps) {
        srcProps = srcProps ? srcProps : props;
        if (! $.isArray(props)) {
          props = [props];
          srcProps = [srcProps];
        }
        for (var i = 0, m = props.length; i < m; ++i) {
          var prop = props[i];
          var srcProp = srcProps[i];
          var diff = src[srcProp] - dest[prop];
          dest[prop] += diff * rate;
        }
      };

      var renderLoop = function () {
        approach(lazyRate, model.lazyFocus, model.focus, 'x');
        approach(lazyRate, model.lazyFocus, model.focus, 'y');
        approach(lazyRate, model.lazyZoomed, model.zoomed, ['x', 'y', 'w', 'h']);
        approach(lazyRate, model.lazyLens, model.lens, ['x', 'y', 'w', 'h']);
        approach(lazyRate, model, model, 'lazyZoom', 'zoom');

        render();
      };


      var adjustForMirror = function (focus) {
        focus = {
          x: mag.minMax(focus.x, 0, 1),
          y: mag.minMax(focus.y, 0, 1)
        };
        model.focus.x = focus.x;
        model.focus.y = focus.y;

        mag.compute(model, options);
      };


      if (options.position === 'mirror') {
        if (options.positionEvent === 'move') {
          lazyRate = 0.2;
          frameIntervalTime = 20;

          $zone.on('mousemove', function(e){
            var ratios = ratioOffsets(e);
            adjustForMirror(ratios);
          });
        }
        else if (options.positionEvent === 'hold') {
          lazyRate = 0.2;
          frameIntervalTime = 20;

          $zone.drag('start', function () {
            dragging = true;
            $el.addClass('mag--dragging');
          });

          $zone.drag('end', function () {
            dragging = false;
            $el.removeClass('mag--dragging');
          });

          $zone.drag(function( e, dd ){
            var offset = $zone.offset();
            var ratios = ratioOffsetsFor($zone, e.pageX - offset.left, e.pageY - offset.top);
            adjustForMirror(ratios);
          });
        }
        else {
          throw new Error("Invalid 'positionEvent' option.");
        }
      }
      else if (options.position === 'joystick') {

        var joystickIntervalTime = 50;

        var dragging = false;

        var ratios = {
          x: model.focus.x,
          y: model.focus.y
        };


        if (options.positionEvent === 'move') {
          dragging = true;
          lazyRate = 0.5;
          frameIntervalTime = 20;

          $zone.on('mousemove', function(e){
            ratios = ratioOffsets(e);
          });
        }
        else if (options.positionEvent === 'hold') {
          lazyRate = 0.5;
          frameIntervalTime = 20;

          $zone.drag('start', function () {
            dragging = true;
            $el.addClass('mag--dragging');
          });

          $zone.drag('end', function () {
            dragging = false;
            $el.removeClass('mag--dragging');
          });

          $zone.drag(function( e, dd ){

            var offset = $zone.offset();
            ratios = ratioOffsetsFor($zone, e.pageX - offset.left, e.pageY - offset.top);
          });
        }
        else {
          throw new Error("Invalid 'positionEvent' option.");
        }


        var joystickInterval = setInterval(function () {
          if (! dragging) return;

          var focus = model.focus;

          //var adjustedDragRate =  dragRate * model.zoom;
          var adjustedDragRate =  dragRate;
          focus.x += (ratios.x - 0.5) * adjustedDragRate;
          focus.y += (ratios.y - 0.5) * adjustedDragRate;

          focus = {
            x: mag.minMax(focus.x, 0, 1),
            y: mag.minMax(focus.y, 0, 1)
          };

          model.focus.x = focus.x;
          model.focus.y = focus.y;

          mag.compute(model, options);
        }, joystickIntervalTime);

      }
      else {
        throw new Error("Invalid 'position' option.");
      }


      $zone.on('mousewheel', function (e) {
        e.preventDefault();

        var delta = e.deltaY * zoomRate;

        var zoom = model.zoom;
        zoom += delta;
        zoom = mag.minMax(zoom, 1, 10);

        model.zoom = zoom;

        mag.compute(model, options);
      });

      var renderLoopInterval = setInterval(renderLoop, frameIntervalTime);

    });
  };

  $.fn.mag = mag$;

  return mag$;
}));
