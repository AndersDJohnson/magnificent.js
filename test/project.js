var Mag = require('..');
var assert = require('assert');

var mag = new Mag();

describe('project', function () {

  var frame;

  beforeEach(function () {
    frame = {w:400, h:200};
  });

  it('should', function () {
    var model = {
      focus: {x:0, y:0}
    };
    mag.compute(model);
    var proj = mag.project(model, frame);
    assert.equal(proj.x, 0);
    assert.equal(proj.y, 0);
    assert.equal(proj.w, 0);
    assert.equal(proj.h, 0);
  });

  it('should', function () {
    var model = {
      focus: {x:0.5, y:0.5}
    };
    mag.compute(model);
    var proj = mag.project(model, frame);
    assert.equal(proj.x, 0);
    assert.equal(proj.y, 0);
    assert.equal(proj.w, 200);
    assert.equal(proj.h, 100);
  });

  it('should', function () {
    var model = {
      focus: {x:1, y:1}
    };
    mag.compute(model);
    var proj = mag.project(model, frame);
    assert.equal(proj.x, 0);
    assert.equal(proj.y, 0);
    assert.equal(proj.w, 400);
    assert.equal(proj.h, 200);
  });
  it('should', function () {
    var model = {
      focus: {x:0.5, y:0.5},
      focus: {x:0.5, y:0.5}
    };
    mag.compute(model);
    var proj = mag.project(model, frame);
    assert.equal(proj.x, 100);
    assert.equal(proj.y, 50);
    assert.equal(proj.w, 200);
    assert.equal(proj.h, 100);
  });

  it('should', function () {
    var model = {
      focus: {x:0.25, y:0.25},
      focus: {x:0.5, y:0.5}
    };
    mag.compute(model);
    var proj = mag.project(model, frame);
    assert.equal(proj.x, 150);
    assert.equal(proj.y, 75);
    assert.equal(proj.w, 100);
    assert.equal(proj.h, 50);
  });

  it('should', function () {
    var model = {
      focus: {x:0.5, y:0.5},
      focus: {x:0, y:0}
    };
    mag.compute(model);
    var proj = mag.project(model, frame);
    assert.equal(proj.x, 0);
    assert.equal(proj.y, 0);
    assert.equal(proj.w, 200);
    assert.equal(proj.h, 100);
  });

  it('should', function () {
    var model = {
      focus: {x:0.5, y:0.5},
      focus: {x:1, y:1}
    };
    mag.compute(model);
    var proj = mag.project(model, frame);
    assert.equal(proj.x, 200);
    assert.equal(proj.y, 100);
    assert.equal(proj.w, 200);
    assert.equal(proj.h, 100);
  });

  it('should', function () {
    var model = {
      focus: {x:0.25, y:0.25},
      focus: {x:1, y:1}
    };
    mag.compute(model);
    var proj = mag.project(model, frame);
    assert.equal(proj.x, 300);
    assert.equal(proj.y, 150);
    assert.equal(proj.w, 100);
    assert.equal(proj.h, 50);
  });

});
