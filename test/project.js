var mag = require('..');
var assert = require('assert');

describe('project', function () {

  var frame;

  beforeEach(function () {
    frame = {w:400, h:200};
  });

  it('should', function () {
    var model = {
      lens: {w:0, h:0}
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
      lens: {w:0.5, h:0.5}
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
      lens: {w:1, h:1}
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
      lens: {w:0.5, h:0.5},
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
      lens: {w:0.25, h:0.25},
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
      lens: {w:0.5, h:0.5},
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
      lens: {w:0.5, h:0.5},
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
      lens: {w:0.25, h:0.25},
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
