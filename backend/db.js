// working user account to handle API calls regarding the database

const { Pool } = require('pg'); // REQUIRE, not required damn it

// not actual data
const pool = new Pool( {
    user: '---',
    host: 'localhost',
    database: '---',
    password: '---',
    port: '---',
});

module.exports = {
    query: (text, params) => pool.query(text, params)
};