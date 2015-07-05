(function (root, factory) {
  var name = 'MagnificentControl';
  if (typeof define === 'function' && define.amd) {
    define(['jquery', 'jquery-bridget'], function (mag, $) {
        return (root[name] = factory(mag, $));
    });
  } else if (typeof exports === 'object') {
    module.exports = factory(require('jquery'), require('jquery-bridget'));
  } else {
    root[name] = factory($);
  }
}(this, function ($) {

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
      if (x != null) {
        x = $.parseJSON(x);
      }
      var y = $(this).attr('mag-ctrl-move-by-y');
      if (y != null) {
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
  };


  $.bridget('magCtrl', MagnificentControl);

  return MagnificentControl;
}));
