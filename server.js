require('dotenv').config();
const express = require('express');
const sql = require('mssql');
const fs = require('fs');
const app = express();
app.use(express.json());

const dbConfig = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    server: process.env.DB_SERVER,
    database: process.env.DB_DATABASE,
    port:Number(process.env.DB_PORT),
    options: {
        encrypt: true, 
        trustServerCertificate: process.env.TRUST_SERVER === 'true',
        // cryptoCredentialsDetails: {
        //     minVersion: 'TLSv1.2', // Specify the minimum TLS version (adjust as needed)
        //     cert: fs.readFileSync('path/to/certificate.pem'), // Path to your certificate file
        //     key: fs.readFileSync('path/to/private-key.key'), // Path to your private key file
        // },
        enableArithAbort: true, // Enable ArithAbort for compatibility // change to true for local development / self-signed certificates
    }
};

app.post('/query', async (req, res) => {
    try {
        await sql.connect(dbConfig);
        const result = await sql.query(req.body.sql); // Use parameterized queries in production
        const response = {
            records: result.recordset,      // The records returned by the query
            //recordsets: result.recordsets,    // Array of recordsets (useful for multiple result sets)
            rowsAffected: result.rowsAffected,// Number of rows affected by the query
            output: result.output,            // Output values from procedures or OUTPUT clause
            returnValue: result.returnValue,  // Return value from stored procedures
            parameters: result.parameters,    // Parameters after executing a stored procedure
            lastRequest: result.lastRequest   // Details of the last request executed
        };
        res.json(response);

    } catch (err) {
        res.status(500).send(err.message);
    }
});

app.get('/test-db', async (req, res) => {
    try {
        await sql.connect(dbConfig);
        const result = await sql.query('SELECT * FROM INFORMATION_SCHEMA.TABLES;');
        res.json(result.recordset);
    } catch (err) {
        res.status(500).send(err.message);
    } finally {
        sql.close(); // Ensure the connection is always closed
    }
});


const PORT = process.env.PORT || 5478;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
