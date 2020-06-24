module("Callback Properties");

$.each(["init","start","","end"],function( i, type ){
	
	test('"drop'+ type +'" callback',function(){
	
		expect( i ? 10 : 12 );
		
		// create the markup for the test	
		var $drag = $('<div class="drag"/>')
			.appendTo( document.body )
			.css({
				position: 'absolute',
				top: 0,
				left: 0,
				height: 100,
				width: 100
			})
			.bind("draginit",function( ev, dd ){
				same( dd.drop, [], 'draginit: "drop"' );
				same( dd.available, [], 'draginit: "available"' );
			})
			.bind("dragstart",function( ev, dd ){
				same( dd.drop, [], 'dragstart: "drop"' );
				same( dd.available, available, 'dragstart: "available"' );
			})
			.bind("drag",function( ev, dd ){
				same( dd.drop, [], 'drag: "drop"' );
				same( dd.available, available, 'drag: "available"' );
			})
			.bind("dragend",function( ev, dd ){
				same( dd.drop, drop, 'dragend: "drop"' );
				same( dd.available, available, 'dragend: "available"' );
				$drag.remove();
				$drop.remove();
			}),
		$drop = $('<div class="drop"/><div class="drop"/>')
			.appendTo( document.body )
			.css({
				position: 'absolute',
				top: 0,
				left: 0,
				height: 100,
				width: 100
			})
			.drop( type, function( ev, dd ){
				same( dd.drop, i < 2 ? [] : drop, 'drop'+ type +': "drop"' );
				same( dd.available, i < 1 ? [] : available, 'drop'+ type +': "available"' );
			}),
		available = $drop.toArray(),
		drop = $drop.eq(0).toArray();
		
		$.drop({ mode:'overlap', multi:false });
		// simulate a complete drag and drop
		$drag
			.fire("mousedown",{ pageX:50, pageY:50 })
			.fire("mousemove",{ pageX:51, pageY:51 })
			.fire("mouseup",{ pageX:51, pageY:51 })
			.trigger("click");
	});
	
});