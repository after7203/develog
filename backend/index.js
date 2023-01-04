const express = require('express')
const app = express()
const port = 3001
const cors = require('cors');
const bodyParser = require('body-parser')

const mongodb = require("mongodb");
const mongoose = require('mongoose');
const uri = "mongodb+srv://after7203:after7203@cluster0.qpvsj7r.mongodb.net/?retryWrites=true&w=majority";
mongoose.connect(uri, {dbName: 'develog'}).then(console.log("mongodb connected"))

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