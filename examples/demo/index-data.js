(function () {
	var $host;

	$host = $('[data-mag-thumb="inner"]');
	$host.mag({
	  toggle: true
	});

	$controls = $('[data-mag-ctrl="inner"]');
	$controls.magCtrl({
		mag: $host
	});

})();


(function () {
	var $host;

	$host = $('[data-mag-thumb="inner-inline"]');
	$host.mag();

})();


(function () {
	var $host;

	$host = $('[data-mag-thumb="outer"]');
	$host.mag({
	  mode: 'outer',
	  ratio: 1 / 1.6
	});
})();


(function () {
	var $host;

	$host = $('[data-mag-thumb="outer-drag"]');
	$host.mag({
	  mode: 'outer',
	  position: 'drag',
	  toggle: false
	});
})();


(function () {
	var $host;
	var $controls;
	var $hud;

	$host = $('[data-mag-thumb="drag"]');
	$host.mag({
	  position: 'drag',
	  toggle: false
	});

	$hudLeft = $('<div class="mag-eg-hud mag-eg-hud-left"></div>');
	$hudLeft.appendTo($host.parent());

	$hudRight = $('<div class="mag-eg-hud mag-eg-hud-right"></div>');
	$hudRight.appendTo($host.parent());

	var toPerc = function (p) {
		return (p * 100).toFixed(1) + '%';
	};

	$host.on('compute', function (e) {
		var mag = $(this).data('mag');
		var m = mag.model;
		$hudLeft.html(
			'<div>' + m.zoom.toFixed(1) + 'x</div>'
		);
		$hudRight.html(
			'<div>(' + toPerc(m.focus.x) + ', ' + toPerc(m.focus.y) + ')</div>'
		);
	});
})();



(function () {
	var $host;
	var $controls;

	$host = $('[data-mag-thumb="controls"]');
	$host.mag({
		toggle: false,
		position: false
	});

	$controls = $('[data-mag-ctrl="controls"]');
	$controls.magCtrl({
		mag: $host
	});

})();
