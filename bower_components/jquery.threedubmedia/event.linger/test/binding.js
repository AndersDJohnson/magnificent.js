module("Bind Method");

$.each(['lingerstart','linger','lingerend'],function( i, type ){
	
	test('"'+ type +'"', function(){	
		
		expect( 14 );	
		
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
		
		ok( $elem.bind( type, fn )[0] == elem, ".bind('"+ type +"', fn )" );
		ok( $.data( elem, $.event.special.linger.datakey ), "linger data exists" );
		ok( $.data( elem, "events" ), "event data exists" );
		ok( $.data( elem, "events" )[ type ][0], type +" event handler added" );
		
		ok( $elem.trigger( type )[0] == elem, ".trigger('"+ type +"')" );
		ok( count == 1, "handler was triggered");
		
		ok( $elem.unbind( type )[0] == elem, ".unbind('"+ type +"')" );
		ok( !$.data( elem, "events" ), "event data removed" );
		ok( !$.data( elem, $.event.special.linger.datakey ), "linger data removed" );
		
		ok( $elem.bind( type, opts, fn )[0] == elem, ".bind('"+ type +"', data, fn )" );
		ok( data = $.data( elem, $.event.special.linger.datakey ), "linger data exists" );
		
		ok( data.speed == opts.speed, "'speed' option stored" );
		ok( data.delay == opts.delay, "'delay' option stored" );
		ok( data.persist == opts.persist, "'persist' option stored" );
		
		$elem.remove();
		
	});
});