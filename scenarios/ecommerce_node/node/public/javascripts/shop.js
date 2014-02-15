$(document).ready(function(){
	var spinner = $("[id^=spinner]").spinner({min:0,max:10,stop:function(){
		if(this.value==0){
			var id = this.id.substr(7);
			$("#spinner" + id).hide();
			$("#buy" + id).show();
		}
	}
	});
	$( "[id^=spinner]" ).hide();
	
	$("[id^=buy]").click(function(){
		var id = this.id.substr(3);
		$("#spinner" + id).show();
		$("#buy" + id).hide();
	});


});
