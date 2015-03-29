module("Requirements");

test("jQuery",function(){
	
	expect( 2 );
	
	// make sure the right jquery is included
	ok( window.jQuery, "jQuery exists" );
	ok( parseFloat( jQuery([]).jquery ) >= 1.4, "jQuery version is 1.4 or greater" );

});

test("Installation",function(){
	
	expect( 4 );
				
	// make sure the event interface is complete
	ok( jQuery.event.special.lingerstart, "LINGERSTART special event is defined" );
	ok( jQuery.event.special.linger, "LINGER special event is defined" );
	ok( jQuery.event.special.lingerend, "LINGEREND special event is defined" );
	ok( jQuery([]).linger, "$('...').linger() method is defined" );
	
});