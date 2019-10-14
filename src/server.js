require('dotenv').config();
const knex = require('knex');
const app = require('./app')

const port = process.env.PORT;

const db = knex({
  client: "pg", 
  connection: process.env.DB_URL
})

app.set('db', db);

app.listen(port, () => console.log(`Server is running on 'http://localhost/${port}'`));