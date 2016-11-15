//Comment page
$(document).ready(function () {
	$('#commentbtn').click(function (event) {
		var comment = {
			input: $('#commentbtn').val(),
			id: $('#postId').val()
		}
	})
})

// $('#name').onclick(function() {

// })

function validate() {    
	var text_value = document.getElementById("name").value;
   	if (!text_value.match(/^[a-zA-Z].*/)) {
       document.getElementById("name").value=""
       alert("Please start your name with an alphabetic.")
    } 
}