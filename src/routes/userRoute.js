const express = require('express');
const userRouter = (express.Router())

const getUser= require('../controller/userController')


userRouter.get('/auth', getUser)


module.exports = userRouter;