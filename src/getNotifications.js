const  GraphQLDate  = require('graphql-iso-date').GraphQLDate;
const axios  = require('axios');
const request = require('request');
const { GQLClient} = require('graphql-http');

const date = "2012-04-27";
const requestConfig = {
  headers: {'Content-Type':'application/json'},
  timeout: 6000
}
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

const query = {
  query: `{
    notifications(notificationDate: "${date}"){
      id
      nextRebalanceDate
    }
  }`
}

// const query = {
//     query: `{
//       notifications(notificationDate: "${date}"){
//         id
//         nextRebalanceDate
//         nextRebalanceMarketDataDate
//         nextRebalanceNotificationDate
//       }
//     }`
//   };

axios.post('https://dev.api.cardano.com/prime/graphql', query, requestConfig)
      .then(function (response){
        console.log(`response: ${response.data.data.notifications[0].id}`);
      })
      .catch(function(error) {
        console.log(error);
      });

// const query = {
//   query: `{
//     startRebalance(today: "2012-04-27") {
//       success
//     }
//   }`
// };

// axios.post('https://dev.api.cardano.com/prime-scheduling/graphiql', query, requestConfig)
//       .then(function (response){
//         console.log('Response: ');
//         console.log(response);
//         console.log(response.data.data.startRebalance);
//         if (response.data.errors) {
//           console.log(`graphql errors`);
//           console.log(JSON.stringify(response.data.errors.map(e => e.message).join()));
//         }
//       })
//       .catch(function(error) {
//         console.log('Error: ')
//         console.log(error);
//       });
