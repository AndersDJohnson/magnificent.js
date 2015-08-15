# magnificent

> Zoom responsively. A jQuery plugin for responsive zoom of images & more!

[![NPM version](https://badge.fury.io/js/magnificent.svg)](http://badge.fury.io/js/magnificent)
[![Bower](https://img.shields.io/bower/v/magnificent.svg)]()
 [![Build Status](https://travis-ci.org/adjohnson916/magnificent.js.svg)](https://travis-ci.org/adjohnson916/magnificent.js) 
[![dependencies](https://david-dm.org/adjohnson916/magnificent.js.svg)](https://david-dm.org/adjohnson916/magnificent.js)
[![dependencies](https://david-dm.org/adjohnson916/magnificent.js/dev-status.svg)](https://david-dm.org/adjohnson916/magnificent.js#info=devDependencies)
[![Gratipay](https://img.shields.io/gratipay/adjohnson916.svg)](https://gratipay.com/adjohnson916/)

[![NPM](https://nodei.co/npm/magnificent.png)](https://nodei.co/npm/magnificent/)


[![Join the chat at https://gitter.im/adjohnson916/magnificent.js](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/adjohnson916/magnificent.js?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

Check out the [demo][mag-demo]!

## New in v2

* Scroll to zoom
* Drag interaction
* Inline option
* Controls
* Independent proportions for thumb vs. zoom
* CSS 3D transforms
* Full screen (coming soon)

## Install

### Bower

Install with [bower](http://bower.io/)

```sh
$ bower install magnificent --save
```

### Manual

[Download manually](https://github.com/adjohnson916/magnificent.js/releases).

## Usage

In your page, include:

* All main files:

  * [src/js/mag.js](src/js/mag.js)
  * [src/js/mag-jquery.js](src/js/mag-jquery.js)
  * [src/js/mag-control.js](src/js/mag-control.js)
    * Optional: For controls.
  * [src/css/mag.css](src/css/mag.css)
  * [src/theme/default.css](src/theme/default.css)
    * Optional: Or another theme.


```html
<script src="bower_components/magnificent/src/js/mag.js"></script>
<script src="bower_components/magnificent/src/js/mag-jquery.js"></script>
<script src="bower_components/magnificent/src/js/mag-control.js"></script>
<link rel="stylesheet" href="bower_components/magnificent/src/css/mag.css" />
<link rel="stylesheet" href="bower_components/magnificent/src/theme/default.css" />
```


* Any dependencies:

  * [jquery](https://github.com/jquery/jquery)@[>=1.4.2 <3](https://github.com/jquery/jquery/tree/2.1.4)
    * [bower_components/jquery/dist/jquery.js](https://raw.githubusercontent.com/jquery/jquery/2.1.4/dist/jquery.js)
  * [jquery-bridget](https://github.com/desandro/jquery-bridget)@[~1.1.0](https://github.com/desandro/jquery-bridget/tree/v1.1.0)
    * [bower_components/jquery-bridget/jquery.bridget.js](https://raw.githubusercontent.com/desandro/jquery-bridget/v1.1.0/jquery.bridget.js)
  * [jquery-mousewheel](https://github.com/jquery/jquery-mousewheel)@[~3.1.12](https://github.com/jquery/jquery-mousewheel/tree/3.1.13)
    * [bower_components/jquery-mousewheel/jquery.mousewheel.js](https://raw.githubusercontent.com/jquery/jquery-mousewheel/3.1.13/./jquery.mousewheel.js)
      * Optional: For scroll zoom.
  * [jquery.threedubmedia](https://github.com/threedubmedia/jquery.threedubmedia)@[*](https://github.com/threedubmedia/jquery.threedubmedia/tree/master)
    * [bower_components/jquery.threedubmedia/event.drag/jquery.event.drag.js](https://raw.githubusercontent.com/threedubmedia/jquery.threedubmedia/master/event.drag/jquery.event.drag.js)
      * Optional: For drag interaction.
  * [screenfull](https://github.com/sindresorhus/screenfull.js)@[~2.0.0](https://github.com/sindresorhus/screenfull.js/tree/v2.0.0)
    * [bower_components/screenfull/dist/screenfull.js](https://raw.githubusercontent.com/sindresorhus/screenfull.js/v2.0.0/dist/screenfull.js)
      * Optional: For fullscreen.


```html
<script src="bower_components/jquery/dist/jquery.js"></script>
<script src="bower_components/jquery-bridget/jquery.bridget.js"></script>
<script src="bower_components/jquery-mousewheel/jquery.mousewheel.js"></script>
<script src="bower_components/jquery.threedubmedia/event.drag/jquery.event.drag.js"></script>
<script src="bower_components/screenfull/dist/screenfull.js"></script>
```


Then see usage examples in [demo][mag-demo].
Also see the [JSDoc][mag-jsdoc], especially the [options][mag-jsdoc-opts].

## Contributing

Pull requests and stars are always welcome. For bugs and feature requests, [please create an issue](https://github.com/adjohnson916/magnificent.js/issues/new).


In lieu of a formal styleguide, please:
 - Take care to maintain the existing coding style
 - Add unit tests for any new or changed functionality
 - Re-build documentation with [verb-cli](https://github.com/assemble/verb-cli) before submitting a pull request.


### Build Docs

Install dev dependencies, then run [verb]:

```js
$ npm install -d && verb
```

[verb]: https://github.com/verbose/verb

### Tests

Install dev dependencies:

```sh
$ npm i -d && npm test
```

## v1.x

See https://github.com/adjohnson916/magnificent.js/tree/v1.x.

## Alternatives

* [Magnifier.js]
* [ElevateZoom]

## License
Copyright © 2013-2015 [Anders D. Johnson](https://github.com/adjohnson916).
Released under the MIT license.


***

_This file was generated by [verb-cli](https://github.com/assemble/verb-cli) on August 15, 2015._

[mag-demo]: http://adjohnson916.github.io/magnificent.js/examples/demo/
[mag-jsdoc]: http://adjohnson916.github.io/magnificent.js/docs/jsdoc/
[mag-jsdoc-opts]: http://adjohnson916.github.io/magnificent.js/docs/jsdoc/global.html#MagnificentOptions
[bower]: http://bower.io/
[Magnifier.js]: http://mark-rolich.github.io/Magnifier.js/
[ElevateZoom]: http://www.elevateweb.co.uk/image-zoom
