$(document).ready(function(){
 $('#fileselectbutton').click(function(e){
	$('#file').trigger('click');
 });
 $('#file').change(function(e){
	var val = $(this).val();
	var file = val.split(/[\\/]/);
	$('#filename').val(file[file.length-1]);
 });
});