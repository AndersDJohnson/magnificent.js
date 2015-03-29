module("Requirements");

test("jQuery",function(){
	
	expect( 2 );
	
	// make sure the right jquery is included
	ok( window.jQuery, "jQuery exists" );
	ok( parseFloat( jQuery([]).jquery ) >= 1.4, "jQuery version is 1.4 or greater" );

});

test("Installation",function(){
	
	expect( 8 );
				
	// make sure the plugin interface is complete
	ok( jQuery.fn.fire, "FIRE method is defined" );
	ok( jQuery.fire, "CONSTRUCTOR is defined" );
	ok( jQuery.fire.defaults, "DEFAULTS are defined" );
	ok( jQuery.fire.prototype.create, "CREATE method is defined" );
	ok( jQuery.fire.prototype.event, "EVENT method is defined" );
	ok( jQuery.fire.prototype.mouse, "MOUSE method is defined" );
	ok( jQuery.fire.prototype.key, "KEY method is defined" );
	ok( jQuery.fire.prototype.dispatch, "DISPATCH method is defined" );
});