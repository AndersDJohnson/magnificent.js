module("Live Delegation");

$.each(["dropinit","dropstart","drop","dropend"],function( i, type ){

	test('"'+ type+'"',function(){
		
		expect( i ? 5 : 1 );
		
		if ( !i ){
			ok( true, 'Not supported for this event type.');
			return;
		}
		
		// set up the delegation
		$('.drop').live( type, function( event ){
			count += 1;
			equals( this, $drop[0], event.type+" target" );
		});
		// local refs
		var count = 0,
		// add a div to test the delegation
		$drop = $('<div class="drop" />')
			.css({
				position: 'absolute',
				top: 0, left: 0,
				height: 100, width: 100
				})
			.appendTo( document.body ),
		// add a dragger
		$drag = $('<div class="drag" />')
			.css({
				position: 'absolute',
				top: 0, left: 0,
				height: 100, width: 100
				})
			.appendTo( document.body )
			.drag(function(){ });
		
		// check triggering of the event handlers
		ok( $drop.trigger( type ), '.trigger("'+ type +'")');
		equals( count, 1, "event was triggered");
				
		// simulate a complete drag
		$drag
			.fire("mousedown",{ pageX:50, pageY:50 })
			.fire("mousemove",{ pageX:51, pageY:51 })
			.fire("mouseup",{ pageX:51, pageY:51 })
			.fire("click",{ pageX:51, pageY:51 });
		
		// check the event handler counts
		equals( count, 2, "event was delegated");
				
		// remove delegation
		$('.drop').die( type );
		$drag.remove();
		$drop.remove();
		
	});

});