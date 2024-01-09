const { buildSchema } = require('graphql');

module.exports = buildSchema(`
  type User {
    id: ID!
    username: String!
    email_id: String!
  }

  type Query {
    user(id: ID!): User
  }

  type Mutation {
    createUser(username: String!, password: String!,email_id: String!): User!
    login(username: String!, password: String!): User!
  }
`);
