

(function () {
	var $host;
	var $controls;

	$host = $('[mag-thumb="inner"]');
	$host.mag({
	  //zoomedContainer: $('[mag-zoom="inner"]')
	  toggle: true
	});

	$controls = $(
		'<div>' +
			'<button class="mag-eg-ctrl-zoom-out">-</button>' +
			'<button class="mag-eg-ctrl-zoom-in">+</button>' +
		'</div>'
	);
	$controls.find('.mag-eg-ctrl-zoom-out').on('click', function () {
		$host.mag('zoom', -0.5);
	});
	$controls.find('.mag-eg-ctrl-zoom-in').on('click', function () {
		$host.mag('zoom', 0.5);
	});
	$host.closest('.col').append($controls);

	window.m = $host.data('mag').model;
})();


(function () {
	var $host;

	$host = $('[mag-thumb="outer"]');
	$host.mag({
	  mode: 'outer'//,
	  //zoomedContainer: $('[mag-zoom="outer"]')//,
	  //toggle: false
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
	$hud = $('<div></div>')
	$host.closest('.col').append($hud);

	$host.on('compute', function (e) {
		var mag = $(this).data('mag');
		var m = mag.model;
		$hud.html('zoom: ' + m.zoom + ', focus: x: ' + m.focus.x + ' y: ' + m.focus.y);
	});
})();
