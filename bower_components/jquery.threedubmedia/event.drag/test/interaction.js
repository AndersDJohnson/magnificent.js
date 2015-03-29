;(function(){
	
	module("Mouse Interaction");

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
				.bind("draginit dragstart drag dragend click", opts || {}, function( event ){
					obj[ event.type ] += 1;
				});
			$.extend( obj, { draginit:0, dragstart:0, drag:0, dragend:0, click:0 });
		},
		done: function(){
			obj.$div.remove();
			start();
		}
	};

	asyncTest("default",function(){
		expect( 5 );
		// prep DEFAULT interaction
		obj.init();
		// simulate DEFAULT interaction
		obj.$div
			.fire("mousedown",{ pageX:50, pageY:50 })
			.fire("mousemove",{ pageX:51, pageY:51 })
			.fire("mouseup",{ pageX:51, pageY:51 })
			.fire("click");
		// inspect results	
		equals( obj.draginit, 1, "draginit");
		equals( obj.dragstart, 1, "dragstart");
		equals( obj.drag, 1, "drag");
		equals( obj.dragend, 1, "dragend");
		equals( obj.click, 0, "click");
		// clean-up interaction
		obj.done();
	});

	asyncTest('"not" option',function(){
		expect( 10 );
		// prep interaction
		obj.init({ not:'.child' });
		// simulate NOT interaction
		obj.$div.children()
			.fire("mousedown",{ pageX:50, pageY:50 })
			.fire("mousemove",{ pageX:51, pageY:51 })
			.fire("mouseup",{ pageX:51, pageY:51 })
			.fire("click");
		// inspect results		
		equals( obj.draginit, 0, "draginit");
		equals( obj.dragstart, 0, "dragstart");
		equals( obj.drag, 0, "drag");
		equals( obj.dragend, 0, "dragend");
		equals( obj.click, 1, "click");
		// simlate NON NOT interaction
		obj.$div
			.fire("mousedown",{ pageX:50, pageY:50 })
			.fire("mousemove",{ pageX:51, pageY:51 })
			.fire("mouseup",{ pageX:51, pageY:51 })
			.fire("click");
		// inspect results		
		equals( obj.draginit, 1, "draginit");
		equals( obj.dragstart, 1, "dragstart");
		equals( obj.drag, 1, "drag");
		equals( obj.dragend, 1, "dragend");
		equals( obj.click, 1, "click");
		// clean-up interaction
		obj.done();
	});

	asyncTest('"handle" option',function(){
		expect( 10 );
		// prep interaction
		obj.init({ handle:'.child' });
		// simulate HANDLE interaction
		obj.$div.children()
			.fire("mousedown",{ pageX:50, pageY:50 })
			.fire("mousemove",{ pageX:51, pageY:51 })
			.fire("mouseup",{ pageX:51, pageY:51 })
			.fire("click");
		// inspect results		
		equals( obj.draginit, 1, "draginit");
		equals( obj.dragstart, 1, "dragstart");
		equals( obj.drag, 1, "drag");
		equals( obj.dragend, 1, "dragend");
		equals( obj.click, 0, "click");	
		// simulate NON HANDLE interaction
		obj.$div
			.fire("mousedown",{ pageX:50, pageY:50 })
			.fire("mousemove",{ pageX:51, pageY:51 })
			.fire("mouseup",{ pageX:51, pageY:51 })
			.fire("click");
		// inspect results		
		equals( obj.draginit, 1, "draginit");
		equals( obj.dragstart, 1, "dragstart");
		equals( obj.drag, 1, "drag");
		equals( obj.dragend, 1, "dragend");
		equals( obj.click, 1, "click");
		// clean-up interaction
		obj.done();
	});
	
	asyncTest('"which" option',function(){
		expect( 10 );
		// prep interaction
		obj.init({ which:3 });
		// simulate WHICH interaction
		obj.$div
			.fire("mousedown",{ pageX:50, pageY:50, button:2 })
			.fire("mousemove",{ pageX:51, pageY:51 })
			.fire("mouseup",{ pageX:51, pageY:51 })
			.fire("click");
		// inspect results
		equals( obj.draginit, 1, "draginit");
		equals( obj.dragstart, 1, "dragstart");
		equals( obj.drag, 1, "drag");
		equals( obj.dragend, 1, "dragend");
		equals( obj.click, 0, "click");	
		// simulate NON WHICH interaction
		obj.$div
			.fire("mousedown",{ pageX:50, pageY:50 })
			.fire("mousemove",{ pageX:51, pageY:51 })
			.fire("mouseup",{ pageX:51, pageY:51 })
			.fire("click");
		// inspect results
		equals( obj.draginit, 1, "draginit");
		equals( obj.dragstart, 1, "dragstart");
		equals( obj.drag, 1, "drag");
		equals( obj.dragend, 1, "dragend");
		equals( obj.click, 1, "click");
		// clean-up interaction
		obj.done();
	});	

	asyncTest('"distance" option',function(){
		expect( 10 );
		// prep interaction
		obj.init({ distance:5 });
		// simulate NON DISTANCE interaction
		obj.$div
			.fire("mousedown",{ pageX:50, pageY:50 })
			.fire("mousemove",{ pageX:51, pageY:51 })
			.fire("mouseup",{ pageX:51, pageY:51 })
			.fire("click");
		// inspect results		
		equals( obj.draginit, 1, "draginit");
		equals( obj.dragstart, 0, "dragstart");
		equals( obj.drag, 0, "drag");
		equals( obj.dragend, 0, "dragend");
		equals( obj.click, 1, "click");	
		// simulate DISTANCE interaction
		obj.$div
			.fire("mousedown",{ pageX:50, pageY:50 })
			.fire("mousemove",{ pageX:53, pageY:54 })
			.fire("mouseup",{ pageX:53, pageY:54 })
			.fire("click");
		// inspect results		
		equals( obj.draginit, 2, "draginit");
		equals( obj.dragstart, 1, "dragstart");
		equals( obj.drag, 1, "drag");
		equals( obj.dragend, 1, "dragend");
		equals( obj.click, 1, "click");
		// clean-up interaction
		obj.done();
	});


	asyncTest('"click" option',function(){
		expect( 5 );
		// prep interaction
		obj.init({ click:true });
		// simulate CLICK interaction
		obj.$div
			.fire("mousedown",{ pageX:50, pageY:50 })
			.fire("mousemove",{ pageX:51, pageY:51 })
			.fire("mouseup",{ pageX:51, pageY:51 })
			.fire("click");
		// inspect results	
		equals( obj.draginit, 1, "draginit");
		equals( obj.dragstart, 1, "dragstart");
		equals( obj.drag, 1, "drag");
		equals( obj.dragend, 1, "dragend");
		equals( obj.click, 1, "click");	
		// clean-up interaction
		obj.done();
	});
	
})();