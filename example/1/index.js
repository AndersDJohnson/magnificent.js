
var $host;

$host = $('#host');
$host.mag();

$host = $('#host-thumb');
$host.mag({
  content: '<img src="img/alley/1000x600.jpg" />',
  contentThumb: '<img src="img/alley/500x300.jpg" />'
});

$host = $('#host-thumb-html');
$host.mag({
  zoomMin: 0.5,
  zoomMax: 4
});

$host = $('#host-thumb-html-both');
$host.mag();

$host = $('#host2');
$host.mag({
  content: '<img src="img/alley/1000x600.jpg" />',
  position: 'mirror',
  positionEvent: 'hold',
  toggle: false
});

$host = $('#host3');
$host.mag({
  content: '<img src="img/alley/1000x600.jpg" />',
  position: 'joystick',
  positionEvent: 'move'
});

$host = $('#host4');
$host.mag({
  content: '<img src="img/alley/1000x600.jpg" />',
  position: 'joystick',
  positionEvent: 'hold'
});

$host = $('#host5');
$host.mag({
  content: '<img src="img/alley/1000x600.jpg" />',
  contentThumb: '<img src="img/alley/500x300.jpg" />',
  mode: 'outer',
  zoomedContainer: $('#host5-zoomed')
});
