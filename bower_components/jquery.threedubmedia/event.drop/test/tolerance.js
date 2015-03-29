;(function(){

	module("Tolerance Mode");
	
	// re-usable test harness object
	var obj = {
		init: function( opts ){
			// the drop element
			obj.$drop = $('<div />')
				.css({
					position: 'absolute',
					top: 200,
					left: 200,
					height: 100,
					width: 100
				})
				.appendTo( document.body )
				.bind("dropinit",function( event ){
					if ( obj.multidrop )
						return $( this )
							.clone( true )
							.addClass('clone')
							.appendTo( document.body )
							.add( this );
				})
				.bind("drop",function( event ){
					obj.count += 1;																 
				});
			// the drag element
			obj.$drag = $('<div />')
				.css({
					position: 'absolute',
					top: 100,
					left: 100,
					height: 100,
					width: 100
				})
				.appendTo( document.body )
				.bind("draginit", function( event ){
					if ( obj.multidrag )
						return $( this )
							.clone( true )
							.addClass('clone')
							.appendTo( document.body )
							.add( this );
				})
				.bind("dragstart",function( ev, dd ){
					if ( obj.proxy )
						return $( this ).clone()
							.addClass('clone')
							.appendTo( document.body );
				})
				.bind("drag",function( ev, dd ){
					if ( obj.move )
						$( dd.proxy ).css({ 
							top: dd.offsetY, 
							left: dd.offsetX 
						});
				})
				.bind("dragend",function( ev, dd ){
					var $div = $( this ).css({ 
						top: 100, 
						left: 100 
					});
					$( document.body ).find('.clone').remove();
				});
			// reset test vars
			obj.count = 0;
			obj.move = obj.proxy = obj.multidrag = obj.multidrop = null;
		},
		done: function(){
			obj.$drag.remove();
			obj.$drop.remove();
			start();
		}
	};
	
	// async iterator
	function asyncEach( obj, func, after ){
		// local refs
		var arr = [], i = 0, len;
		// translate into a secondary array
		$.each( obj, function( index, value ){
			len = arr.push({ that:this, index:index, value:value });
		});
		function next(){
			var data = arr[ i++ ], ret;
			if ( i <= len ){
				if ( data )
					ret = func.call( data.that, data.index, data.value, next );
					if ( ret === false )
						done();
			}
			else done();
		};
		function done(){
			if ( after )
				after();
		};
		next();
	}

	// test each mode...
	$.each({
		'mouse':{
			'overlap':[0,0,0,0,0], 
			'middle':[0,0,0,0,0], 
			'fit':[0,0,0,0,0], 
			'mouse':[1,1,1,2,4], 
			'away':[0,0,0,0,0] 
		},
		'overlap':{ 
			'overlap':[0,1,1,2,4], 
			'middle':[0,1,1,2,4], 
			'fit':[0,1,1,2,4], 
			'mouse':[0,0,0,0,0], 
			'away':[0,0,0,0,0] 
		}, 
		'middle':{ 
			'overlap':[0,0,0,0,0], 
			'middle':[0,1,1,2,4], 
			'fit':[0,1,1,2,4], 
			'mouse':[0,0,0,0,0], 
			'away':[0,0,0,0,0] 
		}, 
		'fit':{ 
			'overlap':[0,0,0,0,0], 
			'middle':[0,0,0,0,0], 
			'fit':[0,1,1,2,4], 
			'mouse':[0,0,0,0,0], 
			'away':[0,0,0,0,0] 
		}, 
		'intersect':{ 
			'overlap':[0,1,1,2,4], 
			'middle':[0,1,1,2,4], 
			'fit':[0,1,1,2,4], 
			'mouse':[1,1,1,2,4], 
			'away':[0,0,0,0,0] 
		}
	}, function( mode, expected ){
									
		// test each mode
		asyncTest('"'+ mode +'"',function(){
					
			expect( 25 );
			
			// test prep
			obj.init();
			$.drop({ 
				mode:mode, 
				multi:true
			});
			// drag to each position
			asyncEach({
				'overlap':{ pageX:33, pageY:33 }, 
				'middle':{ pageX:66, pageY:66 }, 
				'fit':{ pageX:100, pageY:100 }, 
				'mouse':{ pageX:250, pageY:250 }, 
				'away':{ pageX:-1, pageY:-1 } 
			}, function( where, coord, next ){
				// execute interaction variants
				asyncEach([
					'dropped '+ where +' (no motion)',
					'dropped '+ where +' (drag motion)',
					'dropped '+ where +' (proxy motion)',
					'dropped '+ where +' (multi drag)',
					'dropped '+ where +' (multi drop)'
				], function( i, msg, next ){
					// set-up
					obj.count = 0;
					obj.move = ( i > 0 );
					obj.proxy = ( i > 1 );
					obj.multidrag = ( i > 2 );
					obj.multidrop = ( i > 3 );
					// simulate a partial drag
					obj.$drag
						.fire("mousedown",{ pageX:0, pageY:0 })
						.fire("mousemove", coord )
						.fire("mouseup", coord )
						.fire("click", coord );
					equals( obj.count, expected[where][i], msg );
					next();
				}, next );
			}, obj.done );
		});
			
	});
	
})();