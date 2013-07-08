/**
 * jQuery Magnificent
 * v0.1.0
 *
 * An image zoom/magnifier plugin.
 *
 * By Anders D. Johnson
 * 
 * Depends on:
 *  jquery.bridget
 *  jquery.ba-throttle-debounce
 * 
 */
 (function ($, window, document, undefined) {
  (function (factory) {
    // AMD support
    if (typeof define === 'function' && define.amd) {
      // update with your AMD module names as necessary
      define(['jquery', 'jquery-bridget', 'jquery-debounce'], factory);
    }
    else {
      factory($);
    }
  })(function($) {

    $.event.normalizeOffsets = function (e) {
      var offset = $(e.target).offset();
      e.normalizedOffsetX = e.pageX - offset.left;
      e.normalizedOffsetY = e.pageY - offset.top;
      return e;
    };

    $.event.ratioOffsets = function (e) {
      $.event.normalizeOffsets(e);
      var $target = $(e.target);
      e.ratioOffsetY = e.normalizedOffsetY / $target.height();
      e.ratioOffsetX = e.normalizedOffsetX / $target.width();
    };

    function Area ($element, options) {
      var self = this;
      self.options = options || {};
      self.options.cssPrefix = self.options.cssPrefix || '';
      self.options.eventNamespace = self.options.eventNamespace || 'magnificent';

      $element = $element || $('<div class="' + self.options.cssPrefix + 'area"><div class="inner"></div></div>');
      self.$element = $element;

      self.init = function () {
        var self = this;

        if (self.options.crosshairs) {
          self.$element.css({
            cursor: 'crosshair'
          });
        }

        self.$element.on('mouseenter', function(e) {
          self.$element.trigger(self.options.eventNamespace + '.enter');
        });

        self.$element.on('mouseleave', function(e) {
          self.$element.trigger(self.options.eventNamespace + '.leave');
        });

        self.$element.on('mousemove', function(e) {
          var $this = $(this);
          $.event.ratioOffsets(e);
          self.$element.trigger(self.options.eventNamespace + '.position', {
            top: e.ratioOffsetY,
            left: e.ratioOffsetX
          });
        });
      };

      self.resize = function () {
        var self = this;
        var css = {};
        if (self.options.height) {
          css.height = self.options.height();
        }
        if (self.options.width) {
          css.width = self.options.width();
        }
        self.$element.css(css);
      };

      self.layout = function () {
        var self = this;
        self.resize();
      };

      self.destroy = function () {
        self.$element.remove();
      };
    }

    function Viewport ($element, options) {
      var self = this;
      self.options = options || {};
      self.options.cssPrefix = self.options.cssPrefix || '';

      $element = $element || $('<div class="' + self.options.cssPrefix + 'viewport"></div>');
      self.$element = $element;

      self.actualFocus = null;
      self.targetFocus = null;
      self.speed = 8;
      self.frameTime = 20;
      self.animationLoopTimeout = null;
      self.deltaThreshold = 0.1;

      self.init = function () {
        var self = this;
        self.$inner = self.$element.find('.inner');

        self.$element.css({
          overflow: 'hidden'
        });

        var innerCSS = {
          position: 'relative' // 'absolute'
        };
        self.$inner.css(innerCSS);
      };

      self.enter = function () {
        var self = this;
      };

      self.leave = function () {
        var self = this;
      };

      self.animationLoop = function () {
        if (! self.actualFocus) {
          self.actualFocus = self.targetFocus;
        }
        if (self.targetFocus) {
          var deltaTop = (self.targetFocus.top - self.actualFocus.top) / self.speed;
          var deltaLeft = (self.targetFocus.left - self.actualFocus.left) / self.speed;
          self.actualFocus.top += deltaTop;
          self.actualFocus.left += deltaLeft;
          self.$inner.css(self.actualFocus);
          if ((Math.abs(deltaTop) < self.deltaThreshold) && (Math.abs(deltaLeft) < self.deltaThreshold)) {
            self.animationLoopTimeout = null;
          }
          else {
            self.animationLoopTimeout = setTimeout(self.animationLoop, self.frameTime);
          }
        }
      };

      self.show = function () {
        var self = this;
        if (self.options.show) {
          self.options.show.call(self);
        } else {
          self.$element.stop().hide().fadeIn({
            queue: false
          });
        }
      };

      self.hide = function () {
        var self = this;
        if (self.options.hide) {
          self.options.hide.call(self);
        } else {
          self.$element.stop().fadeOut({
            queue: false
          });
        }
      };

      self.ratio = function () {
        return {
          height: self.$element.height() / self.$inner.height(),
          width: self.$element.width() / self.$inner.width(),
        };
      };

      self.resize = function () {
        var self = this;
        var css = {};
        if (self.options.height) {
          css.height = self.options.height();
        }
        if (self.options.width) {
          css.width = self.options.width();
        }
        self.$element.css(css);
        var innerCSS = {};
        if (self.options.zoomWidth) {
          innerCSS.width = self.options.zoomWidth(1.0);
        }
        self.$inner.css(innerCSS);
      };

      self.position = function () {
        var self = this;
        var css = {};
        if (self.options.left) {
          css.left = self.options.left();
        }
        if (self.options.top) {
          css.top = self.options.top();
        }
        self.$element.css(css);
      };

      self.layout = function () {
        var self = this;
        self.resize();
        self.position();
      };

      self.constrainPosition = function (position) {
        position = (position || (self.currentPosition || {top: 0, left: 0}));

        var ratio = self.ratio();

        var top = position.top - (ratio.height / 2);
        var left = position.left - (ratio.width / 2);

        var limits = {
          top: 1 - ratio.height,
          left: 1 - ratio.width,
          bottom: 0,
          right: 0
        };
        if (top > limits.top) {
          top = limits.top;
        }
        else if (top < limits.bottom) {
          top = limits.bottom;
        }
        if (left > limits.left) {
          left = limits.left;
        }
        else if (left < limits.right) {
          left = limits.right;
        }

        return {
          top: top,
          left: left
        };
      };

      self.focus = function (position, constrain) {
        var self = this;

        constrain = (typeof constrain == 'boolean') ? constrain : true;

        position = (position || (self.currentPosition || {top: 0, left: 0}));
        self.currentPosition = position;

        var constrainedPosition;

        if (constrain) {
          constrainedPosition = self.constrainPosition(position);
        }
        else {
          constrainedPosition = position;
        }

        var top = constrainedPosition.top * self.$inner.height();
        var left = constrainedPosition.left * self.$inner.width();

        var css = {
          top: -1 * top,
          left: -1 * left
        };

        if (self.options.smoothMove) {
          self.targetFocus = css;
          if (! self.animationLoopTimeout) {
            self.animationLoop();
          }
        }
        else {
          self.$inner.css(css);
        }
      };

      self.destroy = function () {
        clearInterval(self.animationLoopTimeout);
        self.$element.remove();
      };
    }

    function Lens ($element, options) {
      var self = this;

      self.options = options;
      self.options.cssPrefix = self.options.cssPrefix || '';

      $element = $element || $('<div class="' + self.options.cssPrefix  +'lens-wrap"></div>');
      self.$element = $element;
      self.$inner = $('<div class="' + self.options.cssPrefix + 'lens-inner"></div>');
      self.$inner.appendTo(self.$element);

      self.init = function () {
        var self = this;
        self.$element.hide();
        self.$element.css({
          position: 'absolute',
          zIndex: self.options.zIndex,
          overflow: 'visible'
        });
        self.$inner.css({
          position: 'absolute',
          top: 0,
          bottom: 0,
          left: 0,
          right: 0
        });
      };

      self.show = function () {
        var self = this;
        self.$element.show();
      };

      self.hide = function () {
        var self = this;
        self.$element.hide();
      };

      self.focus = function (position) {
        var self = this;
        position = position || (self.currentPosition || {top:0, left:0});
        self.currentPosition = position;
        if (self.options.focus) {
          self.options.focus.call(self, position);
        }
      };

      self.resize = function () {
        var self = this;
        if (self.options.resize) {
          self.options.resize.call(self);
        }
        //var height = self.$element.height() - (self.$inner.outerHeight() - self.$inner.height());
        //self.$inner.height(height);
      };

      self.layout = function () {
        var self = this;
        self.resize();
      };

      self.destroy = function () {
        self.$element.remove();
      };
    }

    function Magnificent( element, options ) {
      var self = this;
      self.element = element;
      self.$element = $( element );
      self.$inner = self.$element.find('.inner');
      self.options = {};
      self.options = $.extend( true, {}, self.options, options );
      self._init();
    }

    // default options, filled later
    Magnificent.prototype.options = {};

    Magnificent.prototype._init = function() {
      var self = this;

      self.$inner.css({
        position: 'relative'
      });
      
      self.options.viewport = self.options.viewport || {};

      if (self.options.zoomWidth) {
        self.options.viewport.zoomWidth = self.options.zoomWidth;
      }

      self.options = $.extend(true, {}, {
        dataPrefix: 'magnificent',
        cssPrefix: 'magnificent-',
        eventNamespace: 'magnificent',
        mode: 'inner',
        windowResize: true // or number in ms. default below
      }, self.options);

      self.$element.addClass(self.options.cssPrefix + 'mode-' + self.options.mode);

      if (self.options.mode === 'inner') {
        self.options = $.extend(true, {}, {
          lens: false,
          viewport: {
            toggle: true,
            top: function () {
              // return self.area.$element.offset().top;
              return 0;
            },
            left: function () {
              // return self.area.$element.offset().left;
              return 0;
            },
            height: function () {
              return self.$inner.height();
            },
            width: function () {
              return self.$inner.width();
            },
          }
        }, self.options);
      }
      else {
        self.options = $.extend(true, {}, {
          viewport: {
            height: function () {
              return self.$element.height();
            },
            width: function () {
              return self.$element.width();
            },
          }
        }, self.options);
      }

      // defaults after type
      self.options = $.extend(true, {}, {
        viewport: {
          toggle: true,
          smoothMove: true,
          // default zoom level
          zoomWidth: self.options.zoomWidth || self.options.viewport.zoomWidth || '3x'
        },
        area: {
          zIndex: 100,
          height: function () {
            return self.$inner.height();
          },
          width: function () {
            return self.$inner.width();
          },
        },
        lens: {
          show: true,
          toggle: true,
          crosshairs: true
        }
      }, self.options);

      // allow zoomWidth as number
      if (typeof self.options.viewport.zoomWidth !== 'function') {
        var zoomWidth = self.options.viewport.zoomWidth;
        self.options.viewport.zoomWidth = (function () {
          var match;
          if (typeof zoomWidth === 'string' && (match = zoomWidth.match(/(\d+)x/))) {
            var scale = parseFloat(match[1]);
            return function () {
              return self.area.$element.width() * scale;
            };
          }
          else {
            return function () {
              return zoomWidth;
            };
          }
        })();
      }

      if (self.options.windowResize === true) {
        self.options.windowResize = 500;
      }

      var $area = $('<div class="' + self.options.cssPrefix + 'area"></div>');
      $area.css({
        position: 'absolute',
        zIndex: self.options.area.zIndex,
        top: 0,
        left: 0,
        // IE won't trigger mouseover events on transparent backgrounds
        background: 'white',
        opacity: 0,
        filter: 'alpha(opacity=0)',
        '-ms-filter': 'alpha(opacity=0)',
        '-khtml-opacity': 0,
        '-moz-opacity': 0
      });

      self.$inner.append($area);
      self.$inner.css({
        position: 'relative'
      });

      /**
       * Area
       */
      var areaOptions = $.extend(true, {}, self.options.area, {
        height: self.options.area.height ? $.proxy(self.options.area.height, self) : null,
        width: self.options.area.width ? $.proxy(self.options.area.width, self) : null,
        eventNamespace: self.options.eventNamespace,
        crosshairs: self.options.lens.crosshairs
      });
      self.area = new Area($area, areaOptions);
      self.area.init();
      self.area.layout();

      var id = self.$element.attr('data-' + self.options.dataPrefix);

      // Viewport
      var viewportSelector = '[data-'  + self.options.dataPrefix + '-viewport="' + id + '"]';
      var $originalViewport = $(viewportSelector);
      var $viewport = $originalViewport.clone();
      $originalViewport.after($viewport);
      $originalViewport.detach();
      self.$originalViewport = $originalViewport;

      $viewport.addClass(self.options.cssPrefix + 'viewport');
      $viewport.addClass(self.options.cssPrefix + 'viewport-mode-' + self.options.mode);

      if (self.options.viewport.toggle) {
        $viewport.hide();
      }

      if (self.options.mode === 'inner') {
        $viewport.css({
          position: 'absolute',
          zIndex: self.options.area.zIndex - 2 // space for lens
        });
      }
      else {
        $viewport.css({
          position: 'relative'
        })
      }

      var viewportOptions = $.extend(true, {}, self.options.viewport, {
        zoomWidth: $.proxy(self.options.viewport.zoomWidth, self),
        height: self.options.viewport.height ? $.proxy(self.options.viewport.height, self) : null,
        width: self.options.viewport.width ? $.proxy(self.options.viewport.width, self) : null,
        top: self.options.viewport.top ? $.proxy(self.options.viewport.top, self) : null,
        left: self.options.viewport.left ? $.proxy(self.options.viewport.left, self) : null
      });
      self.viewport = new Viewport($viewport, viewportOptions);

      if (self.options.mode === 'inner') {
        self.viewport.$element.appendTo(self.$inner);
      }

      self.viewport.init();
      self.viewport.layout();

      /**
       * Lens
       */
      if (self.options.lens) {
        var lensOptions = $.extend(true, {}, self.options.lens, {
          cssPrefix: self.options.cssPrefix,
          resize: function () {
            var ratio = self.viewport.ratio();
            var height = ratio.height * self.area.$element.height();
            var width = ratio.width * self.area.$element.width();
            this.$element.height(height);
            this.$element.width(width);
          },
          focus: function (position) {
            this.$element.css({
              top: self.area.$element.height() * position.top,
              left: self.area.$element.width() * position.left
            });
          },
          zIndex: self.options.area.zIndex - 1
        });
        self.lens = new Lens(null, lensOptions);
        self.lens.init();
        self.lens.resize();
        self.lens.$element.appendTo(self.$inner);
      }

      self.area.$element.on(self.options.eventNamespace + '.enter', function (e) {
        if (self.viewport.options.toggle) {
          self.viewport.show();
        }
        self.viewport.layout();
        if (self.lens && self.lens.options.toggle) {
          self.lens.show();
          self.lens.layout();
        }
        self.viewport.enter();
      });

      self.area.$element.on(self.options.eventNamespace + '.position', function (e, position) {
        var position = self.viewport.constrainPosition(position);
        self.viewport.focus(position, false);
        if (self.lens) {
          self.lens.focus(position);
        }
      });

      self.area.$element.on(self.options.eventNamespace + '.leave', function (e) {
        if (self.options.viewport.toggle) {
          self.viewport.hide();
        }
        if (self.lens && self.options.lens.toggle) {
          self.lens.hide();
        }
        self.viewport.leave();
      });

      // initialize the area height/width
      self.$inner.on('mouseenter', function () {
        self.layout();
      });

      if (self.options.windowResize) {
        var throttled = self.options.windowResize;
        $(window).on('resize', $.throttle(throttled, function () {
          self.$element.magnificent('layout');
          self.$element.magnificent('focus');
        }));
      }

    };

    Magnificent.prototype.instance = function () {
      return this;
    }

    Magnificent.prototype.layout = function () {
      var self = this;
      self.area.layout();
      self.viewport.layout();
      if (self.lens) {
        self.lens.layout();
      }
    };

    Magnificent.prototype.focus = function (position) {
      var self = this;
      self.viewport.focus(position);
      if (self.lens) {
        self.lens.focus(position);
      }
    };

    Magnificent.prototype.destroy = function () {
      var self = this;
      self.viewport.$element.after(self.$originalViewport);
      self.viewport.destroy();
      self.area.destroy();
      if (self.lens) {
        self.lens.destroy();
      }
    };

    $.bridget('magnificent', Magnificent);

    return $.fn.magnificent;

  });
})(window.jQuery, window, document);
