var express = require('express');
var router = express.Router();
const jwt = require("jsonwebtoken");
const Users = require('../db').userModel;
const bcrypt = require("bcrypt");

const verifyToken = (req,res,next)=>{
  const header = req.headers['authorization'];
  if(typeof header!=='undefined') {
      const bearer = header.split(' ');
      const token = bearer[0];
      req.token = token;
      next();
  } else {
     res.status(403).json(
       {
         error : true,
         message : 'Unauthorized'
       }
     )
  }
}

/* GET users listing. */
router.get(
  '/', 
  function(req, res, next) {
    Users.find({}).then(users=>{
      res.status(200).json(
        {
          error : false,
          message : users
        }
      )
    })
  }
)


router.post(
  '/login',
  function (req,res,next){
    Users.findOne({userName : req.body.userName})
    .then(async user=>{
      if (!user)
        return res.status(500).json({
            error: true,
            message: "Invalid Email ID",
        });
        const validatePassword = await bcrypt.compare( req.body.password,user.password); 
      if (!validatePassword)
          return res.status(500).json({
              error: true,
              message: "Invalid Password",
          });
      const token = jwt.sign({
              _id: user._id,
              userName: user.userName
          },"key"
      );
      res.status(200).json({ 
          error: false,
          token: token,
          userId : user._id,
          expiresIn : 3600
      });
    })
    .catch(error=>{
      console.error(error)
      res.status(500).json({
        error: true,
        message: error
      });
    })
  }
)

router.post(
  '/register',
  async function(req,res,next){
    Users.findOne({userName : req.body.userName})
    .then(async user=>{
      if (user)
        return res.status(400).json({ error: true, message: "User Already Registered" });
        const salt = await bcrypt.genSalt(10);
        const password = await bcrypt.hash(req.body.password, salt);
        Users.create({
          userName : req.body.userName,
          password : password
        })
        .then(user=>{
          const token = jwt.sign({
                _id: user._id,
                userName: user.userName
            },"key");
            res.status(200).json({ 
                error: false,
                token: token,
                userId : user._id,
                expiresIn : 3600
            });
        })
        .catch(error=>{
          console.error(error)
          res.status(500).json({
            error: true,
            message: error
          });
        })
    })
    .catch(error=>{
      console.error(error)
      res.status(500).json({
        error: true,
        message: error
      });
    })
  }
)


module.exports = {
  authRouter: router,
  verifyToken : verifyToken
}
