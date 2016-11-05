var fs = require('fs')

function readFile(filename, callback) {
	fs.readFile(filename, 'utf-8', function(err, data) {
		if(err) {
			throw err
		} 
		var jsonData = JSON.parse(data)
		callback(jsonData)
	})
}

module.exports = readFile

