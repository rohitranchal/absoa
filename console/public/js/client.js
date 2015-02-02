$( document ).ready(function() {

	var data_arr = [];
	//handle clicks on 3 checkboxes at localhost:3000/client 
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
		//01 Feb. console.log('Clicked on checkbox3 ... ' + status_val);
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


	$('.btn').click(function() {
		console.log('Generate AB button was pressed');
		console.log(' data_arr = ' + data_arr);

		// $.post('/create', 
		// {
		// 	ab_data		: 'ab',
		// }, function(data) {
		// 	//location.reload();
		// 	// window.location.href = '/create';
		// });
		//31 Jan $.post('/create', {service_id : 'some'}, function (data) {
		$.post('/client', {service_id : 'some'}, function (data) {
			console.log('create call');
			location.reload();
		});

	});

	/* 
	onsubmitbuttonclick() {


		$.post('/create',
		{
			data		: data_arr,
		}, function(data) {
			window.location.href = '/create';
		});

	}  
	*/

});