const {ApolloServer, gql} = require('apollo-server');

const typeDefs = gql `
 type Query {
     hello: String!
     user: User
 }

 type Mutation {
     register(userInfo: UserInfo!): RegisterResponse
 }

 type RegisterResponse {
     user: User
     errors: [Error]
 }

 type Error {
     field: String!
     message: String!
 }

 input UserInfo {
     username: String,
     password: String
 }

 type User {
     id: ID!
     name: String!
 }
`;

const resolvers = {
    Query: {
        hello: () => "Shut up bitch!",
        user: () => ({
            id: 1,
            name: "Ben"
        })
    },
    Mutation: {
        register: () => ({
            user: {
                id: 1,
                name: "John"
            },
            errors: [
                {
                    field: "name",
                    message: "randome message lol"
                }
            ]
        })
    }
}

const server = new ApolloServer({typeDefs, resolvers});

server.listen().then(({url}) => console.log(`Server started at ${url}`));