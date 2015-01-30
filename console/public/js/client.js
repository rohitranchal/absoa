$( document ).ready(function() {

	var data_arr = [];
	//handle clicks on 3 checkboxes at localhost:3000/client 
	$('.checkbox1').click(function() {
		//var svc_id = this.id.toString();
		var temp = 1;
		// var status_val = $(this).checked; -Why undefined? It should contain the state 
												//of checkbox: checked/not checked
		
		//var status_val = $(this).value; - undefined
		//var status_val = $(this).checked.value;  //-type error
		var status_val = $(this).checked;  //- undefined message, no error  OK
		
		//var status_val = $(this).not(':checked');  //[object Object]

		//svc_id = svc_id.split('_');
		//svc_id = svc_id[1];
		//console.log('Clicked on checkbox: ' + req.body.checkbox1.Clicked );

		console.log('Clicked on checkbox1 ... ' + status_val);
		//console.log('Clicked on checkbox: ' + checkbox1.Clicked ); - ERROR, not defined
		//console.log('Clicked on checkbox: ' + checkbox11.Clicked ); -ERROR, not defined

	});

	$('.checkbox2').click(function() {
		var status_val = $(this).value;  //-undefined
		console.log('Clicked on checkbox2 ... ' + status_val);
		if (this.checked) {			
			var textbox_val = document.getElementById('dataval2').value;
			var textbox_key = document.getElementById('dataval2').value;
			console.log('checked checkbox2...' + textbox_val);
			data_arr[textbox_key] = textbox_val;
		} else {
			// remove from array
		}
	});

	$('.checkbox3').click(function() {
		var status_val = $(this).value;  //-undefined
		console.log('Clicked on checkbox3 ... ' + status_val);
	});


	onsubmitbuttonclick() {


		$.post('/update_service',
		{
			data		: data_arr,
		}, function(data) {
			window.location.href = '/create';
		});

	}
});