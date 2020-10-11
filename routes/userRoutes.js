const express = require('express');
const {signup,login,forgotPassword,updatePassword,protect, restrictTo} = require('../controllers/authController');
const {updateMe,deleteMe,getAllUsers,getUser,updateUser,deleteUser,getMe} = require('../controllers/userController');
const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);


router.use(protect);

router.patch('/updatePassword',updatePassword);
router.patch('/updateMe',updateMe);
router.delete('/deleteMe',deleteMe);
router.get('/getMe',getMe,getUser);

router.use(restrictTo('admin'));

router.route('/')
      .get(getAllUsers);

router.route('/:id')
      .get(getUser)
      .delete(deleteUser);
      
module.exports = router;