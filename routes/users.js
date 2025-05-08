const express = require('express');
const router = express.Router();

const {getUsers,getUser,saveUser,deleteUser,updateUser,getTodosByUser,loginWithEmail} = require('../controllers/users');
const validateReqBody = require('../middlewares/validate');
const userSchema = require('../validations/users');


router.get('/',getUsers);
router.get('/:id',getUser);
router.post('/',validateReqBody(userSchema),saveUser);
router.delete('/:id',deleteUser);
router.patch('/:id',updateUser);
router.get('/:id/todos',getTodosByUser)
router.post('/login',loginWithEmail)
module.exports=router