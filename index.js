const express = require('express')
const app = express()
const port = 3001
const cors = require('cors');
const bodyParser = require('body-parser')

const mongodb = require("mongodb");
const mongoose = require('mongoose');
const {mongoURI} = require("./config/key");
mongoose.connect(mongoURI, {dbName: 'develog'}).then(console.log(mongoURI))

app.use(cors())
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use('/api/users', require('./routes/users'));

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  //console.log("server on")
})