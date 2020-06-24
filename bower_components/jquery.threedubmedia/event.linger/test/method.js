module("Linger Method");
	
$.each(['start','','end'],function( i, type ){

	test('"linger'+ type +'"',function(){
	
		expect( 11 );
		
		// make sure the event handler gets bound to the element
		var $elem = $('<div />'), 
		elem = $elem[0],
		count = 0,
		fn = function(){
			count += 1;
		},
		opts = {
			speed: 111,
			delay: 222,
			persist: 333
		},
		data;
		
		ok( $elem.linger( type, fn )[0] == elem, ".linger("+( type ? "'"+ type +"'," : "" )+" fn )" );
		ok( $.data( elem, $.event.special.linger.datakey ), "linger data exists" );
		ok( $.data( elem, "events" ), "event data exists" );
		ok( $.data( elem, "events" )[ 'linger'+type ][0], 'linger'+ type +" event handler added" );
		
		ok( $elem.linger( type )[0] == elem, ".linger("+( type ? "'"+ type +"'" : "" )+")" );
		ok( count == 1, "handler was triggered");
		
		$elem.unbind( type );
		
		ok( $elem.linger( type, fn, opts )[0] == elem, ".linger("+( type ? "'"+ type +"'," : "" )+" fn, opts )" );
		ok( data = $.data( elem, $.event.special.linger.datakey ), "linger data exists" );
		
		ok( data.speed == opts.speed, "'speed' option stored" );
		ok( data.delay == opts.delay, "'delay' option stored" );
		ok( data.persist == opts.persist, "'persist' option stored" );
		
		$elem.remove();
		
	});
});