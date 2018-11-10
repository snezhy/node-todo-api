//const MongoClient = require('mongodb').MongoClient;
const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost://27017', { useNewUrlParser: true }, (err, client) => {
    if (err) {
        return console.log('Undable to connect to MongoDB server');
    }

    let db = client.db('TodoApp');
    console.log('Connected to MongoDB server');

    // db.collection('Todos').insertOne({
    //     text: 'Insert something into the db',
    //     completed: false
    // }, (err, result) => {
    //     if (err) {
    //         return console.log('Unable to insert to do ', err);
    //     }
    //     console.log(JSON.stringify(result.ops, undefined, 2));
    // })

    // db.collection('Users').insertOne({
    //     name: 'Snezhana',
    //     age: 30,
    //     location: 'London'
    // }, (err, result) => {
    //     if (err) {
    //         return console.log('Unable to insert to db', err);
    //     }

    //     console.log(JSON.stringify(result.ops[0]._id.getTimestamp(), undefined, 2));
    // })
    client.close();
});