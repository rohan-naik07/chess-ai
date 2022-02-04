const mongoose = require('mongoose')
const { Schema } = mongoose

const GameSchema = new Schema({
    participant1 : {
        type : Schema.Types.ObjectId,
        ref: 'UserSchema'
    },
    participant2 : {
        type : Schema.Types.ObjectId,
        ref: 'UserSchema'
    },
    played_on : Date,
    moves : Array,
    result : {
        type : String,
        required : true
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
    },
    games : [GameSchema]
})


const User = mongoose.model('User', UserSchema)
const Game = mongoose.model('Game', GameSchema);

module.exports = {
    moveModel : Move,
    userModel : User,
    gameModel : Game
}