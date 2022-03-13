const express = require('express')
const bodyParser = require("body-parser")
const mysql = require('mysql')
const app = express()

const port = process.env.PORT || 5000
app.listen(port)
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

//MYSQL

const pool = mysql.createPool({
    connectionLimit: 10,
    host: 'localhost',
    user: 'root',
    password: "",
    database: "yocket"
});

// Get all post
app.get('', (req, res) => {
    pool.getConnection((err, connection) => {
        if (err) throw err

        console.log(`connected as id ${ connection.threadId }`)
        connection.query(`SELECT distinct * from posts order by created_at asc limit ${req.query.limit}` , (err, rows) => {
            connection.release();

            if (!err) {
                res.send(rows)
            } else {
                console.log(err);
            }
        })
    })
})

// Get specific post
app.get('/:id', (req, res) => {
    pool.getConnection((err, connection) => {
        if (err) throw err

        console.log(`connected as id ${ connection.threadId }`)
        connection.query('SELECT * from posts where id = ?', [req.params.id], (err, rows) => {
            connection.release();

            if (!err) {
                res.send(rows)
            } else {
                console.log(err);
            }
        })
    })
})

// delete a post
app.delete('/:id', (req, res) => {
    pool.getConnection((err, connection) => {
        if (err) throw err

        console.log(`connected as id ${ connection.threadId }`)
        connection.query('delete from posts where id = ?', [req.params.id], (err, rows) => {
            connection.release();

            if (!err) {
                res.send(`Post with record ID : ${req.params.id} has been removed `)
            } else {
                console.log(err);
            }
        })
    })
})

// add post
app.post('', (req, res) => {
    pool.getConnection((err, connection) => {
        if (err) throw err
        const params = req.body;
        console.log(`connected as id ${ connection.threadId }`)
        connection.query('insert into posts set ?', params, (err, rows) => {
            connection.release();

            if (!err) {
                res.send(`Post with record title : "${params.title}" has been added `)
            } else {
                console.log(err);
            }
        })

    })
})

// update post
app.put('', (req, res) => {
    pool.getConnection((err, connection) => {
        if (err) throw err
        const {id, title, content} = req.body
        console.log(`connected as id ${ connection.threadId }`)
        connection.query('update posts set title = ?, content = ? where id = ?', [title, content, id], (err, rows) => {
            connection.release();

            if (!err) {
                res.send(`Post with title : "${title}" has been updated `)
            } else {
                console.log(err);
            }
        })

    })
})