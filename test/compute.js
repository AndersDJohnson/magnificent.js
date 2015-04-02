var Mag = require('..');
var assert = require('assert');

describe('compute', function () {

  it('should 1', function () {
    var model = {
      focus: {x:0, y:0},
      zoom: 1
    };
    var mag = new Mag({
      model: model
    });
    mag.compute(model);
    assert.equal(model.lens.x, 0);
    assert.equal(model.lens.y, 0);
    assert.equal(model.zoomed.x, 0);
    assert.equal(model.zoomed.y, 0);
  });

  it('should 2', function () {
    var model = {
      focus: {x:0, y:0},
      zoom: 2
    };
    var mag = new Mag({
      model: model
    });
    mag.compute(model);
    assert.equal(model.lens.x, 0);
    assert.equal(model.lens.y, 0);
    assert.equal(model.zoomed.w, 2);
    assert.equal(model.zoomed.h, 2);
    assert.equal(model.zoomed.x, 0);
    assert.equal(model.zoomed.y, 0);
  });

  it('should 3', function () {
    var model = {
      zoom: 1
    };
    var mag = new Mag({
      model: model
    });
    mag.compute(model);
    assert.equal(model.lens.x, 0);
    assert.equal(model.lens.y, 0);
  });
  it('should 4', function () {
    var model = {
      focus: {x:0.5, y:0.5},
      zoom: 2
    };
    var mag = new Mag({
      model: model
    });
    mag.compute(model);
    assert.equal(model.lens.x, 0.25);
    assert.equal(model.lens.y, 0.25);
    assert.equal(model.zoomed.w, 2);
    assert.equal(model.zoomed.h, 2);
    assert.equal(model.zoomed.x, -0.25 * 2);
    assert.equal(model.zoomed.y, -0.25 * 2);
  });

  it('should 5', function () {
    var model = {
      focus: {x:0, y:0},
      zoom: 2
    };
    var mag = new Mag({
      model: model
    });
    mag.compute(model);
    assert.equal(model.lens.x, 0);
    assert.equal(model.lens.y, 0);
  });

  it('should 6', function () {
    var model = {
      focus: {x:1, y:1},
      zoom: 2
    };
    var mag = new Mag({
      model: model
    });
    mag.compute(model);
    assert.equal(model.lens.x, 0.5);
    assert.equal(model.lens.y, 0.5);
  });

  it('should 7', function () {
    var model = {
      focus: {x:1, y:1},
      zoom: 4
    };
    var mag = new Mag({
      model: model
    });
    mag.compute(model);
    assert.equal(model.lens.x, 0.75);
    assert.equal(model.lens.y, 0.75);
  });

});
