var fs = require('fs')
var country = require(__dirname + '/json-file-reader')

var name = process.argv[2]
country(__dirname + '/countries.json', function(jsonData) {  //To call the callback.
	for(var i = 0; i<jsonData.length; i++) {
		if(name == jsonData[i].name) {
			console.log("Country: " + jsonData[i].name)
			console.log("Top Level Domain: " + jsonData[i].topLevelDomain)
		}
	}
})
