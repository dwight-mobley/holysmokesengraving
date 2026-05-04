import {Request, Response, NextFunction } from 'express';
import { verifyToken, JwtPayload } from '../lib/jwt';

declare global {
    namespace Express {
        interface Request{
            auth?: JwtPayload
        }
    }
};

export function requireAuth(req:Request, res:Response, next: NextFunction): void {
    const header = req.headers.authorization;
    if(!header?.startsWith('Bearer ')){
        res.status(401).json({error: 'Unauthorized'});
        return;
    }
    try{
        req.auth = verifyToken(header.slice(7));
        next();
    }catch(err){
        res.status(401).json({error: 'Invalid or expired token'});
    }
}
export function requireAdmin(req:Request, res:Response, next: NextFunction): void {
    requireAuth(req,res, ()=>{
        if(req.auth?.role !== 'ADMIN'){
            res.status(403).json({error:'Forbidden'});
            return;
        }
        next();
    });
}