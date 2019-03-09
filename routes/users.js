const express = require('express');
const jwt =require('jsonwebtoken');
const router = express.Router();
const Pool = require("pg").Pool;

const pool = new Pool({
  connectionString:
    process.env.DATABASE_URL ||
    "postgresql://zeinabsamir:123@localhost:5432/payme_todo",
  ssl: true
});

router.get('/',(req,res) =>{
    pool.query("SELECT * FROM users ORDER BY id ASC", (error, results) => {
        if (error) {
          throw error;
        }
        res.status(200).json(results.rows);
      });
   
})

router.post("/login",(req,res)=>{
   // console.log(req.body);
    const {username, password } = req.body;
    pool.query('SELECT * FROM users WHERE username = $1 AND password = $2', [username, password], (error, results) => {
        if (error) {
          throw error
        }
        if(results.rows[0].username !== username) {
            res.status(401).send('Invalid username')
        } else if(results.rows[0].password !== password) {
            res.status(401).send('Invalid password');
        }
        else {
           // console.log(results.rows[0].id);
            let payload = {accountId: results.rows[0].id};
            let token=jwt.sign(payload,"secret");
            res.status(200).json({token});
         }
       
      })

//    loginSchema.findOne({"email":req.body.email,"password":req.body.password}, function (err,user) {
//      console.log(user);
//      if (err) res.send({"error":"uesr name or password is in correct"});
//      if(user!=null){
//        let payload={subject:{'accountId':user.accountId,"userType":user.userType}}
//        let token=jwt.sign(payload,"secret")
//      if(user.userType==false)
//      {
//      candidateSchema.find({accountId:user.accountId},(error,result)=>{
//        if (error) res.send({"error":"uesr name or password is in correct"}); 
//        else
//        { 
//          res.send({token,userType:user.userType,accountId:user.accountId});
//        }
      
//      })
//    }
//      else if(user.userType==true)
//      {
//      empSchema.find({accountId:user.accountId},(error,result)=>{
//        if (error) res.send({"error":error}); 
//        else
//        {
//          res.send({token,userType:user.userType,accountId:user.accountId});
//        } 
//      })
//    }
//  }
//    });
  })

module.exports = router;