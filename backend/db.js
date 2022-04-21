const mongoose = require('mongoose')
const { Schema } = mongoose

const GameSchema = new Schema({
    participant1 : {
        type : Schema.Types.ObjectId,
        ref: 'User'
    },
    participant2 : {
        type : Schema.Types.ObjectId,
        ref: 'User'
    },
    played_on : Date,
    moves : [Array],
    initialTurn : String,
    result : {
        type : String
    }
})

const UserSchema = new Schema({
    userName: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }
})


const User = mongoose.model('User', UserSchema)
const Game = mongoose.model('Game', GameSchema);

module.exports = {
    userModel : User,
    gameModel : Game
}