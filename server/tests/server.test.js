const request = require('supertest');
const expect = require('expect');
        const {ObjectID} = require('mongodb');

const {app} = require('./../server');
const {Todo} = require('./../models/todo');

const todos = [{
    _id: new ObjectID,
    text: "This is todo One"
},
{
    _id: new ObjectID,
    text: "This is todo Two"
}]; 

beforeEach((done) => {
    Todo.remove({}).then (() => {
        return Todo.insertMany(todos); 
    }).then(() => done());
});

describe('POST /todos', () => {
    it("should create a new todo", (done) => {
        let text = "ToDo text";

        request(app)
            .post('/todos')
            .send({text})
            .expect(200)
            .expect((res) => {
                expect(res.body.text).toBe(text);
            })
            .end((err, res) => {
                if (err) {
                    return done(err);
                }

                Todo.find({text}).then((todos) => {
                    expect(todos.length).toBe(1);
                    expect(todos[0].text).toBe(text);
                    done();
                }). catch ((e) => { done(e)}); 
            });
    });

    it("should not create todo with invalid data", (done) => {

        request(app)
            .post('/todos')
            .send({})
            .expect(400)
            .end((err, req) => {
                if (err) {
                    return done(err);
                }

                Todo.find().then((todos) => {
                    expect(todos.length).toBe(2);
                    done();
                }).catch ((e) => done(e));
            })
    });
});

describe('GET /todos', () => {
    it("should return a list of existing todos", (done) => {

        request(app)
            .get('/todos')
            .expect(200)
            .expect((res) => {
                expect(res.body.todos.length).toBe(2);
            })
            .end(done);
    });
});

describe("GET /todos/:id", () => {
    it("should return one todo by provided id", (done) => {
        let hexId = todos[0]._id.toHexString();

        request(app)
            .get(`/todos/${hexId}`)
            .expect(200)
            .expect((res) => {
                console.log(res.body);
                expect(res.body.todo.text).toBe(todos[0].text);
            })
            .end(done);
    });


    it("should result in 404 for non-object id", (done) => {

        request(app)
            .get("/todos/123")
            .expect(404)
            .end(done);
    });


    // provide id that does not exist

    it("should return 404 for non existant id", (done) => {
        let hexId = (new ObjectID).toHexString();

        request(app)
            .get(`/todos/${hexId}`)
            .expect(404)
            .end(done);
    });
});

