const express = require('express')
const app = express()
const port = 3001
const cors = require('cors');
const bodyParser = require('body-parser')
const mongodb = require("mongodb");
const mongoose = require('mongoose');
mongoose.set('strictQuery', true)
require("dotenv").config()
mongoose.connect(process.env.MONGO_URI, { dbName: 'develog' }).then("mongodb connect")

app.use(cors(
  // {
  //   origin: true, // 출처 허용 옵션
  //   credential: true // 사용자 인증이 필요한 리소스(쿠키 ..등) 접근
  // }
));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use('/api/users', require('./routes/users'));
app.use('/api/board', require('./routes/board'));
app.use('/api/reply', require('./routes/reply'));
app.use('/public', express.static('public'));

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log("server on")
})