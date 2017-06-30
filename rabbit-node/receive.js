#!/usr/bin/env node
// http://www.rabbitmq.com/tutorials/tutorial-one-javascript.html

const amqp = require('amqplib/callback_api');

function onexit(connection) {
  console.log(` [x] Closing connection`);
  connection.close();
}

amqp.connect('amqp://guest:guest@10.16.11.6', (err, connection) => {
  if (err) {
    console.log(err);
  }
  connection.createChannel((err, channel) => {
    const queue = 'prime-scheduling';

    channel.assertQueue(queue, { durable: false });
    console.log(` [x] Waiting for messages in ${queue}. To exit press CTRL-C`);

    channel.consume(queue, (msg) => {
      const json = JSON.parse(msg.content)
      console.log(' [*] Received ', json);
    }, { noAck: true });
  });

  process.on('exit', onexit.bind(null, connection));
  process.on('uncaughtException', onexit.bind(null, connection));
});
