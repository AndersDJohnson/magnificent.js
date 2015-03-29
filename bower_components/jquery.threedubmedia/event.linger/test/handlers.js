;(function(){

	module("Event Handlers");					
	
	// a simple re-usable test harness object
	var obj = {
		init: function( opts ){
			obj.$div = 	$('<div />')
				.css({
					position: 'absolute',
					top: 0,
					left: 0,
					height: 100,
					width: 100
				})
				.append('<div class="child" />')
				.appendTo( document.body )
				.bind("lingerstart linger lingerend", opts || {}, function( event ){
					obj[ event.type ] += 1;
					return obj.returned[ event.type ];
				});
			$.extend( obj, { lingerstart:0, linger:0, lingerend:0 });
			obj.returned = {};
		},
		done: function(){
			obj.$div.remove();
			start();
		}
	};
	
	asyncTest('"lingerstart" return false',function(){
		
		expect( 3 );
		
		// prep interaction
		obj.init();
		// set the return value
		obj.returned['lingerstart'] = false;
		// simulate interaction
		obj.$div
			.fire("mouseover",{ pageX:50, pageY:50 })
			.fire("mousemove",{ pageX:56, pageY:58 }); // move <= 10 pixels (default speed)
		// wait 100 ms (default delay)
		setTimeout(function(){	
			obj.$div.fire("mouseout",{ pageX:51, pageY:51 });
			// wait 100 ms (persist)
			setTimeout(function(){
				// inspect results	
				equals( obj.lingerstart, 1, "lingerstart");
				equals( obj.linger, 0, "linger");
				equals( obj.lingerend, 0, "lingerend");	
				obj.done();
			}, 100 );
		}, 100 );
			
	});
	
	asyncTest('"linger" return false',function(){
		
		expect( 3 );
		
		// prep interaction
		obj.init({ persist:100 });
		// set the return value
		obj.returned['linger'] = false;
		// simulate interaction
		obj.$div
			.fire("mouseover",{ pageX:50, pageY:50 })
			.fire("mousemove",{ pageX:56, pageY:58 }); // move <= 10 pixels (default speed)
		// wait 300 ms (3x default delay)
		setTimeout(function(){	
			obj.$div.fire("mouseout",{ pageX:51, pageY:51 });
			// wait 100 ms (persist)
			setTimeout(function(){
				// inspect results	
				equals( obj.lingerstart, 1, "lingerstart");
				equals( obj.linger, 3, "linger");
				equals( obj.lingerend, 0, "lingerend");	
				obj.done();
			}, 100 );
		}, 350 );
		
	});
	
	asyncTest('"lingerend" return false',function(){
		
		expect( 3 );
		
		// prep interaction
		obj.init({ persist:100 });
		// set the return value
		obj.returned['lingerend'] = false;
		// simulate interaction
		obj.$div
			.fire("mouseover",{ pageX:50, pageY:50 })
			.fire("mousemove",{ pageX:56, pageY:58 }); // move <= 10 pixels (default speed)
		// wait 100 ms (default delay)
		setTimeout(function(){	
			obj.$div.fire("mouseout",{ pageX:51, pageY:51 });
			// wait 300 ms (3x persist)
			setTimeout(function(){
				// inspect results	
				equals( obj.lingerstart, 1, "lingerstart");
				equals( obj.linger, 1, "linger");
				equals( obj.lingerend, 3, "lingerend");	
				obj.done();
			}, 350 );
		}, 300 );
	});
	
})();