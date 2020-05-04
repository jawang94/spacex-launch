const { ApolloServer } = require('apollo-server');

const LaunchAPI = require('./datasources/launch');
const UserAPI = require('./datasources/user');
const resolvers = require('./resolvers');
const typeDefs = require('./schema');
const { createStore } = require('./utils');
const isEmail = require('isemail');

const store = createStore();

const server = new ApolloServer({
  context: async ({ req }) => {
    // simple auth check on every request
    const auth = req.headers && req.headers.authorization;
    const email = Buffer.from(auth, 'base64').toString('ascii');
    // invalid email provided, return null user
    if (!isEmail.validate(email)) return { user: null };
    // email is valid, let's find the user or return null if not found
    const users = await store.users.findOrCreate({ where: email });

    // if null resolve won't spreading null.dataValues pop error? revisit...
    const user = (users && users[0]) || null;

    return { user: { ...user.dataValues } };
  },
  typeDefs,
  resolvers,
  dataSources: () => ({
    launchAPI: new LaunchAPI(),
    userAPI: new UserAPI({ store }),
  }),
});

server.listen().then(({ url }) => {
  console.log(`Server ready at ${url}!`);
});
