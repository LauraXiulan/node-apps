'use strict'

const express = require('express')
const fs = require('fs')
const bodyParser = require('body-parser')

const app = express()

app.set('view engine', 'pug')
app.set('views', __dirname + '/views')
app.use(express.static('static'))

app.get('/index', (req, res) => {
	response.send('Page opened')
})


//Show user list
app.get('/', (req, res) => {
	fs.readFile(__dirname + '/users.json', (err, data) => {
		if(err) throw err
		let parsedData = JSON.parse(data)
		res.render('index', {data: parsedData})
	})
})



//Search users
app.get('/search', (req, res) => {
	res.render('search')
})

app.post('/ajaxsearch', bodyParser.urlencoded({extended: true}), (req, res) => {
	let input = req.body.input
	fs.readFile(__dirname + '/users.json', (err, data) => {
		if(err) throw err
		let result = []
		let parsedData = JSON.parse(data)
		for(let i = 0; i < parsedData.length; i++) {
			let firstname = parsedData[i].firstname
			let lastname = parsedData[i].lastname
			if(firstname.indexOf(input) == 0 || lastname.indexOf(input) == 0) {
				//To search on all letters: if(firstname.indexOf(input) > -1) {
				result.push(parsedData[i])		
			}	
		} 
		res.send({data: result})
	})
})

app.use(bodyParser.urlencoded({extended: false}))

function titleCase(string) {
	return string.charAt(0).toUpperCase() + string.slice(1)
}

app.post('/search', (req, res) => {
	let userSearch = titleCase(req.body.search)
	fs.readFile(__dirname + '/users.json', (err, data) => {
		if(err) throw err
		let user = []
		let parsedData = JSON.parse(data)
		for(let i = 0; i < parsedData.length; i++) {
			if(parsedData[i].firstname.indexOf(userSearch) == 0 || parsedData[i].lastname.indexOf(userSearch) == 0) {
			user.push(parsedData[i])
			}
		} res.render('result', {user: user})	
	})	
})


//Add users form
app.get('/add', (req, res) => {
	res.render('add-user')
})

app.post('/add', (req, res) => {
	let newUser = {
		firstname: req.body.firstname,
		lastname: req.body.lastname,
		email: req.body.email
	}
	fs.readFile(__dirname + '/users.json', (err, data) => {
		if(err) throw err
		let parsedData = JSON.parse(data)
		parsedData.push(newUser)	
		fs.writeFile(__dirname + '/users.json', JSON.stringify(parsedData, null, "\t"), (err) => {
			if(err) throw err
			res.redirect('/')
		})
		
	}) 
	
})

app.listen(8000, () => {
	console.log('Server running')
})