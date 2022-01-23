var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get(
  '/', 
  function(req, res, next) {
    res.send('respond with a resource');
  }
)


router.post(
  '/login',
  async function(req,res,next){
    
  }
)

router.post(
  '/register',
  async function(req,res,next){
     
  }
)

// mark users online
router.post(
  '/online',
  async function(req,res,next){
     
  }
)

// get online users
router.get(
  '/online',
  async function(req,res,next){
     
  }
)

module.exports = router;
