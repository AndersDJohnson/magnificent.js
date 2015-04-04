

(function () {
	var $host;

	$host = $('[mag-thumb="inner"]');
	$host.mag({
	  toggle: true
	});

})();


(function () {
	var $host;

	$host = $('[mag-thumb="outer"]');
	$host.mag({
	  mode: 'outer'
	});
})();


(function () {
	var $host;

	$host = $('[mag-thumb="outer-drag"]');
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

	$host = $('[mag-thumb="drag"]');
	$host.mag({
	  position: 'drag',
	  toggle: false
	});

	$hud = $('<div class="mag-eg-hud"></div>');
	// $host.closest('.col').append($hud);
	$host.parent().append($hud);

	var toPerc = function (p) {
		return (p * 100).toFixed(1) + '%';
	};

	$host.on('compute', function (e) {
		var mag = $(this).data('mag');
		var m = mag.model;
		$hud.html(
			'<div>' + m.zoom.toFixed(1) + 'x</div>' +
			'<div>(' + toPerc(m.focus.x) + ', ' + toPerc(m.focus.y) + ')</div>'
		);
	});
})();



(function () {
	var $host;
	var $controls;

	$host = $('[mag-thumb="controls"]');
	$host.mag({
		toggle: false,
		position: false
	});

	$controls = $('[mag-ctrl="controls"]');

	$controls.magCtrl({
		mag: $host
	});

	$host.closest('.col').append($controls);

})();

