const express = require('express')
const app = express()
const port = 3001
const axios = require('axios')

const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://after7203:after7203@cluster0.qpvsj7r.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
client.connect(err => {
  const collection = client.db("test").collection("devices");
//   const query = { title: 'Back to the Future' };
//     const movie = await collection.findOne(query);
//     console.log(movie);
  client.close();
});

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
})