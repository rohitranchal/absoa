//Based on http://jsplumbtoolkit.com/demo/statemachine/demo-jquery.js
;(function() {
	jsPlumb.ready(function() {
		/* Get scenario id */
		var s_id = $('#scenario_id').text();
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
			var obj = {};
			s_id = $('#scenario_id').text();
			var svc_arr = [];
			$('.svc_name').each(function() {
				var svc_id = this.id.split('_');
				svc_arr.push(svc_id[1]);
			});
			var slist = JSON.stringify(svc_arr);
			var slink = '/scenario_logs?service_list=' + slist;

			/* clear log for each service */
			$.post(slink, function(data, status) {
				for (var i=0; i < svc_arr.length; i++) {
					$('#logid_' + svc_arr[i]).text('');
				}
			});

			if ($('#tamper_attack').prop('checked')) {
				obj.tamper = 1;
			}
			if (s_id == 1) {
				obj.link = $(this).data('link');
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

		/* Scenario toggle buttons for context and attack */
		var emergency_status = $.cookie('emergency');
		var tamper_status = $.cookie('tamper_attack');
		if (tamper_status == 1) {
			$('#tamper_attack').bootstrapToggle('on');
		}
		if (emergency_status == 1) {
			$('#emergency').bootstrapToggle('on');
		}

		$('.emrgcontext').change(function() {
			var status;
			if ($('.emrgcontext').prop('checked')) {
				status = 1;
			} else {
				status = 0;
			}
			var elem_id = $(this).attr('id');
			$.cookie(elem_id, status);
		});

		$('#tamper_attack').change(function() {
			var status;
			if ($('#tamper_attack').prop('checked')) {
				status = 1;
				if (s_id == 2) {
					$.post('/tamper', { status : status, scenario_id : s_id }, function (data) {
						alert(data);
					});
				}
			} else {
				status = 0;
				if (s_id == 2) {
					$.post('/tamper', { status : status, scenario_id : s_id }, function (data) {
						alert(data);
					});
				}
			}
			var elem_id = $(this).attr('id');
			$.cookie(elem_id, status);
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

		/* Handle update service trust levels */
		$('#btn_update_tl').click(function() {
			var vals = [];
			$('.slider').each( function() {
				vals[vals.length] = { name : this.id, value: $(this).slider('value') };
			});

			$.post('/update_service_trust', {values : vals}, function (data) {
				location.reload();
			});
		});

		/* Dropdown boxes data in Healthcare scenario */
		if (s_id == 2) {
			var AB_fields = ['patient_id', 'medical_data', 'history', 'test_prescription', 'prescription', 'insurance_id', 'treatment_code'];
			var populate_dropdownbox = function(combobox) {
				for(var i = 0; i < AB_fields.length; i++) {
					var opt = document.createElement('option');
					opt.innerHTML = AB_fields[i];
					opt.value = AB_fields[i];
					combobox.appendChild(opt);
				}
			};
			for (var j=6; j<10; j++) {
				populate_dropdownbox(document.getElementById('srv-name-get' + j));	
			}
		}
	
		$('.hlt-ab').click(function() {
			if (s_id == 2) {
				/* healthcare scenario */
				var button_id = this.id.toString();
				var patient_id = 001122;
				var prescription = document.getElementById('doctdatkey_b6').value;
				var test_prescription = document.getElementById('doctdatkey_a6').value;
				var test_results = document.getElementById('labdatkey7').value;
				var emergency = 0, tamper = 0;
				if ($('#emergency').prop('checked')) {
					emergency = 1;
				}
				if ($('#tamper_attack').prop('checked')) {
					tamper = 1;
				}
				var obj = { 
					patient_id : patient_id,
					test_prescription : test_prescription,
					prescription : prescription,
					medical_data : test_results, 
					tamper : tamper,
					emergency : emergency
				};
				// patient_age, patient_height, patient_weight
				if (button_id.indexOf('svc_get_6') != -1) {
					/* Doctor get */
					var getsrvchoice = document.getElementById('srv-name-get6');
					obj.ab_request = getsrvchoice.options[getsrvchoice.selectedIndex].value;
					obj.link = $(this).data('link') + '/dr_get';
					operation_url = '/healthcare_get';					
				}
				if (button_id.indexOf('svc_post_6') != -1) {
					/* Doctor update */
					obj.link = $(this).data('link') + '/dr_update';
					operation_url = '/healthcare_update';	
				}
				if (button_id.indexOf('svc_get_7') != -1) {
					/* Lab get */
					var getsrvchoice = document.getElementById('srv-name-get7');
					obj.ab_request = getsrvchoice.options[getsrvchoice.selectedIndex].value;
					obj.link = $(this).data('link') + '/lab_get';
					operation_url = '/healthcare_get';
				}
				if (button_id.indexOf('svc_post_7') != -1) {
					/* Lab update */
					obj.link = $(this).data('link') + '/lab_update';
					operation_url = '/healthcare_update';
				}
				if (button_id.indexOf('svc_get_8') != -1) {
					/* Paramedic get */
					var getsrvchoice = document.getElementById('srv-name-get8');
					obj.ab_request = getsrvchoice.options[getsrvchoice.selectedIndex].value;
					obj.link = $(this).data('link') + '/pat_get';
					operation_url = '/healthcare_get';
				}
				if (button_id.indexOf('svc_get_9') != -1) {
					/* Pharmacy get */
					var getsrvchoice = document.getElementById('srv-name-get9');
					obj.ab_request = getsrvchoice.options[getsrvchoice.selectedIndex].value;
					obj.link = $(this).data('link') + '/pharm_get';
					operation_url = '/healthcare_get';
				}
				$.post(operation_url, obj, function (data) {
					alert(data);
					location.reload();
				});
			}
		});

		/* Setup some defaults for jsPlumb */
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

			s_id = $('#scenario_id').text();
			$.getJSON( '/scenario_topology?s_id=' + s_id, function( data ) {
				for(var i = 0; i < data.connections.length; i++) {
					var conn = data.connections[i];
					instance.connect({ source:'service' + conn[0], target:'service' + conn[1]});
				}
			});
			/* Service container positions */
			if (s_id == 1 || s_id == 4) {
				/* Online shopping and P2P scenario */
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
			} else if (s_id == 2 || s_id == 3) {
				/* Healthcare and Pub/Sub scenario */
				var ileft = 180;
				var itop = 180;
				var left = 180;
				var top = 180;
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
			} else if (s_id == 5 || s_id == 6) {
				/* Immutable and Mutable scenario */
				var left = -60;
				var top = 0;
				var count = 0;
				$('.w').each(function(i) {
					$(this).css({
						left: left,
						top: top
					});
					left += 250;
				});
			}
		});
	});
})();