$( document ).ready(function() {

	var data_arr = [];

	/// READ DEFAULT VALUES FROM Service_Data table (which is in db.sql)	
	// for (var i = 0, limit = 5; i < limit; i++) {
	// 	var _keyID = 'datkey' + i;
	// 	var classkey = '.inputkey' + i;
	// 	// document.getElementById('datkey' + i).value = $('.inputkey' + i).attr('placeholder');
	// 	// document.getElementById('dataval' + i).value = $('.inputval' + i).attr('placeholder');
	// 	/// document.getElementById(_keyID).value = $(classkey).attr('placeholder');
	// }
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
	// $('.inputkey1').each(function() {
 //    	document.getElementById('datkey1').value = $(this).attr('placeholder');
 //    	console.log($(this).attr('placeholder'));
	// });


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

	$('.btn').click(function() {
		console.log('Generate AB button was pressed');
		console.log(' data_arr = ' + data_arr);
		$.post('/client', {service_id : 'some'}, function (data) {
			console.log('create call');
			location.reload();
		});

	});

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

	// $('.selectapplic_pol_btn').click(function() {
	// 	console.log('Select applicable policies button was pressed');
	// 	console.log(' data_arr = ' + data_arr);
	// 	$.get('/client', {service_id : 'some'}, function (data) {
	// 		console.log('create call');
	// 		location.reload();
	// 	});

	// });

});