const request = require('supertest');
const expect = require('expect');
        const {ObjectID} = require('mongodb');

const {app} = require('./../server');
const {Todo} = require('./../models/todo');

const todos = [{
    _id: new ObjectID,
    text: "This is todo One",
    completed: true
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

    it("should return 404 for non existant id", (done) => {
        let hexId = (new ObjectID).toHexString();

        request(app)
            .get(`/todos/${hexId}`)
            .expect(404)
            .end(done);
    });
});

describe("DELETE /todos/:id", () => {
    it("should delete a todo by id", (done) => {
        let hexId = todos[1]._id.toHexString();

        request(app)
            .delete(`/todos/${hexId}`)
            .expect(200)
            .expect((res) => {
                expect(res.body.todo._id).toBe(hexId);
            })
            .end((err, res) => {
                if (err) {
                    return done(err);
                }

                Todo.findById(hexId).then((todo) => {
                    expect(todo).not.toBeTruthy();
                    done();
                }).catch ((e) => done(e));
            })
    });

    it("should get status 400 if invalid id was provided", (done) => {

        request(app)
            .delete("/todos/123")
            .expect(400)
            .end(done);
    });

    it("should get status 404 if non-existant id was provided", (done) => {

        request(app)
            .delete(`/todos/${(new ObjectID).toHexString()}`)
            .expect(404)
            .end(done);
    });
});

describe("PATCH /todos/:id", () => {
    it("should update a todo", (done) => {
        let hexId = todos[0]._id.toHexString();
        let text = "Test PATCH route";

        request(app)
            .patch(`/todos/${hexId}`)
            .send({
                text,
                completed: true
            })
            .expect(200)
            .expect((res) => {
                expect(res.body.todo.text).toBe(text);
                expect(res.body.todo.completed).toBe(true);
                expect(typeof res.body.todo.completedAt).toBe('number');
            })
            .end(done);
    });

    it("should clear completedAt if the todo is not completed", (done) => {
        let hexId = todos[0]._id.toHexString();
        let text = "New text todo";

        request(app)
            .patch(`/todos/${hexId}`)
            .send({
                text,
                completed: false
            })
            .expect(200)
            .expect((res) => {
                expect(res.body.todo.text).toBe(text);
                expect(res.body.todo.completed).toBe(false);
                expect(res.body.todo.completedAt).not.toBeTruthy();
            })
            .end(done);
    });
});

