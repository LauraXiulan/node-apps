//Import modules
'use strict'
const sequelize = require('sequelize')
const express = require('express')
const bodyParser = require('body-parser')
const session = require('express-session')
const app = express()

let db = new sequelize('blog', process.env.POSTGRES_USER, process.env.POSTGRES_PASSWORD, {
	server: 'localhost',
	dialect: 'postgres'
})

app.set('view engine', 'pug')
app.set('views', __dirname + '/views')
app.use(express.static('static'))

app.use(bodyParser.urlencoded({extended: true}))

app.use(session({
	secret: 'This is secret',
	resave: true,
	saveUninitialized: false
}))

//Define database structure

//Define models

let User = db.define('user', {
	name: sequelize.STRING,
	email: sequelize.STRING,
	password: sequelize.STRING
})

let Post = db.define('post', {
	title: sequelize.STRING,
	body: sequelize.STRING
})

let Comment = db.define('comment', {
	title: sequelize.STRING,
	body: sequelize.STRING
})

//Define relations
User.hasMany(Post)
User.hasMany(Comment)
Post.hasMany(Comment)

//Set express routes
app.get('/ping', (req, res) => {
	res.send('Pong')
})

//Homepage
// app.get('/', (req, res) => {
// 	res.send('Welcome!')
// })

app.get('/', (req, res) => {
	res.render('index', {
		message: req.query.message,
		user: req.session.user
	})
})

//Login page
app.get('/login', (req, res) => {
	res.send('Login here!')
})

app.post('/login', bodyParser.urlencoded({extended: true}), (req, res) => {
	if(req.body.email.length === 0) {
		res.redirect('/?message=' + encodeURIComponent("Please fill out your emailadress."))
		return
	}
	if(req.body.password.length === 0) {
		res.redirect('/?message=' + encodeURIComponent("Please fill out your password."))
		return
	}
	User.findOne({
		where: {
			email: req.body.email
		}
	}).then((user) => {
		if(user !== null && req.body.password === user.password) {
			req.session.user = user
			res.redirect('/profile')
		}
		else {
			res.redirect('/?message=' + encodeURIComponent("Invalid email or password."))
		}
	}, (err) => {
		res.redirect('/?message=' + encodeURIComponent("Invalid email or password."))
	})
})

//Profile
app.get('/profile', (req, res) => {
	let user = req.session.user
	if(user === undefined) {
		res.redirect('/?message=' + encodeURIComponent("Please log in to view your profile."))
	}
	else {
		res.render('profile', {
			user: user
		})
	}
})

//Create new user
app.get('/createuser', (req, res) => {
	res.render('createuser')
})

app.post('/createuser', (req, res) => {
	let userName = req.body.name
	let email = req.body.email
	let pw = req.body.password
	User.create({
		name: userName,
		email: email,
		password: pw
	})
	res.send('Succesfully created profile!')	
})

//Create post
app.get('/createpost', (req, res) => {
	res.render('createpost')
})

app.post('/createpost', (req, res) => {
	let resultTitle = req.body.title
	let resultText = req.body.text
	Post.create({
		title: resultTitle,
		body: resultText
	})
	res.send('Post successfully created!')
})

//See all user posts
app.get('/posts', (req, res) => {
	res.send('Here are all your posts.')
})

//See all posts
app.get('/allposts', (req, res) => {
	Post.findAll({
		include: [Comment]
	}).then(posts => {
		res.render('allposts', {post: posts}) //Find out how to add the comments to the page...!
	})
})

//Logout page
// app.get('/logout', (req, res) => {
// 	res.send('You are successfully logged out!')
// })

app.get('/logout', (req, res) => {
	req.session.destroy((err) => {
		if(err) {
			throw err
		}
		res.redirect('/?message=' + encodeURIComponent("Successfully logged out."))
	})
})
//Sync with database

db.sync({force: true}).then(db => {
	console.log("Synced, yay!")
	User.create({
		name: 'Laura',
		email: 'blabla@bla',
		password: 'banana'
	})
})

//Listen

app.listen(8000, () => {
	console.log("Server is running!")
})