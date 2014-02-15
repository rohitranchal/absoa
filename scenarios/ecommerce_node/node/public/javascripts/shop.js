$(document).ready(function(){
	var spinner = $("[id^=spinner]").spinner({editable:false,width:1,min:0,max:10,stop:function(){
		if(this.value==0){
			var id = this.id.substr(7);
			$("#spinner" + id).hide();
			$("#buy" + id).show();
		}
	}
	});
	$("[id^=spinner]").width(20);
	$( "[id^=spinner]" ).hide();
	
	$("[id^=buy]").click(function(){
		var id = this.id.substr(3);
		$("#spinner" + id).show();
		$("#spinner" + id).spinner("value",1)
		$("#buy" + id).hide();
	});


});
