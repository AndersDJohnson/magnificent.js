module("Callback Properties");

$.each(["init","start","","end"],function( i, type ){
	
	test('"drag'+ type +'" callback',function(){
						
		expect( 13 );
		
		// create the markup for the test
		var $div = $('<div />')
			.appendTo( document.body ),
		// starting position
		sx = Math.round( Math.random() * 90 ) + 5,
		sy = Math.round( Math.random() * 90 ) + 5,
		// mouse offset position
		mx = Math.round( Math.random() * 90 ) + 5,
		my = Math.round( Math.random() * 90 ) + 5,
		// distance dragged
		dx = Math.round( Math.random() * 90 ) + 5,
		dy = Math.round( Math.random() * 90 ) + 5;
	
		$div
			.drag( type, function( event, dd ){
				
				ok( dd.target == $div[0], "target: [drag target]" );
				ok( dd.drag == $div[0], "drag: [drag target]" );
				ok( dd.proxy == $div[0], "proxy: [drag target]" );
				
				equals( dd.startX, sx + mx, "startX" );
				equals( dd.startY, sy + my, "startY" );
				
				equals( dd.deltaX, i ? dx : 0, "deltaX" );
				equals( dd.deltaY, i ? dy : 0, "deltaY" );
				
				equals( dd.originalX, sx, "originalX" );
				equals( dd.originalY, sy, "originalY" );
				
				equals( dd.offsetX, i ? sx + dx : sx, "offsetX" );
				equals( dd.offsetY, i ? sy + dy : sy, "offsetY" );
				
				ok( dd.drop.constructor == Array && !dd.drop.length, "drop: []" );
				ok( dd.available.constructor == Array && !dd.available.length, "available: []" );
				
			})
			.css({
				position: 'absolute',
				top: sy,
				left: sx,
				height: 100,
				width: 100
			})
			// simulate a drag
			.fire("mousedown",{ 
				pageX: sx + mx, 
				pageY: sy + my
			})
			.fire("mousemove",{ 
				pageX: sx + mx + dx, 
				pageY: sy + my + dy
			})
			.fire("mouseup",{ 
				pageX: sx + mx + dx, 
				pageY: sy + my + dy 
			})
			.fire("click",{ 
				pageX: sx + mx + dx, 
				pageY: sy + my + dy 
			});
		$div.remove();
	});
});