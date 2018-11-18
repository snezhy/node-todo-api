const express = require('express');
const bodyParser = require('body-parser');
const {ObjectID} = require('mongodb');

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


app.get('/todos', (req, res) => {

    Todo.find().then((todos) => {
        res.send({todos});
    }, (e) => {
        res.status(400).send(e);
    });
});

 
/** 1. define get route /todos/:id
    2. add ids to const todos
    3. find by id - provide one of the ids of const todos
    4. send to res */

app.get('/todos/:id', (req, res) => {
    let id = req.params.id;

    if (!ObjectID.isValid(id)) {
        return res.status(404).send();
    }
   
    Todo.findById(id).then((todo) => {
        if (!todo) {
            return res.status(404).send();
        }

        res.send({todo});
    }).catch ((e) => {
        res.status(400).send(e);
    });
});




app.listen(3000, () => {
    console.log("App started on port 3000");
});

module.exports = { app };