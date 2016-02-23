$(function() {

  $('select').change(function(){
    var url = $(this).val();
		console.log(url);
		// redirect to url
    window.location = url;
	});

})
