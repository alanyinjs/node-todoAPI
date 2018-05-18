const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb');

const {app} = require('./../server');
const {Todo} = require('./../models/todo');

const todos = [{
  _id: new ObjectID(),
  text:"First test todo"
},{
  _id: new ObjectID(),
  text:"Second test todo",
  completed: true,
  completedAt:12342043
},{
  _id: new ObjectID(),
  text:"Third test todo"
}];


beforeEach((done) => {
  Todo.remove({}).then(() => {
    return Todo.insertMany(todos);
  }).then(()=>done());
});

describe('POST /todos', ()=>{
  it('should create a new todo', (done)=>{
    let text = 'Test todo text';
    request(app)
      .post('/todos')
      .send({text})
      .expect(200)
      .expect((res)=>{
        expect(res.body.text).toBe(text);
      })
      .end((err, res)=>{
        if(err){
          return done(err);
        }

        Todo.find({text}).then((todos)=>{
          expect(todos.length).toBe(1);
          expect(todos[0].text).toBe(text);
          done();
        }).catch((e)=> done(e));
      });
  });

  it ('should not create todo with invalid body data', (done)=>{
    request(app)
      .post('/todos')
      .send({})
      .expect(400)
      .end((err, res)=>{
        if(err){
          return done(err);
        }

        Todo.find().then((todos)=>{
          expect(todos.length).toBe(3);
          done();
        }).catch((e)=>done(e));
      });
  });
});


describe('GET /todos',()=>{
  it('should fetch all todos', (done)=>{
    request(app)
      .get('/todos')
      .expect(200)
      .expect((res) => {
        expect(res.body.todos.length).toBe(3);
      })
      .end(done);
  })
});


describe('GET /todos/:id', ()=>{
  it('should return todo doc', (done)=>{
    request(app)
      .get(`/todos/${todos[0]._id.toHexString()}`)
      .expect(200)
      .expect((res)=>{
        expect(res.body.todo.text).toBe(todos[0].text);
      })
      .end(done);
  });

  it('should return 404 if todo is not found', (done)=>{
    let hexId = new ObjectID().toHexString();

    request(app)
      .get(`/todos/${hexId}`)
      .expect(404)
      .end(done);
  });

  it('should return 404 for non-object ids', (done)=>{
    request(app)
      .get('/todos/123')
      .expect(404)
      .end(done);
  });
});

describe('DELETE /todos/:id', ()=>{
  it ("should delete a todo", (done)=>{
    let hexId = todos[0]._id.toHexString();

    request(app)
      .delete(`/todos/${hexId}`)
      .expect(200)
      .expect((res)=>{
        expect(res.body.todo.text).toBe(todos[0].text);
      })
      .end((err, res)=>{
        if(err){
          return done(err);
        }
        Todo.findById(hexId).then((todo)=>{
          expect(todo).toNotExist();
          done();
        }).catch((e)=>done(e));
      })

  });

  it ("should return 404 if todo not found", (done)=>{
    let hexId = new ObjectID().toHexString();

    request(app)
      .delete(`/todos/${hexId}`)
      .expect(404)
      .end(done);
  });

  it ("should return 404 if objec id is invalid", (done)=>{
    request(app)
      .delete('/todos/123')
      .expect(404)
      .end(done);
  });
});

describe('PATCH /todos/:id', ()=>{
  it ('should update the todo', (done)=>{
    let hexId = todos[0]._id.toHexString();
    let text = 'Updated text from test';

    request(app)
      .patch(`/todos/${hexId}`)
      .send({
        text,
        completed: true
      })
      .expect(200)
      .expect((res)=>{
        expect(res.body.todo.text).toBe(text);
        expect(res.body.todo.completed).toBe(true);
        expect(res.body.todo.completedAt).toBeA('number');
      })
      .end((err, res)=>{
        if(err){
          return done(err);
        }

        Todo.findById(hexId).then((todo)=>{
          expect(todo.text).toBe(text);
          expect(todo.completed).toBe(true);
          expect(todo.completedAt).toBeA('number');
          done();
        }).catch((e)=>done(e));
      })
  });

  it ('should clear completedAt when todo is not copleted', (done)=>{
    let hexId = todos[1]._id.toHexString();
    let text = 'Updated text from test';

    request(app)
      .patch(`/todos/${hexId}`)
      .send({
        text,
        completed: false
      })
      .expect(200)
      .expect((res)=>{
        expect(res.body.todo.text).toBe(text);
        expect(res.body.todo.completed).toBe(false);
        expect(res.body.todo.completedAt).toNotExist();
      })
      .end((err, res)=>{
        if(err){
          return done(err);
        }

        Todo.findById(hexId).then((todo)=>{
          expect(todo.text).toBe(text);
          expect(todo.completed).toBe(false);
          expect(todo.completedAt).toNotExist();
          done();
        }).catch((e)=>done(e));
      })

  });
});
