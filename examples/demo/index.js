
var $host;

$host = $('[mag-thumb="inner"]');
$host.mag({
  //zoomedContainer: $('[mag-zoom="inner"]')
});

$host = $('[mag-thumb="outer"]');
$host.mag({
  mode: 'outer'//,
  //zoomedContainer: $('[mag-zoom="outer"]')//,
  //toggle: false
});

$host = $('[mag-thumb="drag"]');
$host.mag({
  position: 'drag',
  toggle: false
});
var $hud = $('<div></div>')
$host.closest('.col').append($hud);

$host.on('compute', function (e, instance) {
	var m = instance.model
	$hud.html('zoom: ' + m.zoom + ', focus: x: ' + m.focus.x + ' y: ' + m.focus.y);
});
