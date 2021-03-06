const mongoose = require('mongoose');
require('dotenv').config()


const uri = process.env.MONGO_DB_URI || "mongodb://localhost:27017/covid-slayer-db"

mongoose.connect(uri, {useNewUrlParser: true, useUnifiedTopology: true});
mongoose.set('useCreateIndex', true);
mongoose.set('useFindAndModify', false);

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log("Database is connected")
});

