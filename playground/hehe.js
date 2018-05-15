MongoClient = require('mongodb').MongoClient

MongoClient.connect('mongodb://localhost:27017', (err, client)=>{
  if(err){
    return console.log('error');
  }
  let db = client.db('TodoApp');

  // db.collection('Todos').insertOne({
  //   text:'something to do',
  //   completed: false
  // }, (err, result)=>{
  //   if(err){
  //     return console.log('Unable to insert todo', err);
  //   }
  //   console.log(JSON.stringify(result.ops, undefined, 2));
  // });

  db.collection('Users').insertOne({
    name:'Alan Yin',
    age: 29,
    location:'Brisbane'
  }, (err, result)=>{
    if (err){
      console.log('Unable to insert user', err);
    }
    console.log(JSON.stringify(result.ops, undefined, 2));
  });
  client.close();
});
