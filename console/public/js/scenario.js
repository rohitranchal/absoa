//Based on http://jsplumbtoolkit.com/demo/statemachine/demo-jquery.js
;(function() {
	jsPlumb.ready(function() {

		/* Slider initialization */
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
					if (ui.value > 8) {
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
			var obj;
			var s_id = $('#scenario_id').text();
			var svc_arr = [];
			$('.svc_name').each(function() {
				var svc_id = this.id.split('_');
				svc_arr.push(svc_id[1]);
			});
			var slist = JSON.stringify(svc_arr);
			var slink = '/scenario_logs?service_list=' + slist;

			/* clear log for each service */
			$.post(slink);

			if ( s_id == 2 ) {
				/* healthcare scenario does not have 'Try It' button anymore*/

				// obj = { link : $(this).data('link'), test_prescription : test_prescr, prescription : prescr , test_results : lab_result, name : pat_name, patient_id : p_id };
				//obj = { link : $(this).data('link')};
			} else {
				//online shopping scenario
				obj = { link : $(this).data('link')};
			}
			$.post('/try_it', obj, function (data) {
				/* Set log for each service */
				$.get(slink, function(logs, status) {
					if (status == 'success') {
						alert(data);
						// location.reload();						
						for (var s in logs) {
							$('#logid_' + logs[s].id).text(logs[s].log);
						}
					}
				});
			});
		});

		/* Set service toggle button display */
		$('.svc_status').each(function() {
			if (this.id == -1) {
				$('#btn_toggle_svc').text('Start');
				$('#btn_toggle_svc').removeClass('btn-danger').addClass('btn-default');
			}
		});

		/* Handle toggle services */
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

		$('.btn').click(function() {
			var s_id = $('#scenario_id').text();

			var test_prescr;	// test prescription entered by Doctor
			var prescr;			// prescription entered by Doctor
			var lab_result;		// test results entered by Lab
			var pat_name;		// name entered by Patient

			var p_id = 001122;	//Patient ID

			var svc_id = this.id.toString();
			console.log('Button was pressed, its id = ' + svc_id);

			if ( s_id == 2 ) {
				/* healthcare scenario */
				test_prescr = document.getElementById('doctdatkey_a6').value;
				prescr = document.getElementById('doctdatkey_b6').value;
				console.log('Doctor entered this test prescription: ' + test_prescr + ' and this prescription: ' + prescr );
				
				lab_result = document.getElementById('labdatkey7').value;
				console.log('Results entered by lab are here: ' + lab_result);
				
				pat_name = document.getElementById('patientdatkey8').value;
				console.log('Patient entered his/her name: ' + pat_name);

				console.log('link =  ' + $(this).data('link'));			
				obj = { link : $(this).data('link'), test_prescription : test_prescr, prescription : prescr , medical_data : lab_result, name : pat_name, patient_id : p_id };
			}	
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

			//var s_id = $('#scenario_id').text();
			s_id = $('#scenario_id').text();
			$.getJSON( '/scenario_topology?s_id=' + s_id, function( data ) {
				for(var i = 0; i < data.connections.length; i++) {
					var conn = data.connections[i];
					instance.connect({ source:'service' + conn[0], target:'service' + conn[1]});
				}
			});
			/* online shopping scenario */
			if (s_id == 1) {	
				// // Positions
				console.log('proceed with online shopping --> ' + s_id );
				var left = 0;
				var top = 0;
				var count = 0;
				$('.w').each(function(i) {
					$(this).css({
						left: left,
						top: top
					});

					if(count%2 > 0) {
						// left += 200;
						top += 300;
					} else {
						left += 300;
					}
					count++;
					if(left > 300) {
						left = 0;
					}
				});
			} else {
				console.log('proceed with healthcare --> ' + s_id);
				var ileft = 160;
				var itop = 200;
				var left = 160;
				var top = 160;
				var step = 255;
				var count = 0;
				var lflag = 0;
				var tflag = 0;
				$('.w').each(function(i) {
					$(this).css({
						left: left,
						top: top
					});
					count++;
					if(count%2 > 0) {
						if (tflag == 0) {
							top += step;
							tflag = 1;
						} else {
							left -= step;
							top -= step;
						}
					} else {
						if (lflag == 0) {
							left += step;
							top -= step;
							lflag = 1;
						} else {
							left -= step;
							top += step;
						}
					}
				});
			}
		});
	});
})();