const express = require('express');
const bodyParser = require('body-parser');

let {mongoose} = require('./db/mongoose');
let {Todo} = require('./models/todo');
let {User} = require('./models/user');
const {ObjectID} = require('mongodb');

let app = express();

app.use(bodyParser.json());

// POST /todos

app.post('/todos', (req, res)=>{
  let todo = new Todo({
    text: req.body.text
  });

  todo.save().then((doc)=>{
    res.send(doc);
  }, (e)=>{
    res.status(400).send(e);
  });
});

// GET /todos

app.get('/todos', (req, res)=>{
  Todo.find().then((todos)=>{
    res.send({
      todos
    });
  }, (e)=>{
    res.status(400).send(e);
  });
});

// GET /todos/:id

app.get('/todos/:id', (req, res)=>{
  let id = req.params.id;

  if(!ObjectID.isValid(id)){
    res.status(404).send();
  }

  Todo.findById(id).then((todo)=>{
    if(!todo){
    res.status(404).send();
    }

    res.send({todo});
  }).catch((e)=>{
    res.status(400).send();
  });
});

let port = process.env.PORT||3000;

app.listen(port, ()=>{
  console.log(`The server started on ${port}`);
});

module.exports = {app};
