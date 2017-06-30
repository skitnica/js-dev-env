#!/usr/bin/env node
// http://www.rabbitmq.com/tutorials/tutorial-one-javascript.html

const amqp = require('amqplib/callback_api');
const uuid = require('uuid');

amqp.connect('amqp://guest:guest@10.16.11.6', (err, connection) => {
    connection.createChannel( (err, channel) => {
        const queue = 'prime-scheduling';
        const json = {
            runId: uuid.v4(),
            productId: 1,
            status: 'rebalance',
            runDate: new Date()
        };

        const content = JSON.stringify(json);
        channel.assertQueue(queue, {durable: false});
        channel.sendToQueue(queue, Buffer.from(content));
        console.log(' [x] Sent', content);
    })

    setTimeout(() => {
        connection.close();
        process.exit(0);
    }, 500);
});
