$(document).ready(function() {
	$('.chat_icon').click(function() {
		$('.wrapper').toggleClass('show');
	});

	$('.my-conv-form-wrapper').convform({selectInputStyle: 'disable'})
});
