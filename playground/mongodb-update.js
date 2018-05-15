// const MongoClient = require('mongodb').MongoClient;

const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, client)=>{
  if (err) {
    return console.log('Unable to connect to MongoDB server.');
  }
  console.log('Connected to MongoDB server.');
  const db = client.db('TodoApp');

  // db.collection('Todos').findOneAndUpdate({
  //   _id: new ObjectID('5afa6d23ba1b344e71cb4abd')
  // }, {
  //   $set: {
  //     completed: true
  //   }
  // }, {
  //   returnOriginal: false
  // }).then((result)=>{
  //   console.log(result);
  // });

  db.collection('Users').findOneAndUpdate({
    _id: new ObjectID('5afa5762c1ef1c21a7ef6d07')
  },{
    $set: {
      name: "Sissy Zhou"
    },
    $inc:{
      age: -1
    }
  }, {
    returnOriginal: false
  }).then((result)=>{
    console.log(result);
  });

  client.close();
});
