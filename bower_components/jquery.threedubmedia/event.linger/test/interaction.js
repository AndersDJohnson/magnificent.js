;(function(){	
	
	module("Interaction");
	
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
					obj.counts[ event.type ] += 1;
				});
			obj.counts = { lingerstart:0, linger:0, lingerend:0 };
		},
		done: function(){
			obj.$div.remove();
			start();
		}
	};
	
	asyncTest("defaults",function(){

		expect( 3 );
		
		// prep interaction
		obj.init();
		// simulate interaction
		obj.$div
			.fire("mouseover",{ pageX:50, pageY:50 })
			.fire("mousemove",{ pageX:56, pageY:58 }); // move <= 10 pixels (default speed)
		// wait 100 ms (default delay)
		setTimeout(function(){	
			obj.$div.fire("mouseout",{ pageX:51, pageY:51 });
			// wait 400 ms (default persist)
			setTimeout(function(){
				// inspect results	
				equals( obj.counts.lingerstart, 1, "lingerstart");
				equals( obj.counts.linger, 1, "linger");
				equals( obj.counts.lingerend, 1, "lingerend");	
				obj.done();
			}, 400 );
		}, 100 );	
	});
	
	asyncTest("speed (miss)",function(){
		
		expect( 3 );
		
		// prep interaction
		obj.init({ speed:200 });
		// simulate interaction
		obj.$div
			.fire("mouseover",{ pageX:50, pageY:50 })
			.fire("mousemove",{ pageX:63, pageY:67 }); // move > 20 pixels (custom speed)
		// wait 100 ms (default delay)
		setTimeout(function(){	
			obj.$div.fire("mouseout",{ pageX:51, pageY:51 });
			// wait 400 ms (default persist)
			setTimeout(function(){
				// inspect results	
				equals( obj.counts.lingerstart, 1, "lingerstart");
				equals( obj.counts.linger, 0, "linger");
				equals( obj.counts.lingerend, 0, "lingerend");
				obj.done();
			}, 400 );
		}, 100 );
	});
	
	asyncTest("speed (hit)",function(){
		
		expect( 3 );
		
		// prep interaction
		obj.init({ speed:200 });
		// simulate interaction
		obj.$div
			.fire("mouseover",{ pageX:50, pageY:50 })
			.fire("mousemove",{ pageX:62, pageY:66 }); // move <= 20 pixels (custom speed)
		// wait 100 ms (default delay)
		setTimeout(function(){	
			obj.$div.fire("mouseout",{ pageX:51, pageY:51 });
			// wait 400 ms (default persist)
			setTimeout(function(){
				// inspect results	
				equals( obj.counts.lingerstart, 1, "lingerstart");
				equals( obj.counts.linger, 1, "linger");
				equals( obj.counts.lingerend, 1, "lingerend");
				obj.done();
			}, 400 );
		}, 100 );
	});
	
	asyncTest("delay (miss)",function(){
		
		expect( 3 );
		
		// prep interaction
		obj.init({ delay:200 });
		// simulate interaction
		obj.$div
			.fire("mouseover",{ pageX:50, pageY:50 })
			.fire("mousemove",{ pageX:56, pageY:58 }); // move <= 10 pixels (default speed)
		// wait < 200 ms (custom delay)
		setTimeout(function(){	
			obj.$div.fire("mouseout",{ pageX:51, pageY:51 });
			// wait 400 ms (default persist)
			setTimeout(function(){
				// inspect results	
				equals( obj.counts.lingerstart, 1, "lingerstart");
				equals( obj.counts.linger, 0, "linger");
				equals( obj.counts.lingerend, 0, "lingerend");
				obj.done();
			}, 400 );
		}, 100 );
	});
	
	asyncTest("delay (hit)",function(){
		
		expect( 3 );
		
		// prep interaction
		obj.init({ delay:200 });
		// simulate interaction
		obj.$div
			.fire("mouseover",{ pageX:50, pageY:50 })
			.fire("mousemove",{ pageX:56, pageY:58 }); // move <= 10 pixels (default speed)
		// wait 200 ms (custom delay)
		setTimeout(function(){	
			obj.$div.fire("mouseout",{ pageX:51, pageY:51 });
			// wait 400 ms (default persist)
			setTimeout(function(){
				// inspect results	
				equals( obj.counts.lingerstart, 1, "lingerstart");
				equals( obj.counts.linger, 1, "linger");
				equals( obj.counts.lingerend, 1, "lingerend");
				obj.done();
			}, 400 );
		}, 200 );
	});
	
	asyncTest("persist (miss)",function(){
		
		expect( 3 );
		
		// prep interaction
		obj.init({ persist:200 });
		// simulate interaction
		obj.$div
			.fire("mouseover",{ pageX:50, pageY:50 })
			.fire("mousemove",{ pageX:56, pageY:58 }); // move <= 10 pixels (default speed)
		// wait 100 ms (default delay)
		setTimeout(function(){	
			obj.$div.fire("mouseout",{ pageX:51, pageY:51 });
			// wait < 200 ms (custom persist)
			setTimeout(function(){
				// inspect results	
				equals( obj.counts.lingerstart, 1, "lingerstart");
				equals( obj.counts.linger, 1, "linger");
				equals( obj.counts.lingerend, 0, "lingerend");
				setTimeout(function(){
					obj.done();
				}, 100 );
			}, 100 );
		}, 100 );
	});
	
	asyncTest("persist (hit)",function(){
		
		expect( 3 );
		
		// prep interaction
		obj.init({ persist:200 });
		// simulate interaction
		obj.$div
			.fire("mouseover",{ pageX:50, pageY:50 })
			.fire("mousemove",{ pageX:56, pageY:58 }); // move <= 10 pixels (default speed)
		// wait 100 ms (default delay)
		setTimeout(function(){	
			obj.$div.fire("mouseout",{ pageX:51, pageY:51 });
			// wait 200 ms (custom persist)
			setTimeout(function(){
				// inspect results	
				equals( obj.counts.lingerstart, 1, "lingerstart");
				equals( obj.counts.linger, 1, "linger");
				equals( obj.counts.lingerend, 1, "lingerend");
				obj.done();
			}, 200 );
		}, 100 );
		
	});
	
	asyncTest("persist (re-enter)",function(){
		
		expect( 3 );
		
		// prep interaction
		obj.init({ persist:200 });
		// simulate interaction
		obj.$div
			.fire("mouseover",{ pageX:50, pageY:50 })
			.fire("mousemove",{ pageX:56, pageY:58 }); // move <= 10 pixels (default speed)
		// wait 100 ms (default delay)
		setTimeout(function(){	
			obj.$div.fire("mouseout",{ pageX:51, pageY:51 })
			// wait < 200 ms (custom persist)
			setTimeout(function(){
				// re-enter the element
				obj.$div.fire("mouseover",{ pageX:50, pageY:50 });
				// wait 200 ms (custom persist)
				setTimeout(function(){
					// inspect results	
					equals( obj.counts.lingerstart, 1, "lingerstart");
					equals( obj.counts.linger, 1, "linger");
					equals( obj.counts.lingerend, 0, "lingerend");
					obj.done();
				}, 200 );
			}, 100 );
		}, 100 );
		
	});
	
})();

