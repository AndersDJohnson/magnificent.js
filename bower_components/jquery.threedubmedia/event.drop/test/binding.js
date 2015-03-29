module("Event Binding");

$.each(['dropinit','dropstart','drop','dropend'],function( i, type ){
	
	test('"'+ type +'"',function(){
	
		expect( 9 );
		
		// make sure the event handler gets bound to the element
		var $elem = $('<div />'), 
		elem = $elem[0],
		count = 0,
		fn = function(){
			count += 1;
		};
		
		ok( $elem.bind( type, fn )[0] == elem, '.bind("'+ type +'", fn )' );
		ok( $.data( elem, $.event.special.drop.datakey ), "drop data exists" );
		ok( $.data( elem, "events" ), "event data exists" );
		ok( $.data( elem, "events" )[ type ][0], '"'+ type +'" event handler added' );
		
		ok( $elem.trigger( type )[0] == elem, '.trigger("'+ type +'")' );
		ok( count == 1, "handler was triggered");
		
		ok( $elem.unbind( type )[0] == elem, '.unbind("'+ type +'")' );
		ok( !$.data( elem, "events" ), "event data removed" );
		ok( !$.data( elem, $.event.special.drop.datakey ), "drop data removed" );
		
		$elem.remove();
		
	});
});