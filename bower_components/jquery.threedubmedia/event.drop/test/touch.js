;(function(){
	
	module("Touch Interaction");

	if ( !document.createEvent ){
		test("Touch Simulation Not Supported",function(){
			ok( true, 'This browser does not support "document.createEvent" and cannot simulate touch events.');	
		});
		return;
	}

	// a simple re-usable test harness object
	var obj = {
		init: function( opts ){
			obj.$drag =	$('<div />')
				.css({
					position: 'absolute',
					top: 0,
					left: 0,
					height: 100,
					width: 100
				})
				.appendTo( document.body )
				.bind("draginit dragstart drag dragend click", opts || {}, function( event ){
					obj[ event.type ] += 1;
				});
			obj.$drop = $('<div />')
				.css({
					position: 'absolute',
					top: 0,
					left: 0,
					height: 100,
					width: 100
				})
				.appendTo( document.body )
				.bind("dropinit dropstart drop dropend",function( event ){
					obj[ event.type ] += 1;																 
				});
			$.extend( obj, { 
				draginit:0, dragstart:0, drag:0, dragend:0, 
				dropinit:0, dropstart:0, drop:0, dropend:0,	
				click:0 
			});
		},
		touch: function(){
			var start = {
				pageX: Math.round( Math.random() * 90 ) + 5,
				pageY: Math.round( Math.random() * 90 ) + 5
			},
			end = {
				pageX: Math.round( Math.random() * 90 ) + start.pageX,
				pageY: Math.round( Math.random() * 90 ) + start.pageY
			};
			// simulate a complete mouse drag
			obj.$drag
				.fire("touchstart", start )
				.fire("touchmove", end )
				.fire("touchend", end )
				.fire("click", end );
		},
		done: function(){
			obj.$drag.remove();
			obj.$drop.remove();
			start();
		}
	};	

	asyncTest('Drag and Drop defaults',function(){
		// prep DEFAULT interaction
		obj.init();
		// simulate DEFAULT interaction
		obj.touch();
		// inspect results	
		equals( obj.draginit, 1, "draginit");
		equals( obj.dragstart, 1, "dragstart");
		equals( obj.drag, 1, "drag");
		equals( obj.dragend, 1, "dragend");
		equals( obj.dropinit, 1, "dropinit");
		equals( obj.dropstart, 1, "dropstart");
		equals( obj.drop, 1, "drop");
		equals( obj.dropend, 1, "dropend");
		// continue
		obj.done();
	});
	
	asyncTest('Drag "drop" option (false)',function(){
		// prep interaction
		obj.init({ drop:false });
		// simulate drag
		obj.touch();
		// inspect results		
		equals( obj.draginit, 1, "draginit");
		equals( obj.dragstart, 1, "dragstart");
		equals( obj.drag, 1, "drag");
		equals( obj.dragend, 1, "dragend");
		equals( obj.dropinit, 0, "dropinit");
		equals( obj.dropstart, 0, "dropstart");
		equals( obj.drop, 0, "drop");
		equals( obj.dropend, 0, "dropend");
		// continue
		obj.done();
	});
	
	asyncTest('Drag "drop" option (unmatched)',function(){
		// prep interaction
		obj.init({ drop:'body' });
		// simulate drag
		obj.touch();
		// inspect results		
		equals( obj.draginit, 1, "draginit");
		equals( obj.dragstart, 1, "dragstart");
		equals( obj.drag, 1, "drag");
		equals( obj.dragend, 1, "dragend");
		equals( obj.dropinit, 0, "dropinit");
		equals( obj.dropstart, 0, "dropstart");
		equals( obj.drop, 0, "drop");
		equals( obj.dropend, 0, "dropend");
		// continue
		obj.done();
	});

	asyncTest('Drag "drop" option (matched)',function(){
		// prep interaction
		obj.init({ drop:'div' });
		// simulate drag
		obj.touch();
		// inspect results		
		equals( obj.draginit, 1, "draginit");
		equals( obj.dragstart, 1, "dragstart");
		equals( obj.drag, 1, "drag");
		equals( obj.dragend, 1, "dragend");
		equals( obj.dropinit, 1, "dropinit");
		equals( obj.dropstart, 1, "dropstart");
		equals( obj.drop, 1, "drop");
		equals( obj.dropend, 1, "dropend");
		// continue
		obj.done();
	});

})();