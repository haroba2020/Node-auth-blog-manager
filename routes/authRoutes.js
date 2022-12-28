const { Router } = require('express');
const authController = require('../authControllers/authController');

router = Router()

router.get('/signup', authController.signup_get);
router.get('/login', authController.login_get);
router.post('/blog-create', authController.blog_create_post);
router.get('/create',authController.blog_create_get)
router.post('/signup', authController.signup_post);
router.post('/login', authController.login_post);
router.get('/logout', authController.logout_get)
router.get('/:id',authController.blog_details)
router.delete('/:id',authController.blog_delete)



module.exports = router