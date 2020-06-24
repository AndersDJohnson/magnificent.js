module("Requirements");

test("jQuery",function(){
	
	expect( 2 );
	
	// make sure the right jquery is included
	ok( window.jQuery, "jQuery exists" );
	ok( parseFloat( jQuery([]).jquery ) >= 1.4, "jQuery version is 1.4 or greater" );

});

test("Installation",function(){
	
	expect( 5 );
	
	// make sure the event interface is complete
	ok( jQuery.event.special.draginit, '"draginit" special event is defined' );
	ok( jQuery.event.special.dragstart, '"dragstart" special event is defined' );
	ok( jQuery.event.special.drag, '"drag" special event is defined' );
	ok( jQuery.event.special.dragend, '"dragend" special event is defined' );
	ok( jQuery([]).drag, "$.fn.drag method is defined" );
	
});