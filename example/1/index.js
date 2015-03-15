
var $host;

$host = $('#host');
$host.mag();

$host = $('#host-thumb');
$host.mag({
  content: '<img src="img/alley/1000x600.jpg" />',
  contentThumb: '<img src="img/alley/500x300.jpg" />'
});

$host = $('#host2');
$host.mag({
  content: '<img src="img/alley/1000x600.jpg" />',
  position: 'mirror',
  positionEvent: 'hold'
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
