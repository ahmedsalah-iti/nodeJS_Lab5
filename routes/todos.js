const express = require('express');
const router = express.Router();
const {getMany,getOne,insertOne,deleteOne,updateOne} = require('../controllers/todos')

const { auth,restrictTo } = require('../middlewares/auth');
router.use(auth);

router.get('/',getMany);
router.get('/:id',getOne);
router.post('/',restrictTo('admin'),insertOne);
router.delete('/:id',restrictTo('admin'),deleteOne);
router.patch('/:id',restrictTo('admin'),updateOne);
module.exports=router