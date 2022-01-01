import bdt from './pieces/Chess_bdt60.png';
import blt from './pieces/Chess_blt60.png';
import rdt from './pieces/Chess_rdt60.png';
import rlt from './pieces/Chess_rlt60.png';
import kdt from './pieces/Chess_kdt60.png';
import klt from './pieces/Chess_klt60.png';
import qdt from './pieces/Chess_qdt60.png';
import qlt from './pieces/Chess_qlt60.png';
import ndt from './pieces/Chess_ndt60.png';
import nlt from './pieces/Chess_nlt60.png';
import pdt from './pieces/Chess_pdt60.png';
import plt from './pieces/Chess_plt60.png';

export const pieces = {
    'black0bishop' : {
        image : bdt,
        score : 3,
        destroyed_flag : false
    },
    'white0bishop' : {
        image : blt,
        score : 3,
        destroyed_flag : false
    },
    'black0rook' : {
        image : rdt,
        score : 5,
        destroyed_flag : false
    },
    'white0rook' : {
        image : rlt,
        score : 5,
        destroyed_flag : false
    },
    'black0knight' : {
        image : ndt,
        score : 3,
        destroyed_flag : false
    },
    'white0knight' : {
        image : nlt,
        score : 3,
        destroyed_flag : false
    },
    'black1bishop' : {
        image : bdt,
        score : 3,
        destroyed_flag : false
    },
    'white1bishop' : {
        image : blt,
        score : 3,
        destroyed_flag : false
    },
    'black1rook' : {
        image : rdt,
        score : 5,
        destroyed_flag : false
    },
    'white1rook' : {
        image : rlt,
        score : 5,
        destroyed_flag : false
    },
    'black1knight' : {
        image : ndt,
        score : 3,
        destroyed_flag : false
    },
    'white1knight' : {
        image : nlt,
        score : 3,
        destroyed_flag : false
    },
    'black0pawn' : {
        image : pdt,
        score : 1,
        destroyed_flag : false
    },
    'white0pawn' : {
        image : plt,
        score : 1,
        destroyed_flag : false
    },
    'black1pawn' : {
        image : pdt,
        score : 1,
        destroyed_flag : false
    },
    'white1pawn' : {
        image : plt,
        score : 1,
        destroyed_flag : false
    },
    'black2pawn' : {
        image : pdt,
        score : 1,
        destroyed_flag : false
    },
    'white2pawn' : {
        image : plt,
        score : 1,
        destroyed_flag : false
    },
    'black3pawn' : {
        image : pdt,
        score : 1,
        destroyed_flag : false
    },
    'white3pawn' : {
        image : plt,
        score : 1,
        destroyed_flag : false
    },
    'black4pawn' : {
        image : pdt,
        score : 1,
        destroyed_flag : false
    },
    'white4pawn' : {
        image : plt,
        score : 1,
        destroyed_flag : false
    },
    'black5pawn' : {
        image : pdt,
        score : 1,
        destroyed_flag : false
    },
    'white5pawn' : {
        image : plt,
        score : 1,
        destroyed_flag : false
    },
    'black6pawn' : {
        image : pdt,
        score : 1,
        destroyed_flag : false
    },
    'white6pawn' : {
        image : plt,
        score : 1,
        destroyed_flag : false
    },
    'black7pawn' : {
        image : pdt,
        score : 1,
        destroyed_flag : false
    },
    'white7pawn' : {
        image : plt,
        score : 1,
        destroyed_flag : false
    },
    'black0queen' : {
        image : qdt,
        score : 9,
        destroyed_flag : false
    },
    'white0queen' : {
        image : qlt,
        score : 9,
        destroyed_flag : false
    },
    'black0king' : {
        image : kdt,
        score : 0,
        destroyed_flag : false
    },
    'white0king' : {
        image : klt,
        score : 0,
        destroyed_flag : false
    }
}
/*
export const initialPositionsWhite = {
    '0+0' : 'black0rook',
    '0+1' : 'black0knight',
    '0+2' : 'black0bishop',
    '0+3' : 'black0queen',
    '0+4' : 'black0king',
    '0+5' : 'black1bishop',
    '0+6' : 'black1knight',
    '0+7' : 'black1rook',
    '1+0' : 'black0pawn',
    '1+1' : 'black1pawn',
    '1+2' : 'black2pawn',
    '1+3' : 'black3pawn',
    '1+4' : 'black4pawn',
    '1+5' : 'black5pawn',
    '1+6' : 'black6pawn',
    '1+7' : 'black7pawn',
    '6+0' : 'white0pawn',
    '6+1' : 'white1pawn',
    '6+2' : 'white2pawn',
    '6+3' : 'white3pawn',
    '6+4' : 'white4pawn',
    '6+5' : 'white5pawn',
    '6+6' : 'white6pawn',
    '6+7' : 'white7pawn',
    '7+0' : 'white0rook',
    '7+3' : 'white0king',
    '7+7' : 'white1rook'
}

export const initialPositionsBlack = {
    '0+0' : 'white0rook',
    '0+1' : 'white0knight',
    '0+2' : 'white0bishop',
    '0+3' : 'white0queen',
    '0+4' : 'white0king',
    '0+5' : 'white1bishop',
    '0+6' : 'white1knight',
    '0+7' : 'white1rook',
    '1+0' : 'white0pawn',
    '1+1' : 'white1pawn',
    '1+2' : 'white2pawn',
    '1+3' : 'white3pawn',
    '1+4' : 'white4pawn',
    '1+5' : 'white5pawn',
    '1+6' : 'white6pawn',
    '1+7' : 'white7pawn',
    '6+0' : 'black0pawn',
    '6+1' : 'black1pawn',
    '6+2' : 'black2pawn',
    '6+3' : 'black3pawn',
    '6+4' : 'black4pawn',
    '6+5' : 'black5pawn',
    '6+6' : 'black6pawn',
    '6+7' : 'black7pawn',
    '7+0' : 'black0rook',
    '7+5' : 'black0king',
    '7+7' : 'black1rook'
}
*/

export const initialPositionsWhite = {
    '0+0' : 'black0rook',
    '0+1' : 'black0knight',
    '0+2' : 'black0bishop',
    '0+3' : 'black0queen',
    '0+4' : 'black0king',
    '0+5' : 'black1bishop',
    '0+6' : 'black1knight',
    '0+7' : 'black1rook',
    '1+0' : 'black0pawn',
    '1+1' : 'black1pawn',
    '1+2' : 'black2pawn',
    '1+3' : 'black3pawn',
    '1+4' : 'black4pawn',
    '1+5' : 'black5pawn',
    '1+6' : 'black6pawn',
    '1+7' : 'black7pawn',
    '6+0' : 'white0pawn',
    '6+1' : 'white1pawn',
    '6+2' : 'white2pawn',
    '6+3' : 'white3pawn',
    '6+4' : 'white4pawn',
    '6+5' : 'white5pawn',
    '6+6' : 'white6pawn',
    '6+7' : 'white7pawn',
    '7+0' : 'white0rook',
    '7+1' : 'white0knight',
    '7+2' : 'white0bishop',
    '7+3' : 'white0queen',
    '7+4' : 'white0king',
    '7+5' : 'white1bishop',
    '7+6' : 'white1knight',
    '7+7' : 'white1rook'
}

export const initialPositionsBlack = {
    '0+0' : 'white0rook',
    '0+1' : 'white0knight',
    '0+2' : 'white0bishop',
    '0+3' : 'white0queen',
    '0+4' : 'white0king',
    '0+5' : 'white1bishop',
    '0+6' : 'white1knight',
    '0+7' : 'white1rook',
    '1+0' : 'white0pawn',
    '1+1' : 'white1pawn',
    '1+2' : 'white2pawn',
    '1+3' : 'white3pawn',
    '1+4' : 'white4pawn',
    '1+5' : 'white5pawn',
    '1+6' : 'white6pawn',
    '1+7' : 'white7pawn',
    '6+0' : 'black0pawn',
    '6+1' : 'black1pawn',
    '6+2' : 'black2pawn',
    '6+3' : 'black3pawn',
    '6+4' : 'black4pawn',
    '6+5' : 'black5pawn',
    '6+6' : 'black6pawn',
    '6+7' : 'black7pawn',
    '7+0' : 'black0rook',
    '7+1' : 'black0knight',
    '7+2' : 'black0bishop',
    '7+3' : 'black0queen',
    '7+4' : 'black0king',
    '7+5' : 'black1bishop',
    '7+6' : 'black1knight',
    '7+7' : 'black1rook'
}


export const checkifMoved = {
    'white0king' : false,
    'white1rook' : false,
    'white1king' : false,
    'white0rook' : false,
    'black0king' : false,
    'black1rook' : false,
    'black1king' : false,
    'black0rook' : false,
}