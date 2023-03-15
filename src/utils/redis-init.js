const redis = require('redis');

const client = redis.createClient();

client.connect();

client.on('connect', () => {
    console.log('redis is connected');
})

module.exports = client;