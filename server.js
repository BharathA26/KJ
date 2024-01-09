const express = require('express');
const expressSession = require('express-session');
const { graphqlHTTP } = require('express-graphql');
const dotenv = require("dotenv");
const connectDB = require("./db.js");

dotenv.config();

const app = express();


// Session setup - Configure as needed
app.use(
  expressSession({
    secret: 'your_secret_key',
    resave: false,
    saveUninitialized: false,
    // Other session configurations...
  })
);

const port = process.env.PORT || 3000;

app.use(express.json());

connectDB();

const schema = require('./graphql/schema');
const root = require('./graphql/resolvers.js');

app.use(
  '/graphql',
  graphqlHTTP((req, res) => ({
    schema: schema,
    rootValue: root,
    context: { req }, // Pass the request object to the context
    graphiql: true,
  }))
);

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});