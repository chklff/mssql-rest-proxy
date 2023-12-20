require('dotenv').config();
const sql = require('mssql');

const dbConfig = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    server: process.env.DB_SERVER,
    port:Number(process.env.DB_PORT),
    database: process.env.DB_DATABASE,
    options: {
        encrypt: true, // if you're on Azure
        trustServerCertificate: process.env.TRUST_SERVER === 'true' // change to true for local development / self-signed certificates
    }
};

async function testDBConnection() {
    try {
        const pool = await sql.connect(dbConfig);
        console.log('Connection Successful!');
        pool.close();
    } catch (err) {
        console.error('Connection Failed:', err.message);
    }
}

testDBConnection();
