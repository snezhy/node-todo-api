const express = require('express');
const bodyParser = require('body-parser');

const {mongoose} = require('./db/mongoose');
let {Todo} = require('./models/todo');
let {User} = require('./models/user'); 

let app = express();
app.use(bodyParser.json())

app.post('/todos', (req, res) => {
    let todo = new Todo({
        text: req.body.text
    });

    todo.save().then((doc) => {
        res.send(doc);
    }, (e) => {
        res.status(400).send(e);
    })
});


/**  GET /users route 
 *   define route
 *  get all todos
 *  send to response if routes found
 *  otherwise send message no routes found
*/

app.get('/todos', (req, res) => {

    Todo.find().then((todos) => {
        res.send({todos});
    }, (e) => {
        res.status(400).send(e);
    });
});

app.listen(3000, () => {
    console.log("App started on port 3000");
});

module.exports = { app };