const dotenv = require('dotenv');
dotenv.config()

const express = require('express');
const multer = require('multer');

const app = express();
app.use(express.json());

const userRouter= require('./src/routes/userRoute');
const documentRouter= require('./src/routes/documentRoute')
const authRouter= require('./src/routes/authRoute')

const loggingMiddleware = require('./src/middleware/requestLogger');
app.use(loggingMiddleware);

app.use ('/api', userRouter)
app.use ('/api',documentRouter)
app.use ('/api', authRouter)

app.listen(process.env.SERVER_PORT, ()=>{
    console.log(`Server is running on port ${process.env.SERVER_PORT}`)
});