module("Live Delegation");

$.each(["draginit","dragstart","drag","dragend"],function( i, type ){
	
	test('"'+ type+'"',function(){
		
		expect( i ? 5 : 1 );
		
		if ( !i ){
			ok( true, 'Not supported for this event type.');
			return;
		}
		
		// set up the delegation
		$('.drag').live( type, function( event ){
			count += 1;
			equals( this, $drag[0], event.type+" target" );
		});
		// local refs
		var count = 0,
		// add a div to test the delegation
		$drag = $('<div class="drag" />').appendTo( document.body );
		
		// manual triggering
		ok( $drag.trigger( type ), '.trigger("'+ type +'")');
		equals( count, 1, "event was triggered");
	
		// simulate a complete drag
		$drag
			.fire("mousedown",{ pageX:50, pageY:50 })
			.fire("mousemove",{ pageX:51, pageY:51 })
			.fire("mouseup",{ pageX:51, pageY:51 })
			.fire("click",{ pageX:51, pageY:51 });
		
		equals( count, 2, "event was delegated");

		// remove delegation
		$('.drag').die( type );
		$drag.remove();
	});
});