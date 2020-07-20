// Imports
const fs = require('fs');

/**
 * @type {import("typeorm").ConnectionOptions}
 */
// TypeORM base configuration
const baseConfig = {
    // Connect to Postgres database
    type: 'postgres',

    // Specify database host and port
    host: process.env.DB_HOST,
    port: Number.parseInt(process.env.DB_PORT || '5432'),

    // Specify database credentials
    username: process.env.DB_USER,
    password: process.env.DB_PASS,

    // Specify database to connect to
    database: process.env.DB_NAME,

    // TLS configuration
    ssl: !!process.env.DB_USE_TLS && {
        // Certificate authority
        ca: process.env.DB_TLS_CA ? fs.readFileSync(process.env.DB_TLS_CA) : undefined,

        // Client certificate
        cert: process.env.DB_TLS_CERT ? fs.readFileSync(process.env.DB_TLS_CERT) : undefined,

        // Client private key
        key: process.env.DB_TLS_KEY ? fs.readFileSync(process.env.DB_TLS_KEY) : undefined,

        // Diffie-Hellman Parameters
        dhparam: process.env.DB_TLS_DHPARAMS ? fs.readFileSync(process.env.DB_TLS_DHPARAMS) : undefined,
    },
};

// Exports
module.exports = baseConfig;
