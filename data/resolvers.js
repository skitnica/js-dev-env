const resolvers = {
  Query: {
    testString: () => {
      return 'new String!';
    },
  },
};

export default resolvers;
