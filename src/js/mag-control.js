(function (root, factory) {
  var name = 'MagnificentControl';
  if (typeof define === 'function' && define.amd) {
    define(['jquery', './mag-analytics', 'jquery-bridget'], function (jQuery, MagnificentAnalytics) {
        return (root[name] = factory(jQuery, MagnificentAnalytics));
    });
  } else if (typeof exports === 'object') {
    module.exports = factory(require('jquery'), require('./mag-analytics'), require('jquery-bridget'));
  } else {
    root[name] = factory(root.jQuery, root.MagnificentAnalytics);
  }
}(this, function ($, MagnificentAnalytics) {

  var MagnificentControl = function (element, options) {
    this.element = $( element );
    this.options = $.extend( true, {}, this.options, options );
    this._init();
  };

  MagnificentControl.prototype._init = function () {

    var $el = this.element;
    var el = $el.get(0);

    this.$mag = $(this.options.mag);
    this.mag = this.$mag.get(0);
    this.magInst = this.$mag.data('mag');

    var $mag = this.$mag;
    var mag = this.mag;
    var magInst = this.magInst;

    $el.find('[mag-ctrl-zoom-by]').on('click', function () {
      var zoomBy = $.parseJSON($(this).attr('mag-ctrl-zoom-by'));
      magInst.zoomBy(zoomBy);
    });

    $el.find('[mag-ctrl-move-by-x], [mag-ctrl-move-by-y]').on('click', function () {
      var x = $(this).attr('mag-ctrl-move-by-x');
      if (x) {
        x = $.parseJSON(x);
      }
      var y = $(this).attr('mag-ctrl-move-by-y');
      if (y) {
        y = $.parseJSON(y);
      }
      var moveBy = {
        x: x,
        y: y
      };
      magInst.moveBy(moveBy);
    });

    $el.find('[mag-ctrl-fullscreen]').on('click', function () {
      if (screenfull) {
        if (screenfull.enabled) {
          screenfull.request(mag);
        }
      }
    });

    $el.find('[mag-ctrl-destroy]').on('click', function () {
      magInst.destroy();
    });
  };


  $.bridget('magCtrl', MagnificentControl);


  if (MagnificentAnalytics) {
    MagnificentAnalytics.track('mag-control.js');
  }

  return MagnificentControl;
}));
