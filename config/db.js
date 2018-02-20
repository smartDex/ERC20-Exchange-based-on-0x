var mysql = require('mysql');

module.exports = {
    con: mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: '',
        database: 'trading',
    })
}