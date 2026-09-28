const {registerUser, loginUser} = require('../controller/authController');

const express = require('express');
const authRouter = (express.Router())

authRouter.post('/auth/register', registerUser);
authRouter.get('/login', loginUser);

module.exports = authRouter;