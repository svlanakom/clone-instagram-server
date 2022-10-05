const express = require('express');

const mongoose = require('mongoose');
const bodyParser = require("body-parser");
const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users')
const cors = require("cors");



dbConnect().catch(err => console.log(err));

async function dbConnect() {
  await mongoose.connect('mongodb+srv://admin:admin@cluster0.ndsjr.mongodb.net/?retryWrites=true&w=majority');
}

require('./auth/auth');

const app = express();
const port = 3003
app.use(bodyParser.json());
app.use(cors());

app.use('/images', express.static('images'))

app.use('/', indexRouter);
app.use('/users', usersRouter);

app.listen(port, () => {
  console.log(`Exsample app listening on port ${port}`)
});
