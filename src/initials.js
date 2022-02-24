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
import {Queen,King,Pawn,Knight,Bishop,Rook} from './util';

const getMappedObject = (object)=>{
    let mappedObject = {}
    Object.keys(object).forEach(
        key=>{
            mappedObject[object[key].getId()] = object[key];
        }
    )
    return mappedObject;
}

export const getInitialPositions = (initialTurn)=>{
    const initialPositionsWhite = {
        '0+0' : new Rook('black0rook',rdt,initialTurn),
        '0+1' : new Knight('black0knight',ndt,initialTurn),
        '0+2' : new Bishop('black0bishop',bdt,initialTurn),
        '0+3' : new Queen('black0queen',qdt,initialTurn),
        '0+4' : new King('black0king',kdt,initialTurn),
        '0+5' : new Bishop('black1bishop',bdt,initialTurn),
        '0+6' : new Knight('black1knight',ndt,initialTurn),
        '0+7' : new Rook('black1rook',rdt,initialTurn),
        '1+0' : new Pawn('black0pawn',pdt,initialTurn),
        '1+1' : new Pawn('black1pawn',pdt,initialTurn),
        '1+2' : new Pawn('black2pawn',pdt,initialTurn),
        '1+3' : new Pawn('black3pawn',pdt,initialTurn),
        '1+4' : new Pawn('black4pawn',pdt,initialTurn),
        '1+5' : new Pawn('black5pawn',pdt,initialTurn),
        '1+6' : new Pawn('black6pawn',pdt,initialTurn),
        '1+7' : new Pawn('black7pawn',pdt,initialTurn),
        '6+0' : new Pawn('white0pawn',plt,initialTurn),
        '6+1' : new Pawn('white1pawn',plt,initialTurn),
        '6+2' : new Pawn('white2pawn',plt,initialTurn),
        '6+3' : new Pawn('white3pawn',plt,initialTurn),
        '6+4' : new Pawn('white4pawn',plt,initialTurn),
        '6+5' : new Pawn('white5pawn',plt,initialTurn),
        '6+6' : new Pawn('white6pawn',plt,initialTurn),
        '6+7' : new Pawn('white7pawn',plt,initialTurn),
        '7+0' : new Rook('white0rook',rlt,initialTurn),
        '7+1' : new Knight('white0knight',nlt,initialTurn),
        '7+2' : new Bishop('white0bishop',blt,initialTurn),
        '7+3' : new Queen('white0queen',qlt,initialTurn),
        '7+4' : new King('white0king',klt,initialTurn),
        '7+5' : new Bishop('white1bishop',blt,initialTurn),
        '7+6' : new Knight('white1knight',nlt,initialTurn),
        '7+7' : new Rook('white1rook',rlt,initialTurn)
    }
    
    const initialPositionsBlack = {
        '0+0' : new Rook('white0rook',rlt,initialTurn),
        '0+1' : new Knight('white0knight',nlt,initialTurn),
        '0+2' : new Bishop('white0bishop',blt,initialTurn),
        '0+3' : new Queen('white0queen',qlt,initialTurn),
        '0+4' : new King('white0king',klt,initialTurn),
        '0+5' : new Bishop('white1bishop',blt,initialTurn),
        '0+6' : new Knight('white1knight',nlt,initialTurn),
        '0+7' : new Rook('white1rook',rlt,initialTurn),
        '1+0' : new Pawn('white0pawn',plt,initialTurn),
        '1+1' : new Pawn('white1pawn',plt,initialTurn),
        '1+2' : new Pawn('white2pawn',plt,initialTurn),
        '1+3' : new Pawn('white3pawn',plt,initialTurn),
        '1+4' : new Pawn('white4pawn',plt,initialTurn),
        '1+5' : new Pawn('white5pawn',plt,initialTurn),
        '1+6' : new Pawn('white6pawn',plt,initialTurn),
        '1+7' : new Pawn('white7pawn',plt,initialTurn),
        '6+0' : new Pawn('black0pawn',pdt,initialTurn),
        '6+1' : new Pawn('black1pawn',pdt,initialTurn),
        '6+2' : new Pawn('black2pawn',pdt,initialTurn),
        '6+3' : new Pawn('black3pawn',pdt,initialTurn),
        '6+4' : new Pawn('black4pawn',pdt,initialTurn),
        '6+5' : new Pawn('black5pawn',pdt,initialTurn),
        '6+6' : new Pawn('black6pawn',pdt,initialTurn),
        '6+7' : new Pawn('black7pawn',pdt,initialTurn),
        '7+0' : new Rook('black0rook',rdt,initialTurn),
        '7+1' : new Knight('black0knight',ndt,initialTurn),
        '7+2' : new Bishop('black0bishop',bdt,initialTurn),
        '7+3' : new Queen('black0queen',qdt,initialTurn),
        '7+4' : new King('black0king',kdt,initialTurn),
        '7+5' : new Bishop('black1bishop',bdt,initialTurn),
        '7+6' : new Knight('black1knight',ndt,initialTurn),
        '7+7' : new Rook('black1rook',rdt,initialTurn)
    }
    
    return initialTurn==='white' ? {
        positions : {...initialPositionsWhite},
        mappedObject : getMappedObject(initialPositionsWhite)
    } : {
        positions : {...initialPositionsBlack},
        mappedObject : getMappedObject(initialPositionsBlack)
    }
}