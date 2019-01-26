const express = require('express');
const graphqlHTTP = require('express-graphql');
const { buildSchema } = require('graphql');

const data = {
  users: [
    {
      age: 25,
      id: 1,
      name: 'Leslie Smith',
    },
    {
      age: 32,
      id: 2,
      name: 'Cory Jacobs',
    },
    {
      age: 54,
      id: 3,
      name: 'Sam Johnson',
    },
    {
      age: 22,
      id: 4,
      name: 'Chris Roberts',
    }
  ],
};

const schema = buildSchema(`
  input UserInput {
    age: Int
    name: String
  }
  type User {
    age: Int
    id: ID
    name: String
  }
  type Query {
    getUser(id: Int!): User
    getUsers(usersIds: [Int]!): [User]
    getWelcome: String
  }
  type Mutation {
    createUser(input: UserInput): User
  }
`);

const root = {
  createUser: (args) => {
    const { age, name } = args.input;
    const id = data.users.length + 1;
    data.users.push({ age, id, name });
    return data.users.find(user => user.id === id);
  },
  getUser: (args) => {
    const { id } = args;
    return data.users.find(user => user.id === id);
  },
  getUsers: (args) => {
    const { usersIds } = args;
    const foundUsers = data.users.filter(user => {
      return usersIds.some(id => id === user.id);
    });
    return foundUsers;
  },
  getWelcome: () => {
    return 'Welcome to GraphQL';
  },
};

const app = express();

// Create an Express route for /graphql
app.use('/graphql', graphqlHTTP({
  schema, // use our schema
  rootValue: root, // use our resolver(s)
  graphiql: true, // use GraphQL's built-in GUI
}));

app.listen(4000);

console.log('Running a GraphQL API Server at localhost:4000/graphql');
