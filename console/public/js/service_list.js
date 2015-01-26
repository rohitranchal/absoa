$( document ).ready(function() {

	//Mark started services
	$('.svc_data').each(function() {
		var status_val = $(this).text();
		if(status_val != -1) {
			$('#svc_' + this.id).text('Stop');
			$('#svc_' + this.id).removeClass('btn-primary').addClass('btn-danger');
		}
	});

	// Toggle service start/stop
	$('.btn').click(function() {
		var svc_id = this.id.toString();
		svc_id = svc_id.split('_');
		svc_id = svc_id[1];

		$.post('/toggle_service', {sid : svc_id}, function (data) {
			location.reload();
		});
	});
});