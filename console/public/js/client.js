$( document ).ready(function() {

	var data_arr = [];
	var policy_arr = [];

	//for managing dropdown boxes in "Policies for AB" section 
	var ratings = [1, 2, 3, 4, 5];
	
	//Filling in default values for <key ; value> pairs in 'Data for AB' section	
	if (document.getElementById('datkey1') != null) {
		document.getElementById('datkey1').value = $('.inputkey1').attr('placeholder');
		document.getElementById('dataval1').value = $('.inputval1').attr('placeholder');
		
		document.getElementById('datkey2').value = $('.inputkey2').attr('placeholder');
		document.getElementById('dataval2').value = $('.inputval2').attr('placeholder');

		document.getElementById('datkey3').value = $('.inputkey3').attr('placeholder');
		document.getElementById('dataval3').value = $('.inputval3').attr('placeholder');

		document.getElementById('datkey4').value = $('.inputkey4').attr('placeholder');
		document.getElementById('dataval4').value = $('.inputval4').attr('placeholder');

		document.getElementById('datkey5').value = $('.inputkey5').attr('placeholder');
		document.getElementById('dataval5').value = $('.inputval5').attr('placeholder');

		document.getElementById('datkey6').value = $('.inputkey6').attr('placeholder');
		document.getElementById('dataval6').value = $('.inputval6').attr('placeholder');
	}	

	//Managing "Policies for AB" section
	var populate_dropdownbox = function(combobox) {
		for(var i = 0; i < ratings.length; i++) {
			var opt = document.createElement('option');
			opt.innerHTML = ratings[i];
			opt.value = ratings[i];
			combobox.appendChild(opt);
		}
	};

	if (document.getElementById('pol1') != null) {
		var razd = '  ;  ' + '  ' + 'rating: ';
		var rat = 'abc';
		/*  16 Feb.
		for (var j = 0; j < 4; j++) { 
			var objname = $('policy_' + j);
			//obj = JSON.parse(objname.attr('name'));
			//var obj = JSON.parse($(objname).attr('name'));	
			console.log('objname = ' + objname.attr('name'));
		*/	
		var obj = JSON.parse($('.policy_1').attr('name'));
		$('#pol1').text($('.policy_1').attr('placeholder') + ' ' + razd);
		var elem1 = document.getElementById('req-data1');
		populate_dropdownbox(elem1);
		rat = obj.rating;
		$('#req-data1 option').each(function () {										
			if ($(this).html() == rat) {
				$(this).attr("selected", "selected");
				return;
			}
		});
		document.getElementById('credlim1').value = obj.credit_limit;
		//event on change of dropdown selection 
		$('.dropdown1').change(function() {
			var data = elem1.options[elem1.selectedIndex].value;
			console.log('dropdown1 box selected data: ' + data);
		});
			
		obj = JSON.parse($('.policy_2').attr('name'));
		//OK $('#pol2').text($('.policy_2').attr('placeholder') + razd + obj.rating);
		$('#pol2').text($('.policy_2').attr('placeholder') + razd);
		var elem2 = document.getElementById('req-data2');
		populate_dropdownbox(elem2);
		rat = obj.rating;
		$('#req-data2 option').each(function () {										
			if ($(this).html() == rat) {
				$(this).attr("selected", "selected");
				return;
			}
		});
		$('.dropdown2').change(function() {
			var data = elem2.options[elem2.selectedIndex].value;
			console.log('dropdown2 box selected data: ' + data);
		});

		obj = JSON.parse($('.policy_3').attr('name'));
		//OK 17 Feb. $('#pol3').text($('.policy_3').attr('placeholder') + razd + obj.rating);
		$('#pol3').text($('.policy_3').attr('placeholder') + razd);
		var elem3 = document.getElementById('req-data3');
		populate_dropdownbox(elem3);
		rat = obj.rating;
		$('#req-data3 option').each(function () {										
			if ($(this).html() == rat) {
				$(this).attr("selected", "selected");
				return;
			}
		});
		$('.dropdown3').change(function() {
			var data = elem3.options[elem3.selectedIndex].value;
			console.log('dropdown3 box selected data: ' + data);
		});

		obj = JSON.parse($('.policy_4').attr('name'));
		//OK 17 Feb. $('#pol4').text($('.policy_4').attr('placeholder') + razd + obj.rating);
		$('#pol4').text($('.policy_4').attr('placeholder') + razd );
		var elem4 = document.getElementById('req-data4');
		populate_dropdownbox(elem4);
		rat = obj.rating;
		$('#req-data4 option').each(function () {										
			if ($(this).html() == rat) {
				$(this).attr("selected", "selected");
				return;
			}
		});
		$('.dropdown4').change(function() {
			var data = elem4.options[elem4.selectedIndex].value;
			console.log('dropdown4 box selected data: ' + data);
		});

		//for j cycle 16 Feb. }	
	}

/* OK
	$('.ab_data').each(function() {
		var status_val = $(this).text();
		console.log(status_val);
		$('datkey' + this.id).value = 'aaa' + this.id.value;
		document.getElementById('datkey' + this.id).value = 'abc';
		document.getElementById('dataval' + this.id).value = '220';
	});
*/ 
	
	//handle clicks on 6 checkboxes at localhost:3000/client 
	$('.checkbox1').click(function() {
		var status_val = (this).checked;  
		console.log('Clicked on checkbox1 ... ' + status_val);
		
		if (this.checked) {			
			var textbox_val = document.getElementById('dataval1').value;
			var textbox_key = document.getElementById('datkey1').value; 
			console.log('checked checkbox1...' + textbox_key + '  , ' + textbox_val);
			data_arr[textbox_key] = textbox_val;
		} else {
			// remove from array - not necessary because we do it in routes/index.js
		}
	});

	$('.checkbox2').click(function() {
		var status_val = (this).checked;  //will work now 
		console.log('Clicked on checkbox2 ... ' + status_val);
		if (this.checked) {			
			var textbox_val = document.getElementById('dataval2').value;
			var textbox_key = document.getElementById('datkey2').value; 
			console.log('checked checkbox2...'  + textbox_key + '  , ' + textbox_val);
			data_arr[textbox_key] = textbox_val;
		} else {
			// remove from array  - not necessary because we do it in routes/index.js
		}
	});

	$('.checkbox3').click(function() {
		var status_val = (this).checked;  
		console.log('Clicked on checkbox3 ... ' + this.checked);
		if (this.checked) {			
			var textbox_val = document.getElementById('dataval3').value;
			var textbox_key = document.getElementById('datkey3').value; 
			console.log('checked checkbox3...' + textbox_key + '  , ' + textbox_val );
			data_arr[textbox_key] = textbox_val;
		} else {
			// remove from array  - not necessary because we do it in routes/index.js
		}
	});

	$('.checkbox4').click(function() {
		var status_val = (this).checked;  
		console.log('Clicked on checkbox4 ... ' + this.checked);
		if (this.checked) {			
			var textbox_val = document.getElementById('dataval4').value;
			var textbox_key = document.getElementById('datkey4').value; 
			console.log('checked checkbox4...' + textbox_key + '  , ' + textbox_val );
			data_arr[textbox_key] = textbox_val;
		} else {
			// remove from array  - not necessary because we do it in routes/index.js
		}
	});

	$('.checkbox5').click(function() {
		var status_val = (this).checked;  //will work now 
		console.log('Clicked on checkbox5 ... ' + status_val);
		if (this.checked) {			
			var textbox_val = document.getElementById('dataval5').value;
			var textbox_key = document.getElementById('datkey5').value; 
			console.log('checked checkbox5...'  + textbox_key + '  , ' + textbox_val);
			data_arr[textbox_key] = textbox_val;
		} else {
			// remove from array  - not necessary because we do it in routes/index.js
		}
	});

	$('.checkbox6').click(function() {
		var status_val = (this).checked;  //will work now 
		console.log('Clicked on checkbox6 ... ' + status_val);
		if (this.checked) {			
			var textbox_val = document.getElementById('dataval6').value;
			var textbox_key = document.getElementById('datkey6').value; 
			console.log('checked checkbox6...'  + textbox_key + '  , ' + textbox_val);
			data_arr[textbox_key] = textbox_val;
		} else {
			// remove from array  - not necessary because we do it in routes/index.js
		}
	});

	//Generate AB button
	$('.btn').click(function() {
		console.log('Generate AB button was pressed');
		console.log(' data_arr = ' + data_arr);
		$.post('/client', {service_id : 'some'}, function (data) {
			console.log('create call');
			location.reload();
		});

	});

	//select all checkbox
	$('.checkboxall').click(function() {
		var status_val = (this).checked;  //will work now 
		console.log('Clicked on Select All checkbox ... ' + status_val);
		if (this.checked) {			
			$('.checkbox1').prop('checked', true);
			$('.checkbox2').prop('checked', true);
			$('.checkbox3').prop('checked', true);
			$('.checkbox4').prop('checked', true);
			$('.checkbox5').prop('checked', true);
			$('.checkbox6').prop('checked', true);
		} else {
			$('.checkbox1').prop('checked', false);
			$('.checkbox2').prop('checked', false);
			$('.checkbox3').prop('checked', false);
			$('.checkbox4').prop('checked', false);
			$('.checkbox5').prop('checked', false);
			$('.checkbox6').prop('checked', false);
		}
	});

	//Buttons are not used anymore. Checkboxes are used - see below (9 Feb.)
	$('.enable_btn1').click(function() {
		//var status_text = document.getElementById('#b1').text;
		var status_text = $('#b1').text;
		console.log('Enable policy1 button was pressed');

		//4 Feb. 
		//4 Feb. this.text('Disable');
		//4 Feb - not working console.log( 'button text => '  + status_text );
		console.log( '==>> ' + $('.container_policy1'.text));
		//console.log(' =+ attr: ' + $('.enable_btn2').attr.('text'));
		$('#b1').text('Disable');
		$('#b1').removeClass('btn-primary').addClass('btn-danger');
		///4 Feb. this.removeClass('btn-primary').addClass('btn-danger');
	});

	$('.enable_btn2').click(function() {
		console.log('Enable policy2 button was pressed');
	});	

	$('.container_policy1').each(function() {
		var status_val = $(this).text();
		console.log('.container_policy1 entered ...' + status_val);
		//4 Feb. if(status_val != -1) {
			// $('#svc_' + this.id).text('Stop');
			// $('#svc_' + this.id).removeClass('btn-primary').addClass('btn-danger');
		$('enable_btn1').text('Disable');
		$('enable_btn1').removeClass('btn-primary').addClass('btn-danger');
		//4 Feb. }
	});

	$('.checkboxpol1').click(function() {
		var status_val = (this).checked;  //will work now 
		console.log('Clicked on checkbox for policy 1 ... ' + status_val);
		if (this.checked) {			
			//9 Feb. var label_val = document.getElementById('policy1').value;
			var label_val = document.getElementById('pol1').text;
			console.log('checked checkboxpol1 for policy 1...'  + label_val);
			policy_arr[1] = label_val;
		} else {
			// remove from array  - not necessary because we do it in routes/index.js
		}
	});

	$('.checkboxpol2').click(function() {
		var status_val = (this).checked;  //will work now 
		console.log('Clicked on checkbox for policy 2 ... ' + status_val);
		if (this.checked) {			
			//9 Feb. var label_val = document.getElementById('policy1').value;
			var label_val = document.getElementById('pol2').text;
			console.log('checked checkboxpol2 for policy 2...'  + label_val);
			policy_arr[2] = label_val;
		} else {
			// remove from array  - not necessary because we do it in routes/index.js
		}
	});

	// $('.selectapplic_pol_btn').click(function() {
	// 	console.log('Select applicable policies button was pressed');
	// 	console.log(' data_arr = ' + data_arr);
	// 	$.get('/client', {service_id : 'some'}, function (data) {
	// 		console.log('create call');
	// 		location.reload();
	// 	});

	// });

});