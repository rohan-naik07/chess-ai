var express = require('express');
var router = express.Router();
const verifyToken = require('./users').verifyToken;
let games = require('../db').gameModel;
let users = require('../db').userModel;
let minimax = require('../minimax').minimax;


router.route('/').get(
    verifyToken,
    function(req,res,next){
        console.log(req.body)
        games.create(req.body.data)
        .then(game=>{
            console.log(game)
            res.status(200).json({
                error: false,
                message: game._id
            })
        })
        .catch(error=>{
            //console.error(error)
            res.status(500).json({
                error: true,
                message: error
            });
        })
    }
) // get a new game id

router.route('/ai').get(
    verifyToken,
    function(req,res,next) {
        try {
            let positions = req.body.positions;
            let turn = req.body.turn;
            let start = new Date().getTime();
            let answer = new minimax(turn).minimaxRoot(3,true,turn==='white' ? 'black' : 'white',{...positions})
            let end = new Date().getTime();
            console.log((end-start)/1000)
            res.status(200).json({
                error: true,
                message: answer
            });
        } catch (error) {
            console.error(error)
            res.status(500).json({
                error: true,
                message: error
            });
        }
    }
)// get response from AI

router.route('/:userId').get(
    verifyToken,
    function(req,res,next) {
        const user_id = req.params.userId;
        users.findById(user_id)
        .populate(
            { 
              path: 'games',
              model: 'Game',
              populate : {
                path : 'participant1',
                model : 'User'
              },
              populate : {
                path : 'participant2',
                model : 'User'
              }
            }
        )
        .then(user=>{
            console.log(user)
            res.status(200).json({
                error: false,
                message: user.games
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
).post(
    verifyToken,
    function(req,res,next){
        games.create(req.body.data)
        .then(game=>{
            console.log(game)
            users.findById(req.params.userId)
            .populate({ 
                  path: 'games',
                  model: 'Game'
            })
            .then(user=>{
                console.log(user)
                user.games.push(game._id)
                users.findByIdAndUpdate(
                    req.params.userId,
                    {$set : {games : user.games}}
                )
                .then(user=>{
                    console.log(user)
                    res.status(200).json({
                        error: false,
                        message: user
                    })
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
        })
        .catch(error=>{
            console.error(error)
            res.status(500).json({
                error: true,
                message: error
            });
        })
    }
) // save a game of an user

router.route('/:gameId')
.put(
    verifyToken,
    function(req,res,next){
        const game_id = req.params.gameId;
        games.findByIdAndUpdate(game_id,req.body.data,{new : true})
        .then(game=>{
            console.log(game)
            res.status(200).json({
                error: false,
                message: game
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
.delete(
    verifyToken,
    function(req,res,next){
        const game_id = req.params.gameId;
        games.findByIdAndDelete(game_id)
        .then(games=>{
            console.log(games)
            res.status(200).json({
                error: false,
                message: 'Deleted Successfully'
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
) // delete a game of an user



module.exports = router;