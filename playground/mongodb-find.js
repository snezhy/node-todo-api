//const MongoClient = require('mongodb').MongoClient;
const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost://27017', { useNewUrlParser: true }, (err, client) => {
    if (err) {
        return console.log('Undable to connect to MongoDB server');
    }

    let db = client.db('TodoApp');
    console.log('Connected to MongoDB server');
    
    //  db.collection('Todos').find({
    //      '_id' : new ObjectID('5be6a07753b3af9c704f171a')
    //     }).toArray().then((docs) => {
    //     console.log('Todos');
    //     console.log(JSON.stringify(docs, undefined, 2));
    // }, (err) => {
    //     console.log('Unable to fetch todos', err);
    // });

//     db.collection('Todos').find().count().then((count) => {
//        console.log(`Todos Count ${count}`);
//    }, (err) => {
//        console.log('Unable to fetch todos', err);
//    });

    db.collection('Users').find({name: 'Snezhana'}).count().then((count) => {
        console.log(`Users count ${count}`);
       // console.log(JSON.stringify(users, undefined, 2));
    }, (err) => {
        console.log('Unable to fetch users', err);
    })
   // client.close();
});