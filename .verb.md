# {%= name %}

> {%= description %} {%= descriptionMore %}

{%= badge("fury") %}
[![Bower](https://img.shields.io/bower/v/{%= name %}.svg)](https://github.com/{%= github.repopath %})
{%= badge("travis") %}
[![dependencies](https://david-dm.org/{%= github.repopath %}.svg)](https://david-dm.org/{%= github.repopath %})
[![dependencies](https://david-dm.org/{%= github.repopath %}/dev-status.svg)](https://david-dm.org/{%= github.repopath %}#info=devDependencies)
[![Gratipay](https://img.shields.io/gratipay/adjohnson916.svg)](https://gratipay.com/adjohnson916/)

{%= badge("npm") %}

[![Join the chat at https://gitter.im/adjohnson916/magnificent.js](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/adjohnson916/magnificent.js?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

## Table of Contents

<!-- toc -->

## Demo

Check out the [demo][mag-demo]! Or the `data-*` attributes [demo][mag-demo-data].

## Features

### 2.0

* Scroll-to-zoom
* Drag interaction
* Inline option
* Control buttons
* Different proportions for thumb vs. zoom
* CSS 3D transforms
* Full screen (coming soon)
* Event support, e.g. for stats/HUDs

### 2.1

* Touch interaction (pan, pinch)
* [Analytics](#analytics)
* Stabilized scroll-to-zoom, better for touchpads

### 2.2

* Support `data-*` attributes for [#37](https://github.com/adjohnson916/magnificent.js/issues/37).

## Install

### Bower

{%= include("install-bower", {save: true}) %}

### npm

{%= include("install-npm", {save: true}) %}

### Manual

[Download manually](https://github.com/adjohnson916/magnificent.js/releases).


## Usage

1. [Load](#load)
2. [Integrate](#integrate)

### Load

If you're using AMD or Browersify, you'll probably just want to specify any main files you need, e.g. `src/js/mag-jquery.js`, as dependencies in your script(s).

You'll also want to include the CSS files below in your page.

Otherwise, you'll have to include individually in your page any main files you need, preceded by their dependencies.

* First, any dependencies of any main files you need:

{%= bowerDeps({indent: 1, shim: bowerShim}) %}

{%= bowerDepsHTML({shim: bowerShim}) %}

* Then, any main files you need:

{%= bowerMain({indent: 1}) %}

{%= bowerMainHTML() %}


### Integrate

See usage examples in [demo][mag-demo].
Also the [JSDoc][mag-jsdoc], especially [options][mag-jsdoc-opts].


## Analytics

This component includes tracking via Google Analytics.
The purpose is to better understand how and where it's used, as a guide for development.

To opt-out of this tracking, before loading the script on your page,
use the global options in JavaScript, with `noTrack` set to `true`, as follows:

```js
window.MAGNIFICENT_OPTIONS = {
  noTrack: true
};
```


## Contributing

{%= include("contributing") %}

{%= include("contributing-extra") %}

### Build Docs

{%= include("build-docs") %}

### Tests

{%= include("tests") %}

## v1.x

See https://github.com/adjohnson916/magnificent.js/tree/v1.x.

## Alternatives

* [Magnifier.js]
* [ElevateZoom]

## License
{%= copyright({start: 2013, linkify: true}) %}.
{%= license({linkify: true}) %}


***

{%= include("footer") %}

[mag-demo]: http://adjohnson916.github.io/magnificent.js/examples/demo/
[mag-demo-data]: http://adjohnson916.github.io/magnificent.js/examples/demo/index-data.html
[mag-jsdoc]: http://adjohnson916.github.io/magnificent.js/docs/jsdoc/
[mag-jsdoc-opts]: http://adjohnson916.github.io/magnificent.js/docs/jsdoc/global.html#MagnificentOptions
[bower]: http://bower.io/
[Magnifier.js]: http://mark-rolich.github.io/Magnifier.js/
[ElevateZoom]: http://www.elevateweb.co.uk/image-zoom
