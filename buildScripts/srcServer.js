import express from 'express';
import path from 'path';
import open from 'open';
import webpack from 'webpack';
import config from '../webpack.config.dev';
import { graphqlExpress, graphiqlExpress } from 'graphql-server-express';
import { makeExecutableSchema, addMockFunctionsToSchema } from 'graphql-tools';
import schema from '../data/schema.graphql';
import resolvers from '../data/resolvers';
import Mocks from '../data/mocks';
import * as bodyParser from 'body-parser';

/* eslint-disable no-console */

const port = 3000;
const app = express();
const compiler = webpack(config);

const executableSchema = makeExecutableSchema({
  typeDefs: schema,
  resolvers: resolvers,
});

addMockFunctionsToSchema({
  schema: executableSchema,
  mocks: Mocks,
  preserveResolvers: true,
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use('/graphql', graphqlExpress( ()=> {
  return {
    schema: executableSchema,
    context: { },
  };
}));

app.use('/graphiql', graphiqlExpress({
  endpointURL: '/graphql',
}));

app.use(require('webpack-dev-middleware') (compiler, {
  noInfo: true,
  publicPath: config.output.publicPath
}));

app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname, '../src/index.html'));
});

app.listen(port, function(err) {
  if(err) {
    console.log(err);
  } else {
    open('http://localhost:' + port);
  }
});
