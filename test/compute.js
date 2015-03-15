var Mag = require('..');
var assert = require('assert');

var mag = new Mag();

describe('compute', function () {

  it('should', function () {
    var model = {
      focus: {x:0, y:0},
      zoom: 1
    };
    mag.compute(model);
    assert.equal(model.lens.x, 0);
    assert.equal(model.lens.y, 0);
    assert.equal(model.zoomed.x, 0);
    assert.equal(model.zoomed.y, 0);
  });

  it('should', function () {
    var model = {
      focus: {x:0, y:0},
      zoom: 2
    };
    mag.compute(model);
    assert.equal(model.lens.x, 0);
    assert.equal(model.lens.y, 0);
    assert.equal(model.zoomed.w, 2);
    assert.equal(model.zoomed.h, 2);
    assert.equal(model.zoomed.x, 0);
    assert.equal(model.zoomed.y, 0);
  });

  it('should', function () {
    var model = {
      zoom: 1
    };
    mag.compute(model);
    assert.equal(model.lens.x, 0);
    assert.equal(model.lens.y, 0);
  });
  it('should', function () {
    var model = {
      lens: {w:0.5, h:0.5},
      focus: {x:0.5, y:0.5}
    };
    mag.compute(model);
    assert.equal(model.lens.x, 0.25);
    assert.equal(model.lens.y, 0.25);
    assert.equal(model.zoomed.w, 2);
    assert.equal(model.zoomed.h, 2);
    assert.equal(model.zoomed.x, -0.25);
    assert.equal(model.zoomed.y, -0.25);
  });

  it('should', function () {
    var model = {
      lens: {w:0.25, h:0.25},
      focus: {x:0.5, y:0.5}
    };
    mag.compute(model);
    assert.equal(model.lens.x, 0.375);
    assert.equal(model.lens.y, 0.375);
  });

  it('should', function () {
    var model = {
      lens: {w:0.5, h:0.5},
      focus: {x:0, y:0}
    };
    mag.compute(model);
    assert.equal(model.lens.x, 0);
    assert.equal(model.lens.y, 0);
  });

  it('should', function () {
    var model = {
      lens: {w:0.5, h:0.5},
      focus: {x:1, y:1}
    };
    mag.compute(model);
    assert.equal(model.lens.x, 0.5);
    assert.equal(model.lens.y, 0.5);
  });

  it('should', function () {
    var model = {
      lens: {w:0.25, h:0.25},
      focus: {x:1, y:1}
    };
    mag.compute(model);
    assert.equal(model.lens.x, 0.75);
    assert.equal(model.lens.y, 0.75);
  });

});
