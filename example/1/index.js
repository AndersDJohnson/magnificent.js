
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
