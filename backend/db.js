
const mongoose = require('mongoose')
const { Schema } = mongoose
const Promise = require("bluebird")
Promise.promisifyAll(mongoose);

const MoveSchema = new Schema({
    from : {
        type : String,
        required : true
    },
    to : {
        type : String,
        required : true
    },
    turn : {
        type : String,
        required : true
    },
    captured : {
        type : String,
        required : true
    },
    passant : Number
})

const GameSchema = new Schema({
    participant1 : {
        type : Schema.Types.ObjectId,
        ref: 'UserSchema'
    },
    participant2 : {
        type : Schema.Types.ObjectId,
        ref: 'UserSchema'
    },
    moves : [MoveSchema],
    result : {
        type : String,
        required : true
    }
})

const RequestSchema = new Schema({
    from : {
        type : Schema.Types.ObjectId,
        ref: 'UserSchema'
    },
    to : {
        type : Schema.Types.ObjectId,
        ref: 'UserSchema'
    },
    initialTurn : String
})

const UserSchema = new Schema({
    userName: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    isOnline: {
        type : Boolean,
        required : true
    },
    games : [GameSchema]
})


const Move = mongoose.model('Move', MoveSchema)
const User = mongoose.model('User', UserSchema)
const Request = mongoose.model('Request', RequestSchema)
const Game = mongoose.model('Game', GameSchema);

module.exports = {
    moveModel : Move,
    userModel : User,
    requestModel : Request,
    gameModel : Game
}