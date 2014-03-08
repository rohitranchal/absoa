$(document).ready(function(){
	/*$(".hoverDiv").hover(function(){
		$(this).animate({height:"+=30px"});
	});
	*/
	$("[class=shopbtn]").hide();
	$(".hoverDiv").mouseenter(function(){
		$(this).animate({height:"+=50px"});
		var id = $(this).attr('id');
		id = id.substr(4);
		 var fix = '#shopbtn_' + id;
		$("#shopbtn_").val("'"+fix+"'");
		$(fix).show("slow");
	});
	$(".hoverDiv").mouseleave(function(){
		$(this).animate({height:"-=50px"});
		var id = $(this).attr('id');
		id = id.substr(4);
		 var fix = '#shopbtn_' + id;
		$("#shopbtn_").val("'"+fix+"'");
		$(fix).hide();
	});
});
