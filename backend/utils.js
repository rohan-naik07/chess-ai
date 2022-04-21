const endpoints = {
    BASE : '/',
    LOGIN : '/login',
    REGISTER : '/register',
    GET_FROM_AI : '/ai',
    USER_GAME : '/user/:userId',
    GAME : '/:gameId'
}

const errorMessages = {
    FAILED_GAMEID_RETRIEVE : 'Failed to retrieve game ID',
    FAILED_RETRIEVE_AI : 'Failed to retrive from AI',
    FAILED_USER_GAMES : 'Failed to get user games',
    FAILED_FETCH_GAME : 'Failed to get game info',
    FAILED_POST_GAME : 'Failed to update user games',
    FAILED_PUT_GAME : 'Failed to update game',
    FAILED_DELETE_GAME : 'Failed to delete game',
    FAILED_LOGIN : 'Failed to login user',
    FAILED_REGISTER : 'Failed to register user',
    WRONG_USERNAME: 'Wrong username',
    WRONG_PASSWORD : 'Wrong password',
    USER_EXISTS : 'User already exists',
    UNAUTHORIZED : 'Access is unauthorized',
    FAILED_FETCH_USER : 'Failed to get users'
}

module.exports = {
    endpoints,
    errorMessages
}