;(function(){
	
	module("Event Handlers");
	
	// a simple re-usable test harness object
	var obj = {
		init: function( opts ){
			obj.$drag = $('<div class="drag"/>')
				.appendTo( document.body )
				.css({
					position: 'absolute',
					top: 0,
					left: 0,
					height: 100,
					width: 100
				})
				.bind("dragend",{ drop:'.drop' },function( event, dd ){
					same( dd.drop, obj.dragend, "drop (dragend)" );
				});
			obj.$drop = $('<div class="drop"/><div class="extra"/>')
				.appendTo( document.body )
				.css({
					position: 'absolute',
					top: 0,
					left: 0,
					height: 100,
					width: 100
				})
				.bind("dropinit dropstart drop dropend",function( event, dd ){
					obj[ event.type ] += 1;
					return obj.returned[ event.type ];
				});
			$.extend( obj, { dropinit:0, dropstart:0, drop:0, dropend:0 });
			$.drop({ mode:'overlap', multi:false });
			obj.returned = {};
			obj.dragend = null;
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
			obj.$drag
				.fire("mousedown", start )
				.fire("mousemove", end )
				.fire("mouseup", end )
				.fire("click", end );
		},
		done: function( ms ){
			obj.$drag.remove();
			obj.$drop.remove();
			start();
		}
	};
	
	asyncTest('"dropinit" return false',function(){	
		expect( 5 );
		// test prep
		obj.init();
		obj.returned['dropinit'] = false;
		obj.dragend = [];
		// simulate a partial drag
		obj.mouse();
		// check counts
		equals( obj.dropinit, 1, "dropinit");
		equals( obj.dropstart, 0, "dropstart");
		equals( obj.drop, 0, "drop");
		equals( obj.dropend, 0, "dropend");
		// continue
		obj.done();
	});
	
	asyncTest('"dropstart" return false',function(){	
		expect( 5 );
		// test prep
		obj.init();
		obj.returned['dropstart'] = false;
		obj.dragend = [];
		// simulate a partial drag
		obj.mouse();
		// check counts
		equals( obj.dropinit, 1, "dropinit");
		equals( obj.dropstart, 1, "dropstart");
		equals( obj.drop, 0, "drop");
		equals( obj.dropend, 0, "dropend");
		// continue
		obj.done();
	});

	
	asyncTest('"drop" return false',function(){	
		expect( 5 );
		// test prep
		obj.init();// test DROP FALSE
		obj.returned['drop'] = false;
		obj.dragend = [];
		// simulate a partial drag
		obj.mouse();
		// check counts
		equals( obj.dropinit, 1, "dropinit");
		equals( obj.dropstart, 1, "dropstart");
		equals( obj.drop, 1, "drop");
		equals( obj.dropend, 0, "dropend");
		// continue
		obj.done();
	});
	
	asyncTest('"dropinit" return elements',function(){	
		expect( 5 );
		// test prep
		obj.init();
		obj.returned['dropinit'] = obj.$drop.eq(1);
		obj.dragend = [ obj.$drop[1] ];
		// simulate a partial drag
		obj.mouse();
		// check counts
		equals( obj.dropinit, 1, "dropinit");
		equals( obj.dropstart, 1, "dropstart");
		equals( obj.drop, 1, "drop");
		equals( obj.dropend, 1, "dropend");
		// continue
		obj.done();
	});
		
})();