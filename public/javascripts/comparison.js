$(document).ready(toggleOff);

function toggleOn(){
	$('.spinner').toggleClass('fa-spinner');
	$('.loading').html('Loading');
}
function toggleOff(){
	$('.spinner').toggleClass('fa-spinner');
	$('.loading').html('');
}