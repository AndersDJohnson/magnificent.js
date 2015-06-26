# magnificent.js

A jQuery plugin for responsive zoom of images & more!

Check out the [demo][mag-demo]!


## New in v2

* Scroll to zoom

## Usage

Either [download manually](https://github.com/adjohnson916/magnificent.js/releases), or install via [Bower][bower]:
```
$ bower install --save jquery-magnificent
```

For the basic setup include in your page the following dependencies:

CSS
```html
<link href="path/to/css/mag.css" rel="stylesheet">
<link href="path/to/css/theme/default.css" rel="stylesheet">
```

JavaScript
```html
<script src="https://ajax.googleapis.com/ajax/libs/jquery/2.1.4/jquery.min.js"></script>
<script type="text/javascript" src="path/to/js/jquery-bridget.js"></script>
<script type="text/javascript" src="path/to/js/mag.js"></script>
<script type="text/javascript" src="path/to/js/mag-jquery.js"></script>
```
To include jquery-bridget please refer to [jquery-bridget github project][jquery-bridget] or check your bower installation folders for the path.

To use the additional functionality described in the [demo][mag-demo], include also:

* For scroll zoom include also:
[https://github.com/jquery/jquery-mousewheel][jquery-mousewheel]

* For drag events:
[https://github.com/threedubmedia/jquery.threedubmedia][jquery-threedubmedia]

Usage examples are available in the [demo][mag-demo] and the [JSDoc][mag-jsdoc].

## v1.x

See https://github.com/adjohnson916/magnificent.js/tree/v1.x.


## Alternatives

* [Magnifier.js]
* [ElevateZoom]

[mag-demo]: http://andrz.me/magnificent.js/examples/demo/
[mag-jsdoc]: http://andrz.me/magnificent.js/doc/
[bower]: http://bower.io/ 
[Magnifier.js]: http://mark-rolich.github.io/Magnifier.js/
[ElevateZoom]: http://www.elevateweb.co.uk/image-zoom
[jquery-bridget]: https://github.com/desandro/jquery-bridget
[jquery-mousewheel]: https://github.com/jquery/jquery-mousewheel
[jquery-threedubmedia]: https://github.com/threedubmedia/jquery.threedubmedia
