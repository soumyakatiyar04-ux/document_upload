const mysql = require('mysql2/promise');
const dotenv = require('dotenv');
dotenv.config();

const connection = mysql.createPool({
    user:process.env.DB_USER ,
    host:process.env.DB_HOST ,
    database:process.env.DB_DATABASE ,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT
})

connection.getConnection((err)=>{
    if(err){
        console.log("Error in connecting database")
    }
    else {
        console.log("Database successfully connected")
    }
})

module.exports = connection;