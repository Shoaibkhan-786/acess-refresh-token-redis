const { connect, set, connection } = require('mongoose');

const connectDatabase = () => {
    set("strictQuery", true);
    return connect('mongodb://localhost:27017/access-refresh-token-db')
}

connection.on('connected', () => {
    console.log('database connected')
})

module.exports = connectDatabase;