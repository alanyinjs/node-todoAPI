const express = require('express');
const bodyParser = require('body-parser');

let {mongoose} = require('./db/mongoose');
let {Todo} = require('./models/todo');
let {User} = require('./models/user');

let app = express();

app.use(bodyParser.json());

app.post('/todos', (req, res)=>{
  let todo = new Todo({
    text: req.body.text
  });

  todo.save().then((doc)=>{
    res.send(doc);
  }, (e)=>{
    res.status(400).send(e);
  })
});

let port = process.env.PORT||3000;

app.listen(port, ()=>{
  console.log(`The server started on ${port}`);
});

module.exports = {app};
