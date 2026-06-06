const { getDashBoardData} =require('../controllers/Dashboard.controller');
const   express=require('express');
const router=express.Router();
router.get('/get/:userId',getDashBoardData);
module.exports=router;