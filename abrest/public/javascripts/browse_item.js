$(document).ready(function(){
	 var spinner = $( "#spinner" ).spinner({editable:false,max:10,min:1,stop:function(){
		 var price = $("#price").text();
		 var num =  this.value;
		 $("#item_sum").html(price*num);
		 $("#sum").html(price*num+10);

	 }
	 });
	 $("#spinner").width(20);
});
