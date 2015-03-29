module("Drop Method");

$.each(['init','start','','end'],function( i, type ){

	test('"drop'+ type +'"',function(){
		
		expect( 9 );
		
		// make sure the event handler gets bound to the element
		var $elem = $('<div />'), 
		elem = $elem[0],
		count = 0,
		fn = function(){
			count += 1;
		};
		
		ok( $elem.drop( type, fn )[0] == elem, ".drop("+( type ? '"'+ type +'",' : "" )+" fn )" );
		ok( $.data( elem, $.event.special.drop.datakey ), "drop data exists" );
		ok( $.data( elem, "events" ), "event data exists" );
		ok( $.data( elem, "events" )[ 'drop'+type ][0], '"drop'+ type +'" event handler added' );
		
		ok( $elem.drop( type )[0] == elem, ".drop("+( type ? '"'+ type +'"' : "" )+")" );
		ok( count == 1, "handler was triggered");
		
		ok( $elem.unbind( "drop"+ type )[0] == elem, '.unbind("drop'+ type +'")' );
		ok( !$.data( elem, "events" ), "event data removed" );
		ok( !$.data( elem, $.event.special.drag.datakey ), "drag data removed" );
				
		$elem.remove();
		
	});

});

test('$.drop()',function(){

	expect( 4 );

	// call the static method with settings
	var drop = $.event.special.drop,
	def = {
		multi: drop.multi,
		delay: drop.delay,
		mode: drop.mode,
		tolerance: null
	},
	opts = {
		multi: 99,
		delay: 88,
		mode: 77,
		tolerance: function(){}
	};
	$.drop( opts );
	
	ok( drop.multi == opts.multi, "multi option was set" );
	ok( drop.delay == opts.delay, "delay option was set" );
	ok( drop.mode == opts.mode, "mode option was set" );
	ok( drop.tolerance == opts.tolerance, "tolerance option was set" );
	
	// restore defaults
	$.drop( def );
	
});