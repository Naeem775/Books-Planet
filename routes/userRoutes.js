const express = require('express');
const {signup,login,forgotPassword,updatePassword,protect} = require('../controllers/authController');
const {updateMe,deleteMe,getAllUsers} = require('../controllers/userController');
const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
// router.post('/forgotPassword', forgotPassword);
router.patch('/updatePassword',protect,updatePassword);

router.patch('/updateMe', protect, updateMe);
router.delete('/deleteMe', protect, deleteMe);
router.route('/').get(getAllUsers);
module.exports = router;