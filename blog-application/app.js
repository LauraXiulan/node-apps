//Import modules
const sequelize = require('sequelize')
const express = require('express')
const app = express()

let db = new sequelize('blog', process.env.POSTGRES_USER, process.env.POSTGRES_PASSWORD, {
	server: 'localhost',
	dialect: 'postgres'
})

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

app.get('/', (req, res) => {
	res.send('Welcome!')
})

app.get('/login', (req, res) => {
	res.send('Login here!')
})

app.get('/createuser', (req, res) => {
	res.send('Create a new account.')
})

app.get('/posts', (req, res) => {
	res.send('Here are all your posts.')
})

app.get('/allposts', (req, res) => {
	res.send('See all the posts.')
})

app.get('/logout', (req, res) => {
	res.send('You are successfully logged out!')
})

//Sync with database

db.sync({force: true}).then(db => {
	console.log("Synced, yay!")
})

//Listen

app.listen(8000, () => {
	console.log("Server is running!")
})