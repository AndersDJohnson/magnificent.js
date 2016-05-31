/**
 * mag-jquery
 */


/**
 * @external jQuery
 * @see {@link https://api.jquery.com/jQuery/}
 */

/**
 * @external HTMLElement
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement}
 */


(function (root, factory) {
  var name = 'Magnificent';
  if (typeof define === 'function' && define.amd) {
    define(['./mag', './mag-analytics', 'jquery', 'hammerjs', 'prevent-ghost-click', 'jquery-bridget'],
      function (mag, MagnificentAnalytics, jQuery, Hammer) {
        return (root[name] = factory(mag, MagnificentAnalytics, jQuery, Hammer, PreventGhostClick));
      }
    );
  } else if (typeof exports === 'object') {
    module.exports = factory(require('./mag'), require('./mag-analytics'),
      require('jquery'), require('hammerjs'), require('prevent-ghost-click'),
      require('jquery-bridget')
    );
  } else {
    root[name] = factory(root.Mag, root.MagnificentAnalytics,
      root.jQuery, root.Hammer, root.PreventGhostClick
    );
  }
}(this, function (Mag, MagnificentAnalytics, $, Hammer) {


  $(':root').addClass('mag-js');


  var normalizeOffsets = function (e, $target) {
    $target = $target || $(e.target);
    var offset = $target.offset();
    return {
      x: e.pageX - offset.left,
      y: e.pageY - offset.top
    };
  };

  var ratioOffsets = function (e, $target) {
    $target = $target || $(e.target);
    var normOff = normalizeOffsets(e, $target);
    return {
      x: normOff.x / $target.width(),
      y: normOff.y / $target.height()
    };
  };

  var ratioOffsetsFor = function ($target, x, y) {
    return {
      x: x / $target.width(),
      y: y / $target.height()
    };
  };

  var cssPerc = function (frac) {
    return (frac * 100) + '%';
  };

  var toCSS = function (pt, mode, id) {

    if (mode === '3d') {
      return toCSSTransform3d(pt, id);
    }

    if (mode === '2d') {
      return toCSSTransform2d(pt, id);
    }

    // mode === 'position'
    return toCSSPosition(pt, id);
  };

  var toCSSPosition = function (pt, id) {
    var css = {};

    if (pt.x !== undefined) css.left = cssPerc(pt.x);
    if (pt.y !== undefined) css.top = cssPerc(pt.y);
    if (pt.w !== undefined) css.width = cssPerc(pt.w);
    if (pt.h !== undefined) css.height = cssPerc(pt.h);

    return css;
  };

  var toCSSTransform2d = function (pt, id) {
    var css = {};
    var left;
    var top;
    var width;
    var height;

    var x = pt.x;
    var y = pt.y;
    var w = pt.w;
    var h = pt.h;

    x += (w - 1) * (0.5 - x) / w;
    y += (h - 1) * (0.5 - y) / h;

    if (x !== undefined) left = cssPerc(x);
    if (y !== undefined) top = cssPerc(y);
    if (w !== undefined) width = w;
    if (h !== undefined) height = h;

    var transform = '';

    if (width) transform += ' scaleX(' + width + ')';
    if (height) transform += ' scaleY(' + height + ')';
    if (left) transform += ' translateX(' + left + ')';
    if (top) transform += ' translateY(' + top + ')';

    css['-webkit-transform'] = transform;
    css['-moz-transform'] = transform;
    css['-ms-transform'] = transform;
    css['-o-transform'] = transform;
    css.transform = transform;

    return css;
  };

  var toCSSTransform3d = function (pt, id) {
    var css = {};
    var left;
    var top;
    var width;
    var height;

    var x = pt.x;
    var y = pt.y;
    var w = pt.w;
    var h = pt.h;

    x += (w - 1) * (0.5 - x) / w;
    y += (h - 1) * (0.5 - y) / h;

    if (x !== undefined) left = cssPerc(x);
    if (y !== undefined) top = cssPerc(y);
    if (w !== undefined) width = w;
    if (h !== undefined) height = h;

    var transform = '';
    transform += ' scale3d(' +
      (width !== undefined ? width : 0) + ',' +
      (height !== undefined ? height : 0) +
      ',1)';
    transform += ' translate3d(' +
      (left !== undefined ? left : 0) + ',' +
      (top !== undefined ? top : 0) +
      ',0)';

    css['-webkit-transform'] = transform;
    css['-moz-transform'] = transform;
    css['-ms-transform'] = transform;
    css['-o-transform'] = transform;
    css.transform = transform;

    css.width = '100%';
    css.height = '100%';
    css.position = 'absolute';
    css.top = '0';
    css.left = '0';

    return css;
  };

  /**
   * Magnificent constructor.
   * 
   * @alias module:mag-jquery
   * 
   * @class
   * @param {external:HTMLElement|external:jQuery} element - DOM element to embellish.
   * @param {MagnificentOptions} options - Options to override defaults.
   */
  var Magnificent = function (element, options) {
    this.element = $( element );
    this.options = $.extend( true, {}, this.options, options );
    this._init();
  };

  /**
   * Default options.
   *
   * @typedef MagnificentOptions
   *
   *  Mode:<br>
   * @property {string} mode
   *  <dl>
   *    <dt>"inner"</dt><dd><i>(default)</i> Zoom region embedded in thumbnail.</dd>
   *    <dt>"outer"</dt><dd>Zoom region independent of thumbnail.</dd>
   *  </dl>
   * @property {string|boolean} position - What interaction(s) position zoomed region.
   *  <dl>
   *    <dt>"mirror"</dt><dd><i>(default)</i> Zoomed region follows mouse/pointer.</dd>
   *    <dt>"drag"</dt><dd>Drag to move.</dd>
   *    <dt>"joystick"</dt><dd>Weird joystick interaction to move.</dd>
   *    <dt>false</dt><dd>No mouse/touch.</dd>
   *  </dl>
   * @property {string} positionEvent - Controls what event(s) cause positioning.
   *  <dl>
   *    <dt>"move"</dt><dd><i>(default)</i> On move (e.g. mouseover).</dd>
   *    <dt>"hold"</dt><dd>On hold (e.g. while mousedown).</dd>
   *  </dl>
   * @property {string} theme - Themes apply a style to the widgets.
   *  <dl>
   *    <dt>"default"</dt><dd><i>(default)</i> Default theme.</dd>
   *  </dl>
   * @property {string} initialShow
   *  <dl>
   *    <dt>"thumb"</dt><dd><i>(default)</i> Whether to show thumbnail or zoomed first,
   *      e.g. in "inner" mode.</dd>
   *  </dl>
   * @property {number} zoomRate - Rate at which to adjust zoom, from (0,∞). Default = 0.2.
   * @property {number} zoomMin - Minimum zoom level allowed, from (0,∞). Default = 2.
   * @property {number} zoomMax - Maximum zoom level allowed, from (0,∞). Default = 10.
   * @property {number} dragRate - Rate at which to drag, from (0,∞). Default = 0.2.
   * @property {number} ratio - Ratio of outer (w/h) to inner (w/h) container ratios. Default = 1.
   * @property {boolean} constrainLens - Whether lens position is constrained. Default = true.
   * @property {boolean} constrainZoomed - Whether zoomed position is constrained. Default = false.
   * @property {boolean} toggle - Whether toggle display of zoomed vs. thumbnail upon interaction. Default = true.
   * @property {boolean} smooth - Whether the zoomed region should gradually approach target, rather than immediately. Default = true.
   * @property {string} cssMode - CSS mode to use for scaling and translating. Either '3d', '2d', or 'position'. Default = '3d'.
   * @property {number} renderIntervalTime - Milliseconds for render loop interval. Adjust for performance vs. frame rate. Default = 20.
   * @property {MagModel} initial - Initial settings for model - focus, lens, zoom, etc.
   */
  Magnificent.prototype.options = {
    mode: 'inner',
    position: 'mirror',
    positionEvent: 'move',
    theme: 'default',
    initialShow: 'thumb',
    constrainLens: true,
    constrainZoomed: false,
    zoomMin: 1,
    zoomMax: 10,
    zoomRate: 0.2,
    dragRate: 0.2,
    ratio: 1,
    toggle: true,
    smooth: true,
    renderIntervalTime: 20,
    cssMode: '3d',
    eventNamespace: 'magnificent',
    dataNamespace: 'magnificent'
  };


  /**
   * Default toggle implementation.
   *
   * @param {boolean} enter - Whether entering, rather leaving.
   */
  Magnificent.prototype.toggle = function (enter) {
    if (enter) {
      this.$zoomedContainer.fadeIn();
      if (this.$lens) {
        this.$lens.fadeIn();
      }
    }
    else {
      this.$zoomedContainer.fadeOut();
      if (this.$lens) {
        this.$lens.fadeOut();
      }
    }
  };




  Magnificent.prototype.compute = function () {
    var that = this;
    that.mag.compute();
    that.$el.trigger('compute', that);
  };


  Magnificent.prototype.render = function () {
    var that = this;
    var lens, zoomed;
    var $lens = this.$lens;
    var $zoomed = this.$zoomed;
    if ($lens) {
      lens = this.modelLazy.lens;
      var lensCSS = toCSS(lens, that.options.cssMode, that.id);
      $lens.css(lensCSS);
    }
    zoomed = this.modelLazy.zoomed;
    var zoomedCSS = toCSS(zoomed, that.options.cssMode, that.id);
    $zoomed.css(zoomedCSS);

    this.$el.trigger('render', that);
  };


  Magnificent.prototype.eventName = function (name) {
    name = name || '';
    var namespace = this.options.eventNamespace;
    return name + (namespace ? ('.' + namespace) : '');
  };


  Magnificent.prototype.dataName = function (name) {
    name = name || '';
    var namespace = this.options.dataNamespace;
    return (namespace ? (namespace + '.') : '') + name;
  };


  Magnificent.prototype._init = function () {

    var that = this;

    var $el = this.$el = this.element;

    this.$originalEl = $el.clone();

    var options = this.options;

    var id = $el.attr('mag-thumb');
    this.id = id;

    if ($.isFunction(options.toggle)) {
      this.toggle = options.toggle;
    }

    var $lens = this.$lens;

    var ratio = options.ratio;

    var initial = options.initial || {};
    var zoom = typeof initial.zoom !== 'undefined' ? initial.zoom : 2;
    var focus = typeof initial.focus !== 'undefined' ? initial.focus : {
      x: 0.5,
      y: 0.5
    };
    var lens = typeof initial.lens !== 'undefined' ? initial.lens : {
      w: 0,
      h: 0
    };

    var model = this.model = {
      focus: focus,
      zoom: zoom,
      lens: lens,
      ratio: ratio
    };

    var mag = this.mag = new Mag({
      zoomMin: options.zoomMin,
      zoomMax: options.zoomMax,
      constrainLens: options.constrainLens,
      constrainZoomed: options.constrainZoomed,
      model: model
    });

    var modelLazy = this.modelLazy = {
      focus: {
        x: model.focus.x,
        y: model.focus.y
      },
      zoom: model.zoom,
      lens: {
        w: model.lens.w,
        h: model.lens.h
      },
      ratio: ratio
    };

    var magLazy = this.magLazy = new Mag({
      zoomMin: options.zoomMin,
      zoomMax: options.zoomMax,
      constrainLens: options.constrainLens,
      constrainZoomed: options.constrainZoomed,
      model: modelLazy
    });


    mag.compute();
    magLazy.compute();



    var $zoomedChildren;
    var $thumbChildren;
    var $zoomed;
    var $zoomedContainer;


    $thumbChildren = $el.children();


    $el.empty();
    $el.addClass('mag-host');


    if (! options.zoomedContainer) {
      options.zoomedContainer = $('[mag-zoom="' + that.id + '"]');
    }

    if (options.zoomedContainer) {
      $zoomedContainer = $(options.zoomedContainer);

      that.$originalZoomedContainer = $zoomedContainer.clone();

      $zoomedChildren = $zoomedContainer.children(); 
      $zoomedContainer.empty();

      if (options.mode === 'inner') {
        $zoomedContainer.remove();
      }
    }

    if (options.mode === 'outer' && typeof options.showLens === 'undefined') {
      options.showLens = true;
    }

    if (! $zoomedChildren || ! $zoomedChildren.length) {
      $zoomedChildren = $thumbChildren.clone();
    }

    if (options.mode) {
      $el.attr('mag-mode', options.mode);
    }

    if (options.theme) {
      $el.attr('mag-theme', 'default');
    }

    if (options.position) {
      $el.attr('mag-position', options.position);
    }
    else if (options.position === false) {
      options.positionEvent = false;
    }

    if (options.positionEvent) {
      $el.attr('mag-position-event', options.positionEvent);
    }


    $el.attr('mag-toggle', options.toggle);


    if (options.showLens) {
      $lens = this.$lens = $('<div class="mag-lens"></div>');
      $el.append($lens);
    }

    var $noflow = $('<div class="mag-noflow" mag-theme="' + options.theme + '"></div>');
    $el.append($noflow);


    if (options.mode === 'inner') {
      $zoomedContainer = $noflow;
    }
    else if (options.mode === 'outer') {
      if (! options.zoomedContainer) {
        throw new Error("Required 'zoomedContainer' option.");
      }
      $zoomedContainer = $(options.zoomedContainer);
    }
    else {
      throw new Error("Invalid 'mode' option.");
    }

    $zoomedContainer.attr('mag-theme', options.theme);
    $zoomedContainer.addClass('mag-zoomed-container');
    $zoomedContainer.addClass('mag-zoomed-bg');


    var $thumb = $('<div class="mag-thumb"></div>');
    $thumb.html($thumbChildren);
    $el.append($thumb);


    $zoomed = this.$zoomed = $('<div class="mag-zoomed"></div>');
    $zoomed.html($zoomedChildren);
    $zoomedContainer.append($zoomed);


    $zoomedContainer.attr('mag-toggle', options.toggle);


    var $zone = $('<div class="mag-zone"></div>');
    var zone = $zone.get(0);
    $el.append($zone);


    this.$el = $el;
    this.$zone = $zone;
    this.$noflow = $noflow;
    this.$thumb = $thumb;
    this.$zoomed = $zoomed;
    this.$zoomedContainer = $zoomedContainer;


    that.proxyToZone($zoomedContainer);
    if (options.mode === 'outer') {
      that.proxyToZone($thumb);
    }


    if (options.toggle) {
      if (options.initialShow === 'thumb') {
        $zoomedContainer.hide();
        if ($lens) {
          $lens.hide();
        }
      }
      else if (options.initialShow === 'zoomed') {
        //
      }
      else {
        throw new Error("Invalid 'initialShow' option.");
      }

      $el.on(that.eventName('mouseenter'), function () {
        that.toggle.call(that, true);
      });

      $el.on(that.eventName('mouseleave'), function () {
        that.toggle.call(that, false);
      });
    }


    that.render();


    var lazyRate = 0.25;
    var renderIntervalTime = options.renderIntervalTime;
    var dragRate = options.dragRate;
    var zoomRate = options.zoomRate;

    var approach = function (enabled, thresh, rate, dest, src, props, srcProps) {
      srcProps = srcProps ? srcProps : props;
      if (! $.isArray(props)) {
        props = [props];
        srcProps = [srcProps];
      }
      for (var i = 0, m = props.length; i < m; ++i) {
        var prop = props[i];
        var srcProp = srcProps[i];
        var diff = src[srcProp] - dest[prop];
        if (enabled && Math.abs(diff) > thresh) {
          dest[prop] += diff * rate;
        }
        else {
          dest[prop] += diff;
        }
      }
    };

    var renderLoop = function () {
      approach(options.smooth, 0.01, lazyRate, modelLazy.focus, model.focus, 'x');
      approach(options.smooth, 0.01, lazyRate, modelLazy.focus, model.focus, 'y');
      approach(options.smooth, 0.05, lazyRate, modelLazy, model, 'zoom');


      that.magLazy.compute();

      that.render();
    };


    var adjustForMirror = function (focus) {
      model.focus.x = focus.x;
      model.focus.y = focus.y;
      that.compute();
    };


    if (options.position === 'mirror') {
      if (options.positionEvent === 'move') {
        lazyRate = 0.2;

        $zone.on(that.eventName('mousemove'), function(e, e2){
          e = typeof e2 === 'object' ? e2 : e;
          var ratios = ratioOffsets(e, $zone);
          adjustForMirror(ratios);
        });
      }
      else if (options.positionEvent === 'hold') {
        lazyRate = 0.2;

        $zone.on(that.eventName('dragstart'), function (e, dd, e2) {
          e = typeof e2 === 'object' ? e2 : e;
          dragging = true;
          $el.addClass('mag--dragging');
        });

        $zone.on(that.eventName('dragend'), function (e, dd, e2) {
          e = typeof e2 === 'object' ? e2 : e;
          dragging = false;
          $el.removeClass('mag--dragging');
        });

        $zone.on(that.eventName('drag'), function (e, dd, e2) {
          // console.log('drag', arguments, JSON.stringify(dd));
          e = typeof e2 === 'object' ? e2 : e;
          var offset = $zone.offset();
          var ratios = ratioOffsetsFor($zone, e.pageX - offset.left, e.pageY - offset.top);
          adjustForMirror(ratios);
        });
      }
      else {
        throw new Error("Invalid 'positionEvent' option.");
      }
    }
    else if (options.position === 'drag') {

      var startFocus;

      if (options.mode === 'inner') {

        $zone.on(that.eventName('dragstart'), function (e, dd, e2) {
          e = typeof e2 === 'object' ? e2 : e;
          e.preventDefault();
          dragging = true;
          $el.addClass('mag--dragging');
          startFocus = {
            x: model.focus.x,
            y: model.focus.y
          };
        });

        $zone.on(that.eventName('dragend'), function (e, dd, e2) {
          e = typeof e2 === 'object' ? e2 : e;
          dragging = false;
          $el.removeClass('mag--dragging');
          startFocus = undefined;
        });

        $zone.on(that.eventName('drag'), function (e, dd, e2) {
          // console.log('drag', arguments, JSON.stringify(dd));
          e = typeof e2 === 'object' ? e2 : e;

          // Modified plugin to improve touch functionality
          if (e.originalEvent) {
            if (e.originalEvent.scale !== 1) {
              return;
            }
          }
          //End of modification

          var offset = $zone.offset();
          ratios = ratioOffsetsFor($zone, dd.originalX - dd.offsetX, dd.originalY - dd.offsetY);

          ratios = {
            x: ratios.x / model.zoom,
            y: ratios.y / model.zoom
          };

          var focus = model.focus;

          focus.x = startFocus.x + ratios.x;
          focus.y = startFocus.y + ratios.y;

          that.compute();
        });
      }
      else {

        $zone.on(that.eventName('dragstart'), function (e, dd, e2) {
          e = typeof e2 === 'object' ? e2 : e;
          dragging = true;
          $el.addClass('mag--dragging');
          startFocus = {
            x: model.focus.x,
            y: model.focus.y
          };
        });

        $zone.on(that.eventName('dragend'), function (e, dd, e2) {
          e = typeof e2 === 'object' ? e2 : e;
          dragging = false;
          $el.removeClass('mag--dragging');
          startFocus = undefined;
        });

        $zone.on(that.eventName('drag'), function (e, dd, e2) {
          // console.log('drag', arguments, JSON.stringify(dd));
          var offset = $zone.offset();
          ratios = ratioOffsetsFor($zone, e.pageX - offset.left, e.pageY - offset.top);

          var focus = model.focus;

          focus.x = ratios.x;
          focus.y = ratios.y;

          that.compute();
        });

        $zone.on(that.eventName('click'), function (e) {
          var offset = $zone.offset();
          ratios = ratioOffsetsFor($zone, e.pageX - offset.left, e.pageY - offset.top);

          var focus = model.focus;

          focus.x = ratios.x;
          focus.y = ratios.y;

          that.compute();
        });
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

        $zone.on(that.eventName('mousemove'), function(e){
          ratios = ratioOffsets(e, $zone);
        });
      }
      else if (options.positionEvent === 'hold') {
        lazyRate = 0.5;

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

        var adjustedDragRate = dragRate;
        focus.x += (ratios.x - 0.5) * adjustedDragRate;
        focus.y += (ratios.y - 0.5) * adjustedDragRate;
        that.compute();
      }, joystickIntervalTime);

    }
    else if (options.position === false) {
      // assume manual programmatic positioning
    }
    else {
      throw new Error("Invalid 'position' option.");
    }


    if (options.position) {
      $zone.on(that.eventName('mousewheel'), function (e, e2) {
        e = typeof e2 === 'object' ? e2 : e;
        // console.log('mousewheel', {
        //   deltaX: e.deltaX,
        //   deltaY: e.deltaY,
        //   deltaFactor: e.deltaFactor
        // });
        e.preventDefault();

        var rate = zoomRate;
        var zoom = model.zoom;
        var delta = (e.deltaY + e.deltaX) / 2;
        // if (e.deltaFactor) {
        //   delta *= e.deltaFactor;
        // }
        delta *= rate;
        delta += 1;
        zoom *= delta;
        model.zoom = zoom;
        that.compute();
      });

      if (PreventGhostClick) {
        PreventGhostClick(zone);
      }

      if (Hammer) {
        var hammerEl = zone;
        var $hammerEl = $zone;
        var hammerOptions = {};
        var hammertime = new Hammer(hammerEl, hammerOptions);

        // Register custom destroy event listener to queue Hammer destroy.
        that.$el.on('destroy', function () {
          hammertime.destroy();
        });

        $hammerEl.data(that.dataName('hammer'));

        hammertime.get('pinch').set({ enable: true });

        hammertime.on('pinch', function(e) {
          e.preventDefault();

          that.toggle.call(that, true);

          var zoom = model.zoom;
          var scale = e.scale || (e.originalEvent && e.originalEvent.scale);
          zoom *= scale;
          model.zoom = zoom;
          that.compute();
        });

        // if (options.position === 'mirror') {
        if (options.mode === 'inner') {

          var pinch = hammertime.get('pinch');
          var pan = hammertime.get('pan');

          pinch.recognizeWith(pan);

          hammertime.on('pan', function (e) {
            e.preventDefault();
            // console.log('pan', e);

            that.toggle.call(that, true);

            var rate = -0.0005;

            model.focus.x += rate * e.deltaX;
            model.focus.y += rate * e.deltaY;
          });
        }
      }
    }


    var renderLoopInterval = setInterval(renderLoop, renderIntervalTime);


  };


  Magnificent.prototype.proxyToZone = function ($el) {
    var that = this;
    var $zone = that.$zone;
    /*
      Proxy events from container to zone for weird IE 9-10 behavior despite z-index.
     */
    var proxyEvents = [
      'mousemove',
      // 'mouseenter',
      // 'mouseleave',
      // 'mouseover',
      // 'mouseout',
      'click',
      'touchstart',
      'touchend',
      'touchmove',
      'touchcancel',
      'mousewheel',
      'draginit',
      'dragstart',
      'drag',
      'dragend'
    ];
    var nsProxyEvents = $.map(proxyEvents, function (name) {
      return that.eventName(name);
    });
    $el.on(nsProxyEvents.join(' '), function (e) {
      var $t = $(this);
      var args = Array.prototype.slice.call(arguments);
      // console.log(['a', args[0], args[1], args[2], args[3], args[4], args[5]]);
      e.triggered = true;
      args.push(e);
      args.unshift(that.eventName(e.type));
      // console.log(['b', args[0], args[1], args[2], args[3], args[4], args[5]]);
      $zone.trigger.apply($zone, args);
    });
  };


  Magnificent.prototype.destroy = function() {
    var that = this;
    // Trigger custom destroy event for any listeners.
    that.$el.trigger(that.eventName('destroy'));

    // Unbind and replace elements with originals.

    that.off();

    if (that.$originalZoomedContainer && that.$zoomedContainer) {
      // Replace
      that.$zoomedContainer.after(that.$originalZoomedContainer);
      that.$zoomedContainer.remove();
    }

    // Replace
    that.$el.after(that.$originalEl);
    that.$el.remove();
  };


  Magnificent.prototype.off = function () {
    var that = this;

    if (that.$originalZoomedContainer && that.$zoomedContainer) {
      // Turn off all events.
      that.$zoomedContainer.off(that.eventName());
    }

    // Turn off all events.
    that.$el.off(that.eventName());

    return this;
  };


  Magnificent.prototype.zoomBy = function (factor) {
    this.model.zoom *= 1 + factor;
    this.compute();
  };


  Magnificent.prototype.zoomTo = function (zoom) {
    this.model.zoom = zoom;
    this.compute();
  };


  Magnificent.prototype.moveBy = function (shift) {
    if (typeof shift.x !== 'undefined') {
      if (! shift.absolute) {
        shift.x /= this.model.zoom;
      }
      this.model.focus.x += shift.x;
    }
    if (typeof shift.y !== 'undefined') {
      if (! shift.absolute) {
        shift.y /= this.model.zoom;
      }
      this.model.focus.y += shift.y;
    }
    this.compute();
  };


  Magnificent.prototype.moveTo = function (coords) {
    if (typeof coords.x !== 'undefined') {
      this.model.focus.x = coords.x;
    }
    if (typeof coords.y !== 'undefined') {
      this.model.focus.y = coords.y;
    }
    this.compute();
  };


  $.bridget('mag', Magnificent);


  if (MagnificentAnalytics) {
    MagnificentAnalytics.track('mag-jquery.js');
  }

  return Magnificent;
}));
