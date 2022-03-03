var express = require('express');
var router = express.Router();
const jwt = require("jsonwebtoken");
const Users = require('../db').userModel;
const bcrypt = require("bcrypt");
const { endpoints,errorMessages } = require('../utils');

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
         message : errorMessages.UNAUTHORIZED
       }
     )
  }
}

/* GET users listing. */
router.route(endpoints.BASE).get(
  verifyToken, 
  function(req, res) {
    Users.find({}).then(users=>{
      res.status(200).json(
        {
          error : false,
          message : users
        }
      )
    }).catch(error=>{
      console.error(error)
      res.status(500).json({
        error: true,
        message: errorMessages.FAILED_FETCH_USER
      });
    })
  }
)


router.post(
  endpoints.LOGIN,
  function (req,res){
    Users.findOne({userName : req.body.userName})
    .then(async user=>{
      if (!user)
        return res.status(200).json({
            error: true,
            message: errorMessages.WRONG_USERNAME,
        });
        const validatePassword = await bcrypt.compare( req.body.password,user.password); 
      if (!validatePassword)
          return res.status(200).json({
              error: true,
              message: errorMessages.WRONG_PASSWORD,
          });
      const token = jwt.sign(
          {
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
        message: errorMessages.FAILED_LOGIN
      });
    })
  }
)

router.post(
  endpoints.REGISTER,
  async function(req,res,next){
    Users.findOne({userName : req.body.userName})
    .then(async user=>{
      if (user)
        return res.status(200).json({ error: true, message: errorMessages.USER_EXISTS });
        const salt = await bcrypt.genSalt(10);
        const password = await bcrypt.hash(req.body.password, salt);
        Users.create({
          userName : req.body.userName,
          password : password
        }).then(user=>{
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
            message: errorMessages.FAILED_REGISTER
          });
        })
    })
    .catch(error=>{
      console.error(error)
      res.status(500).json({
        error: true,
        message: errorMessages.FAILED_REGISTER
      });
    })
  }
)


module.exports = {
  authRouter: router,
  verifyToken : verifyToken
}
