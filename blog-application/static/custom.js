//Login page
$(document).ready(function () {
	$('#submit').click(function(event) {
		if($('#email').val().trim().length === 0 || $('#password').val().trim().length === 0) {
			event.preventDefault()
			$('#error-message').html("Your username or password is empty.")
		}
	})
})

//Comment page
$(document).ready(function () {
				$('#commentbtn').click(function (event) {
					var comment = {
						input: $('#commentbtn').val(),
						id: $('#postId').val()
					}
				})
			})