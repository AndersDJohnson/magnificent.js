module("Event Binding");

$.each(['draginit','dragstart','drag','dragend'],function( i, type ){
		
	test('"'+ type +'"',function(){
		
		expect( 27 );

		// make sure the event handler gets bound to the element
		var $elem = $('<div />'), 
		elem = $elem[0],
		count = 0,
		fn = function(){
			count += 1;
		},
		opts = {
			which: 99, 
			distance: 88, 
			not: 77, 
			handle: 66, 
			relative: 55,
			drop: 44, 
			click: 33 
		},
		def = $.event.special[ type ].defaults,
		data;
		
		ok( $elem.bind( type, fn )[0] == elem, '.bind("'+ type +'", fn )' );
		ok( data = $.data( elem, $.event.special.drag.datakey ), "drag data exists" );
		ok( $.data( elem, "events" ), "event data exists" );
		ok( $.data( elem, "events" )[ type ][0], '"'+ type +'" event handler added' );
		
		ok( data.which == def.which, '"which" default stored' );
		ok( data.distance == def.distance, '"distance" default stored' );
		ok( data.not == def.not, '"not" default stored' );
		ok( data.handle == def.handle, '"handle" default stored' );
		ok( data.relative == def.relative, '"relative" default stored' );
		ok( data.drop == def.drop, '"drop" default stored' );
		ok( data.click == def.click, '"click" default stored' );
		
		ok( $elem.trigger( type )[0] == elem, '.trigger("'+ type +'")' );
		ok( count == 1, "handler was triggered");
		
		ok( $elem.unbind( type )[0] == elem, '.unbind("'+ type +'")' );
		ok( !$.data( elem, "events" ), "event data removed" );
		ok( !$.data( elem, $.event.special.drag.datakey ), "drag data removed" );
		
		ok( $elem.bind( type, opts, fn )[0] == elem, '.bind("'+ type +'", data, fn )' );
		ok( data = $.data( elem, $.event.special.drag.datakey ), "drag data exists" );
		ok( $.data( elem, "events" ), "event data exists" );
		ok( $.data( elem, "events" )[ type ][0], '"drag'+ type +'" event handler added' );
		
		ok( data.which == opts.which, '"which" option stored' );
		ok( data.distance == opts.distance, '"distance" option stored' );
		ok( data.not == opts.not, '"not" option stored' );
		ok( data.handle == opts.handle, '"handle" option stored' );
		ok( data.relative == opts.relative, '"relative" option stored' );
		ok( data.drop == opts.drop, '"drop" option stored' );
		ok( data.click == opts.click, '"click" option stored' );
		
		$elem.remove();
		
	});
});