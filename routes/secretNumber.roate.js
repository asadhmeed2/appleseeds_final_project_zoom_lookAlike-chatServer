const express=require('express');
const Router = express.Router();
const userController = require('../userController/user.controller')
const aoth = require('../auth/auth')
Router.get('/', function(req, res){
return "hello world";
})
//aoth.adminTokenAuth,
Router.post('/secretNumbre',aoth.adminTokenAuth, (req, res)=>{
    
userController.addSecretNumber(req,res);
})


module.exports= Router




