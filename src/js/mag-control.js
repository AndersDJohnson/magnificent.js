(function (root, factory) {
  'use strict'; // eslint-disable-line semi

  var name = 'MagnificentControl'
  if (typeof define === 'function' && define.amd) {
    define(['jquery', './mag-analytics', 'jquery-bridget'], function (jQuery, MagnificentAnalytics) {
      return (root[name] = factory(jQuery, MagnificentAnalytics, root.screenfull))
    })
  } else if (typeof exports === 'object') {
    module.exports = factory(require('jquery'), require('./mag-analytics'), require('jquery-bridget'), require('screenfull'))
  } else {
    root[name] = factory(root.jQuery, root.MagnificentAnalytic, root.screenfull)
  }
}(this, function ($, MagnificentAnalytics, screenfull) {
  'use strict'; // eslint-disable-line semi

  var MagnificentControl = function (element, options) {
    this.element = $(element)
    this.options = $.extend(true, {}, this.options, options)
    this._init()
  }

  MagnificentControl.prototype._init = function () {
    var $el = this.element

    this.$mag = $(this.options.mag)
    this.mag = this.$mag.get(0)
    this.magInst = this.$mag.data('mag')

    var mag = this.mag
    var magInst = this.magInst

    $el.find('[mag-ctrl-zoom-by], [data-mag-ctrl-zoom-by]')
    .on('click', function () {
      var attr = $(this).attr('mag-ctrl-zoom-by') || $(this).attr('data-mag-ctrl-zoom-by')
      var zoomBy = $.parseJSON(attr)
      magInst.zoomBy(zoomBy)
    })

    $el.find('[mag-ctrl-move-by-x], [mag-ctrl-move-by-y], [data-mag-ctrl-move-by-x], [data-mag-ctrl-move-by-y]')
    .on('click', function () {
      var attr = $(this).attr('mag-ctrl-move-by-x') || $(this).attr('data-mag-ctrl-move-by-x')
      var x = attr
      if (x) {
        x = $.parseJSON(x)
      }
      attr = $(this).attr('mag-ctrl-move-by-y') || $(this).attr('data-mag-ctrl-move-by-y')
      var y = attr
      if (y) {
        y = $.parseJSON(y)
      }
      var moveBy = {
        x: x,
        y: y
      }
      magInst.moveBy(moveBy)
    })

    $el.find('[mag-ctrl-fullscreen], [data-mag-ctrl-fullscreen]')
    .on('click', function () {
      if (screenfull) {
        if (screenfull.enabled) {
          screenfull.request(mag)
        }
      }
    })

    $el.find('[mag-ctrl-destroy], [data-mag-ctrl-destroy]')
    .on('click', function () {
      magInst.destroy()
    })
  }

  $.bridget('magCtrl', MagnificentControl)

  if (MagnificentAnalytics) {
    MagnificentAnalytics.track('mag-control.js')
  }

  return MagnificentControl
}))
