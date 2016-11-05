//Function to set interval for requests, one every 300 milliseconds
var lastCall = 0
function timer() {
	var now = Date.now()
	if(now - lastCall > 300) {
		lastCall = now
		return true
	} else {
		lastCall = now
		return false
	}
}

function titleCase(string) {
    return string.charAt(0).toUpperCase() + string.slice(1)
}

$(document).ready( function() {
	$("#user").keyup(function() {
		if(timer()) { //If timer function is true, activate.
			console.log("I am true")
			if($("#user").val() == ""){
				$("#result").html(" ") //Empty the results
			} else {
				//Every input should sent a push request to the backend to compare with the database
				var inputData =	{
					input: titleCase($("#user").val())
				}
				var searchResult = []
				$.post("/ajaxsearch", inputData, function(res) {
					$("#result").html("")
					if(res.data.length === 0) {
						$("#result").html("User Not Found!")
					} else {
						for(var i = 0; i < res.data.length; i++) {
							$("#result").append(res.data[i].firstname + "\n" + res.data[i].lastname + ": " + res.data[i].email + "<br>")	
						}	
					}
				})
			}
		} else {console.log("I am false")}
	})
})
