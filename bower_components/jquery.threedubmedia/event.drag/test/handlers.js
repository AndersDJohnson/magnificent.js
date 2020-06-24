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
				.appendTo( document.body )
				.bind("draginit dragstart drag dragend click", opts || {}, function( event ){
					obj[ event.type ] += 1;
					if ( obj.extra[ event.type ] )
						obj.extra[ event.type ].apply( this, arguments );
					return obj.returned[ event.type ];
				});
			
			$.extend( obj, { draginit:0, dragstart:0, drag:0, dragend:0, click:0 });
			obj.extra = {};
			obj.returned = {};
		},
		mouse: function(){
			var start = {
				pageX: Math.round( Math.random() * 90 ) + 5,
				pageY: Math.round( Math.random() * 90 ) + 5
			},
			end = {
				pageX: Math.round( Math.random() * 90 ) + start.pageX,
				pageY: Math.round( Math.random() * 90 ) + start.pageY
			};
			// simulate a complete mouse drag
			obj.$div
				.fire("mousedown", start )
				.fire("mousemove", end )
				.fire("mouseup", end )
				.fire("click", end );
		},
		done: function( ms ){
			obj.$div.remove();
			start();
		}
	};
			
	// test DRAGINIT FALSE
	asyncTest('"draginit" return false',function(){
		expect( 5 );		
		// test prep
		obj.init();
		obj.returned['draginit'] = false;
		// simulate a mouse drag
		obj.mouse();
		// check counts
		equals( obj.draginit, 1, "draginit fired");
		equals( obj.dragstart, 0, "dragstart did not fire");
		equals( obj.drag, 0, "drag did not fire");
		equals( obj.dragend, 0, "dragend did not fire");
		equals( obj.click, 1, "click fired");
		// continue
		obj.done();	
	});

	asyncTest('"dragstart" return false',function(){
		expect( 5 );
		// test prep
		obj.init();
		obj.returned['dragstart'] = false;
		// simulate a mouse drag
		obj.mouse();
		// check counts
		equals( obj.draginit, 1, "draginit fired");
		equals( obj.dragstart, 1, "dragstart fired");
		equals( obj.drag, 0, "drag did not fire");
		equals( obj.dragend, 0, "dragend did not fire");
		equals( obj.click, 1, "click fired");
		// continue
		obj.done();	
	});

	asyncTest('"drag" return false',function(){
		expect( 5 );
		// test prep
		obj.init();
		obj.returned['drag'] = false;
		// simulate a mouse drag
		obj.mouse();
		// check ocunts
		equals( obj.draginit, 1, "draginit fired");
		equals( obj.dragstart, 1, "dragstart fired");
		equals( obj.drag, 1, "drag fired");
		equals( obj.dragend, 1, "dragend fired");
		equals( obj.click, 0, "click did not fire");
		// continue
		obj.done();	
	});

	asyncTest('"draginit" return new element',function(){
		expect( 8 );
		// test prep
		obj.init();
		var $clone = obj.returned['draginit'] = obj.$div.clone( true );
		obj.extra['dragstart'] = obj.extra['drag'] = obj.extra['dragend'] = function( ev, dd ){
			ok( dd.drag === $clone[0], ev.type +' target element' );
		};
		// simulate a mouse drag
		obj.mouse();
		// check counts
		equals( obj.draginit, 1, "draginit fired");
		equals( obj.dragstart, 1, "dragstart fired");
		equals( obj.drag, 1, "drag fired");
		equals( obj.dragend, 1, "dragend fired");
		equals( obj.click, 0, "click did not fire");
		// continue
		obj.done();	
	});

	asyncTest('"draginit" return multiple elements',function(){
		expect( 5 );
		// test prep
		obj.init();
		obj.returned['draginit'] = obj.$div.clone( true ).add( obj.$div );
		// simulate a mouse drag
		obj.mouse();
		// check counts
		equals( obj.draginit, 1, "draginit fired once");
		equals( obj.dragstart, 2, "dragstart fired twice");
		equals( obj.drag, 2, "drag fired twice");
		equals( obj.dragend, 2, "dragend fired twice");
		equals( obj.click, 0, "click did not fire");
		// continue
		obj.done();	
	});


	asyncTest('"dragstart" return proxy element',function(){
		expect( 7 );
		// test prep
		obj.init();
		var $proxy = obj.returned['dragstart'] = obj.$div.clone().addClass('proxy');
		obj.extra['drag'] = obj.extra['dragend'] = function( ev, dd ){
			ok( dd.proxy === $proxy[0], ev.type +' proxy element' );
		};
		// simulate a mouse drag
		obj.mouse();
		// check counts	
		equals( obj.draginit, 1, "draginit");
		equals( obj.dragstart, 1, "dragstart");
		equals( obj.drag, 1, "drag");
		equals( obj.dragend, 1, "dragend");
		equals( obj.click, 0, "click did not fire");
		// continue
		obj.done();	
	});

})();