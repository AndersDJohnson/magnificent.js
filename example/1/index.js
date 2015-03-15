
var $host;

$host = $('#host');
$host.mag();

$host = $('#host2');
$host.mag({
  content: '<img src="img/alley/1000x666.jpg" style="width: 100%; height: 100%;"/>',
  position: 'mirror',
  positionEvent: 'hold'
});

$host = $('#host3');
$host.mag({
  content: '<img src="img/alley/1000x666.jpg" style="width: 100%; height: 100%;"/>',
  position: 'joystick',
  positionEvent: 'move'
});

$host = $('#host4');
$host.mag({
  content: '<img src="img/alley/1000x666.jpg" style="width: 100%; height: 100%;"/>',
  position: 'joystick',
  positionEvent: 'hold'
});
