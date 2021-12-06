const {ApolloServer, gql, PubSub} = require('apollo-server');

const typeDefs = gql `

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
     username: String!
     firstLetterUsername: String
     usernameID: String
 }

 type Query {
     hello(name: String): String!
     user: User
 }

 type Mutation {
     register(userInfo: UserInfo!): RegisterResponse
     login(userInfo: UserInfo!): String!
 }

 type Subscription {
     newUser: User!
 }
`;

const NEW_USER = "new user";

const resolvers = {
    Subscription: {
        newUser: {
            subscribe: (_, __, {pubsub}) => pubsub.asyncIterator(NEW_USER)
        }
    },
    User: {
        firstLetterUsername: (parent) => {
            return parent.username[0]
        },
        usernameID: (parent) => {
            return parent.username + parent.id
        },
        username: (parent) => {
            return parent.username
        }
    },
    Query: {
        hello: (parent, {name}) => {
            return `hey ${name}`
        },
        user: () => ({
            id: 1,
            username: "Ben"
        })
    },
    Mutation: {
        login: (parent, {userInfo: {username}}, context, info) => {
            console.log(context)
            return username
        },
        register: () => ({
            user: {
                id: 1,
                username: "John"
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

const pubsub = new PubSub(); 

const server = new ApolloServer({typeDefs, resolvers, context: ({req, res}) => ({req, res})});

server.listen().then(({url}) => console.log(`Server started at ${url}`));