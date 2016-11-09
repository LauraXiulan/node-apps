//Import modules
const sequelize = require('sequelize')
const express = require('express')
const app = express()

let db = new sequelize('language', process.env.POSTGRES_USER, process.env.POSTGRES_PASSWORD, {
	server: 'localhost',
	dialect: 'postgres'
})

//Define database structure

//Define models
let User = db.define('user', {
	name: sequelize.STRING
})

let Fluent = db.define('fluent', {
	name: sequelize.STRING
})

let Learn = db.define('learn', {
	name: sequelize.STRING
})

//Define relations
User.hasMany(Fluent)
User.hasMany(Learn)

//Set express routes

app.get('/ping', (req, res) => {
	res.send('pong')
})

app.get('/fluent', (req, res) => {
	Fluent.findAll({
		attributes: ['name', 'userId']
	}).then(fluent => {
		res.send(fluent)
	})
})

app.get('/learn', (req, res) => {
	Learn.findAll({
		attributes: ['name', 'userId']
	}).then(learn => {
		res.send(learn)
	})
})

app.get('/users', (req, res) => {
	User.findAll({
		include: [{
			model: Fluent,
			attributes: ['name']
			},{
			model: Learn,
			attributes: ['name']
		}], attributes: ['name']
	}).then(users => {
		res.send(users)
	})
})

let user = 'Nathan'

app.get('/findmatch', (req, res) => {
	User.findAll({
		where: {
			name: user
		},
		attributes: ['id'],
		include: [ Learn, Fluent ]
	}).then(users => {
		let result = []
		for(let i = 0; i < users.length; i++) {
			for(let j = 0; j < users[i].learns.length; j++){
				result.push(users[i].learns[j].name)
			} return result
		}
	}).then(users => {
		Fluent.findAll({
			where: {
				name: users
			},
			attributes: ['userId']
		}).then(users => {
			let newResult = []
			for(let i = 0; i < users.length; i++) {
				newResult.push(users[i].userId)
			} return newResult
		}).then(users => {
			User.findAll({
				where: {
					id: users
				},
				attributes: ['name'],
				include: [{
					model: Fluent,
					attributes: ['name']
				}]
			}).then(users => {
				res.send(users)
			})
		})
	})
})

db.sync({force: true}).then(db => {
	console.log("Synced, yay!")
	User.create({
		name: 'Iris'
	}).then(user => {
		user.createFluent({
			name: 'English'
		})
		user.createFluent({
			name: 'Spanish'
		})
		user.createLearn({
			name: 'French'
		})
		user.createLearn({
			name: 'German'
		})
	})
	User.create({
		name: 'Finn'
	}).then(user => {
		user.createFluent({
			name: 'German'
		})
		user.createLearn({
			name: 'Spanish'
		})
	})
	User.create({
		name: 'Nathan'
	}).then(user => {
		user.createFluent({
			name: 'French'
		})
		user.createLearn({
			name: 'English'
		})
		user.createLearn({
			name: 'Spanish'
		})
	})
	User.create({
		name: 'Natasha'
	}).then(user => {
		user.createFluent({
			name: 'English'
		})
		user.createLearn({
			name: 'Mandarin'
		})
	})
})

app.listen(8000, () => {
	console.log("Server is running!")
})