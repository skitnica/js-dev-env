'use strict';

import amqp from 'amqplib/callback_api';

const log = {
  debug: (msg) => console.log(msg),
  info: (msg) => console.log(msg),
  error: (msg) => console.log(`ERROR: ${msg}`, msg)
};

export class RabbitMQ {
  constructor(connectionString, queue, logger) {
    this.connectionString = connectionString;
    this.queue = queue;
    this.logger = logger;
    this.connection = null;
    this.channel = null;
  }

  async getChannel() {
    return new Promise((resolve, reject) => {
      if (this.channel) {
        this.logger.info(`already connected to ${this.connectionString}:${this.queue}`);
        return this.channel;
      }
      this.logger.info(`connecting to ${this.connectionString}:${this.queue}`);
      amqp.connect(this.connectionString, (err, connection) => {
        if (err) {
          if (this.connection) {
            this.connection.close()
          };
          this.connection = null;
          this.channel = null;
          reject(err);
          return;
        }
        connection.createChannel((err, channel) => {
          if (err) {
            if (this.connection) {
              this.connection.close()
            };
            this.connection = null;
            this.channel = null;
            reject(err);
          } else {
            channel.assertQueue(this.queue, { durable: false });
            this.channel = channel;
            this.logger.info(`connected to ${this.connectionString}:${this.queue}`);
            resolve(this.channel);
          }
        })
      });
    })
  }

  async send(json) {
    this.logger.info(`sending to rabbit queue ${this.queue}`);
    this.getChannel()
      .then(() => {
        const content = JSON.stringify(json);
        this.channel.sendToQueue(this.queue, Buffer.from(content));
        this.logger.info(`sent message ${content} to ${this.connectionString}:${this.queue}`);
      })
      .catch(err => this.logger.error(err));
  }
}

export default new RabbitMQ('amqp://guest:guest@10.16.11.6', config.rabbit.queue, log);
