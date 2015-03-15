
var $host;
var $main;

$main = $('main');

$host = $('<div id="host" class="host">');
$main.append($host);
$host.mag({
  content: '<img src="img/alley/1000x666.jpg" style="width: 100%; height: 100%;"/>',
  position: 'mirror',
  positionEvent: 'move'
});

$host = $('<div id="host2" class="host">');
$main.append($host);
$host.mag({
  content: '<img src="img/alley/1000x666.jpg" style="width: 100%; height: 100%;"/>',
  position: 'mirror',
  positionEvent: 'hold'
});

$host = $('<div id="host3" class="host">');
$main.append($host);
$host.mag({
  content: '<img src="img/alley/1000x666.jpg" style="width: 100%; height: 100%;"/>',
  position: 'joystick',
  positionEvent: 'move'
});

$host = $('<div id="host4" class="host">');
$main.append($host);
$host.mag({
  content: '<img src="img/alley/1000x666.jpg" style="width: 100%; height: 100%;"/>',
  position: 'joystick',
  positionEvent: 'hold'
});
