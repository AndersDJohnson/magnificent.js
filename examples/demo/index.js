

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
	  mode: 'outer'//,
	  //zoomedContainer: $('[mag-zoom="outer"]')//,
	  //toggle: false
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
	$hud = $('<div></div>')
	$host.closest('.col').append($hud);

	$host.on('compute', function (e) {
		var mag = $(this).data('mag');
		var m = mag.model;
		$hud.html('zoom: ' + m.zoom + ', focus: x: ' + m.focus.x + ' y: ' + m.focus.y);
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

	$controls = $(
		'<div>' +
			'<button class="mag-eg-ctrl-zoom-out">-</button>' +
			'<button class="mag-eg-ctrl-zoom-in">+</button>' +
			'<button class="mag-eg-ctrl-move-up">^</button>' +
			'<button class="mag-eg-ctrl-move-down">v</button>' +
			'<button class="mag-eg-ctrl-move-left">&lt;</button>' +
			'<button class="mag-eg-ctrl-move-right">&gt;</button>' +
		'</div>'
	);
	$controls.find('.mag-eg-ctrl-zoom-out').on('click', function () {
		$host.mag('zoomBy', -0.5);
	});
	$controls.find('.mag-eg-ctrl-zoom-in').on('click', function () {
		$host.mag('zoomBy', 0.5);
	});
	$controls.find('.mag-eg-ctrl-move-up').on('click', function () {
		$host.mag('moveBy', {y: -0.2});
	});
	$controls.find('.mag-eg-ctrl-move-down').on('click', function () {
		$host.mag('moveBy', {y: 0.2});
	});
	$controls.find('.mag-eg-ctrl-move-left').on('click', function () {
		$host.mag('moveBy', {x: -0.2});
	});
	$controls.find('.mag-eg-ctrl-move-right').on('click', function () {
		$host.mag('moveBy', {x: 0.2});
	});
	$host.closest('.col').append($controls);

})();

