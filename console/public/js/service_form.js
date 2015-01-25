$(document ).ready(function() {
	$('.update-service').click(function() {
		var sid = $("body p").text();
		var rating = document.getElementById('rating').value;
		var trust = document.getElementById('trust').value;			
		var elem = document.getElementById("req-data");
		var data = elem.options[elem.selectedIndex].value;
		$.post('/update_service',
		{
			sid		: sid,
			rating	: rating,
			trust	: trust,
			data	: data,
		}, function(data) {
			window.location.href = '/services';
		});
	});
});
