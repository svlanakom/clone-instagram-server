const express = require('express');

const mongoose = require('mongoose');
const bodyParser = require("body-parser");
const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users')
const cors = require("cors");

dbConnect().catch(err => console.log(err));

async function dbConnect() {
  // await mongoose.connect('mongodb://localhost:27017');
  await mongoose.connect('mongodb+srv://admin:admin@cluster0.bt4l5nz.mongodb.net/?retryWrites=true&w=majority');
}

require('./auth/auth');

const app = express();
const port = normalizePort(process.env.PORT || '3003');
app.use(bodyParser.json());
app.use(cors());

app.use('/images', express.static('images'))

app.use('/', indexRouter);
app.use('/users', usersRouter);

app.set('port', port);

app.listen(port, () => {
  console.log(`Exsample app listening on port ${port}`)
});

function normalizePort(val) {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    return val;
  }

  if (port >= 0) {
    return port;
  }

  return false;
}