//Based on http://jsplumbtoolkit.com/demo/statemachine/demo-jquery.js
;(function() {
	jsPlumb.ready(function() {

		// Slider initialization
		$('.slider').each(function() {
			var val = $(this).attr('value');
			$(this).slider({
				orientation		: 'horizontal',
				range			: 'max',
				min				: 1,
				max				: 10,
				value			: val,
				step			: 1,
				slide			: function(event, ui) {
					if (ui.value > 8){
						$(this).css('background','#00ff00');
					} else if (ui.value > 6) {
						$(this).css('background', '#ffff00');
					} else if (ui.value > 3) {
						$(this).css('background', '#d2691e');
					} else {
						$(this).css('background','#ff0000');
					}
				}
			});

			if (val > 8) {
				$(this).css('background','#00ff00');
			} else if (val > 6) {
				$(this).css('background', '#ffff00');
			} else if (val > 3) {
				$(this).css('background', '#d2691e');
			} else {
				$(this).css('background','#ff0000');
			}
		});

		// Invoke service for user
		$('.try-it').click(function() {
			$.post('/try_it', { link : $(this).data('link')}, function (data) {
				alert(data);
				location.reload();
			});
		});

		// Decide service toggle button display
		$('.svc_status').each(function() {
			if (this.id == -1) {
				$('#btn_toggle_svc').text('Start');
				$('#btn_toggle_svc').removeClass('btn-danger').addClass('btn-default');
			}
		});

		// Toggle services
		$('.svc_toggle').click(function() {
			var svcs_toggle = [];
			var count = 0;
			$('.svc_name').each(function() {
				svc_data = this.id.split('_');
				svcs_toggle[count] = [];
				svcs_toggle[count].push(svc_data[1]);
				svcs_toggle[count].push(svc_data[0]);
				count++;
			});

			if ($(this).hasClass('btn-default')) {
				for (var i=0; i<count; i++) {
					if (svcs_toggle[i][1] == -1) {
						var svc_id = svcs_toggle[i][0];
						$.post('/toggle_service', {service_id : svc_id}, function (data) {
							location.reload();
						});
					}
				}
			} else {
				for (var i=0; i<count; i++) {
					if (svcs_toggle[i][1] != -1) {
						var svc_id = svcs_toggle[i][0];
						$.post('/toggle_service', {service_id : svc_id}, function (data) {
							location.reload();
						});
					}
				}
			}
		});

		// Handle update service trust levels
		$('#btn_update_tl').click(function() {
			var vals = [];
			$('.slider').each( function() {
				vals[vals.length] = { name : this.id, value: $(this).slider('value') };
			});

			$.post('/update_service_trust', {values : vals}, function (data) {
				location.reload();
			});
		});

		// setup some defaults for jsPlumb.
		var instance = jsPlumb.getInstance({
			Endpoint			: ['Dot', {radius:2}],
			HoverPaintStyle		: {strokeStyle:'#1e8151', lineWidth:2 },
			ConnectionOverlays	: [
				[ 'Arrow', { location:1, id:'arrow', length:14, foldback:0.8} ],
				[ 'Label', { label:'FOO', id:'label', cssClass:'aLabel' } ]
			],
			Container			:'scenario-container'
		});

		var windows = jsPlumb.getSelector('.w');
		instance.draggable(windows);

		instance.bind('click', function(c) {
			instance.detach(c);
		});

		instance.bind('connection', function(info) {
			info.connection.getOverlay('label').setLabel('');
		});

		instance.doWhileSuspended(function() {
			instance.makeSource(windows, {
				filter:'.ep',       // only supported by jquery
				anchor:'Continuous',
				connector:['Straight'],
				connectorStyle:{ strokeStyle:'#5c96bc', lineWidth:2, outlineColor:'transparent', outlineWidth:4 },
				maxConnections:6,
				onMaxConnections:function(info, e) {
					alert('Maximum connections (' + info.maxConnections + ') reached');
				}
			});

			// initialise all '.w' elements as connection targets.
			instance.makeTarget(windows, {
				dropOptions:{ hoverClass:'dragHover' },
				anchor:'Continuous'
			});

			var s_id = $('#scenario_id').text();
			$.getJSON( '/scenario_topology?s_id=' + s_id, function( data ) {
				for(var i = 0; i < data.connections.length; i++) {
					var conn = data.connections[i];
					instance.connect({ source:'service' + conn[0],
					target:'service' + conn[1]});
				}
			});

			// Positions
			var left = 0;
			var top = 0;
			var count = 0;
			$('.w').each(function(i) {
				$(this).css({
					left: left,
					top: top
				});

				if(count%2 > 0) {
					left += 150;
					top += 150;
				} else {
					left += 300;
				}
				count++;

				if(left > 500) {
					left = 0;
				}
			});

		});
	});
})();