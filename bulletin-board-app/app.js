'use strict'

const pg = require('pg')
const express = require('express')
const fs = require('fs')
const bodyParser = require('body-parser')

const app = express()

app.set('view engine', 'pug')
app.set('views', __dirname + '/views')
app.use(express.static('static'))

app.use(bodyParser.urlencoded({extended: true}))

app.get('/', (req, res) => {
	res.render('message')
})

let connectionString = 'postgres://' + process.env.POSTGRES_USER + ':' + process.env.POSTGRES_PASSWORD + '@localhost/bulletinboard';
let result = []

app.post('/', (req, res) => {
	let resultTitle = req.body.title
	let resultText = req.body.text
	pg.connect(connectionString, (err, client, done) => {
		if(err) {
			throw err
		}
		client.query('insert into messages (title, body) values ($1, $2)', [resultTitle, resultText], (err, result) => {
			if(err) {
				throw err
			}
			done()
		})
		client.query('select title, body from messages;', [], (err, result) => {
			if(err) {
				throw err
			}
			done()
			res.render('result', {data: result.rows})
			pg.end()
		})
	})
})

app.get('/result', (req, res) => {
	pg.connect(connectionString, (err, client, done) => {
		if(err) {
			throw err
		}
		client.query('select title, body from messages', [], (err, result) => {
			if(err) {
				throw err
			}
			done()
			res.render('result', {data: result.rows})
		})
	})
})

app.listen(8000, () => {
	console.log("Server running")
})
