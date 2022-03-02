var express = require('express');
var jwt = require('express-jwt');
const { Singleton } = require('../ai_id');
var router = express.Router();
const verifyToken = require('./users').verifyToken;
let games = require('../db').gameModel;
let users = require('../db').userModel;
let minimax = require('../minimax').minimax;
const { endpoints,errorMessages } = require('../utils');
const logger = new Singleton().getloggerInstance()

router.route(endpoints.BASE).get(
    verifyToken,
    jwt({ secret: 'key', algorithms: ['HS256'] }),
    function(req,res){
        let object = JSON.parse(req.query.body);
        games.create({
            'participant1' : req.user._id,
            'participant2' : object.participant2===null? new Singleton().getAIInstance().getId() : object.participant2,
            'moves' : [],
            'result' : 'null',
            'played_on' : new Date().toISOString(),
            'initialTurn' : object.initialTurn
        })
        .then(game=>{
            logger.log(game._id)
            return res.status(200).json({
                error: false,
                message: game._id
            })
        })
        .catch(error=>{
            logger.log(error)
            return res.status(500).json({
                error: true,
                message: errorMessages.FAILED_GAMEID_RETRIEVE
            });
        })
    }
) // get a new game id

router.route(endpoints.GET_FROM_AI).post(
    verifyToken,
    function(req,res) {
        let positions = req.body.positions;
        let turn = req.body.turn;
        new minimax(turn==='white' ? 'black' : 'white').minimaxRoot(3,true,turn,{...positions})
        .then(answer=>{
                logger.log(answer)
                res.status(200).json({
                    error: true,
                    message: {
                        selectedLocation : answer[0],
                        id : answer[1],
                        piece : positions[answer[1]]===undefined ? null : positions[answer[1]]
                    }
                });
            }
        ).catch(error=>{
            logger.log(error)
            res.status(500).json({
                error: true,
                message: errorMessages.FAILED_RETRIEVE_AI
            });
        })      
    }
)// get response from AI

router.route(endpoints.USER_GAME).get(
    verifyToken,
    function(req,res) {
        const user_id = req.params.userId;
        users.findById(user_id)
        .populate(
            { 
              path: 'games',
              model: 'Game',
              populate : {
                path : 'participant1',
                model : 'User'
              }
            }
        )
        .populate(
            { 
              path: 'games',
              model: 'Game',
              populate : {
                path : 'participant2',
                model : 'User'
              }
            }
        )
        .then(user=>{
            logger.log(user)
            res.status(200).json({
                error: false,
                message: user.games
            })
        })
        .catch(error=>{
            logger.log(error)
            res.status(500).json({
                error: true,
                message: errorMessages.FAILED_USER_GAMES
            });
        })
    }
)//get all games of a specific user

//get particular game
router.route(endpoints.GAME).get(
    verifyToken,
    function(req,res){
        const game_id = req.params.gameId;
        games.findById(game_id)
        .populate(
            {
                path : 'participant1',
                model : 'User'
            }
        )
        .populate(
            {
                path : 'participant2',
                model : 'User'
            }
        )
        .then(game=>{
            logger.log(game)
            res.status(200).json({
                error: false,
                message: game
            })
        })
        .catch(error=>{
            logger.log(error)
            res.status(500).json({
                error: true,
                message: errorMessages.FAILED_FETCH_GAME
            });
        })
    }
).post(
    verifyToken,
    function(req,res){
        const game_id = req.params.gameId;
        games.findById(game_id)
        .populate(
            {
                path : 'participant1',
                model : 'User'
            }
        )
        .populate(
            {
                path : 'participant2',
                model : 'User'
            }
        )
        .then(game=>{
            let user_games = game.participant1.games;
            user_games.push(game._id);
            users.findByIdAndUpdate(game.participant1._id,{$set : {games : user_games}}).then(
                ()=>{
                    return game;
                }
            ).catch(error=>{
                logger.log(error)
                res.status(500).json({
                    error: true,
                    message: errorMessages.FAILED_POST_GAME
                });
            })
        })
        .then(game=>{
            let user_games = game.participant2.games;
            user_games.push(game._id);
            users.findByIdAndUpdate(game.participant2._id,{$set : {games : user_games}}).then(
                ()=>{
                    res.status(200).json({
                        error: false,
                        message: game
                    }) 
                }
            ).catch(error=>{
                logger.log(error)
                res.status(500).json({
                    error: true,
                    message:  errorMessages.FAILED_POST_GAME
                });
            })
        })
        .catch(error=>{
            logger.log(error)
            res.status(500).json({
                error: true,
                message:  errorMessages.FAILED_POST_GAME
            });
        })
    }
).put(
    verifyToken,
    function(req,res){
        const game_id = req.params.gameId;
        games.findByIdAndUpdate(game_id,req.body.data,{new : true})
        .then(game=>{
            logger.log(game)
            res.status(200).json({
                error: false,
                message: game
            })
        })
        .catch(error=>{
            logger.log(error)
            res.status(500).json({
                error: true,
                message:  errorMessages.FAILED_PUT_GAME
            });
        })
    }
).delete(
    verifyToken,
    function(req,res){
        const game_id = req.params.gameId;
        games.findByIdAndDelete(game_id)
        .then(games=>{
            logger.log(games)
            res.status(200).json({
                error: false,
                message: games
            })
        })
        .catch(error=>{
            logger.log(error)
            res.status(500).json({
                error: true,
                message:  errorMessages.FAILED_DELETE_GAME
            });
        })
    }
) // delete a game of an user



module.exports = router;