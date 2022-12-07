const { Router } = require('express');
const authController = require('../authControllers/authController');

router = Router()

router.get('/signup', authController.signup_get);
