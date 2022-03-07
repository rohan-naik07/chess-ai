require('dotenv').config()
var express = require('express');
var jwt = require('express-jwt');
const { Singleton } = require('../ai_id');
var router = express.Router();
const verifyToken = require('./users').verifyToken;
let games = require('../db').gameModel;
let minimax = require('../minimax').minimax;
const { endpoints,errorMessages } = require('../utils');
const logger = new Singleton().getloggerInstance()

router.route(endpoints.BASE).get(
    verifyToken,
    jwt({ secret: process.env.jwt_key, algorithms: ['HS256'] }),
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
                res.status(200).json({
                    error: true,
                    message: {
                        selectedLocation : answer[0],
                        id : answer[1],
                        piece : positions[answer[1]]===undefined ? null : positions[answer[1]].id
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
        games.find(
            {
                $or : [
                    {'participant1' : user_id},
                    {'participant2' : user_id}
                ]
            }
        ).populate(
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
        ).then(games=>{
            res.status(200).json({
                error: false,
                message: games
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
).put(
    verifyToken,
    function(req,res){
        const game_id = req.params.gameId;
        games.findByIdAndUpdate(game_id,req.body,{new : true})
        .then(game=>{
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