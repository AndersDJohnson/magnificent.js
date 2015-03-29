module("Mouse Events");

// test each of the following events
$.each([
	"click","dblclick",
	"mouseover","mouseout",
	"mousedown","mouseup","mousemove"
],function( i, type ){
	// test each event type
	test( '"'+ type +'"', function(){
		expect( 33 );
		
		// custom event properties
		var props = {
			pageX: Math.round( Math.random() * 500 ),
			pageY: Math.round( Math.random() * 500 ),
			ctrlKey: Math.round( Math.random() ) ? true : false, 
			altKey: Math.round( Math.random() ) ? true : false, 
			shiftKey: Math.round( Math.random() ) ? true : false, 
			button: Math.round( Math.random() * 2 )
		},
		// new test element
		$div = $('<div/>').appendTo( document.body );
		// test the document too for bubbling
		$div.add( document ).bind( type, function( ev ){
			
			equals( ev.currentTarget, this, "event.currentTarget");
			equals( ev.target, $div[0], "event.target" );
			equals( ev.type, type, "event.type" );
			equals( ev.pageX, props.pageX, "event.pageX" );
			equals( ev.pageY, props.pageY, "event.pageY" );
			equals( ev.ctrlKey, props.ctrlKey, "event.ctrlKey" );
			equals( ev.altKey, props.altKey, "event.altKey" );
			equals( ev.shiftKey, props.shiftKey, "event.shiftKey" );
			equals( ev.metaKey, props.metaKey, "event.metaKey" );
			equals( ev.button, props.button, "event.button" );
			equals( ev.bubbles, props.bubbles, "event.bubbles" );
		});
		
		// make sure that metaKey and ctrlKey are equal
		props.metaKey = props.ctrlKey;
		// fire the event with bubbling
		props.bubbles = true;
		$div.fire( type, props );
		
		// fire the event without bubbling
		props.bubbles = false;
		$div.fire( type, props );
	
		// cleanup
		$( document ).unbind( type );
		$div.remove();
	});
});