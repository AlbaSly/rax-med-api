import dotenv from "dotenv";
dotenv.config();

import { NextFunction, Request, Response } from "express";

import jwt from "jsonwebtoken";

/**EL JWT SECRET */
const JWT_SECRET = process.env.JWT_SECRET!;

/**
 * Servicio para el manejo de tokens JWT
 * - Requiere de la librería dotenv y el propio express para su manejo
 * @author Raxel Arias
 */
export default class JWTService {
    /**
     * Genera un token JWT para auenticar
     * @param data Los datos a guardar
     * @returns JWT token
     */
    static async GenerarJWT(data: any) {
        return jwt.sign(data, JWT_SECRET!, {
            expiresIn: '30d',
        });
    }

    /**
     * Middleware que valida un token JWT
     * @param req Express Request
     * @param res Express Response
     * @param next Express NextFunction
     * @returns Respuesta
     */
    static async ValidarJWTToken(req: Request, res: Response, next: NextFunction) {
        const authHeaders = req.headers.authorization;
        
        if (!authHeaders || !authHeaders.startsWith('Bearer')) {
            res.status(403).json({
                msg: 'Token Inválido o no encontrado',
                error: true
            });
            return;
        }
    
        let token = authHeaders.split(' ')[1];
    
        if (!token) {
            res.status(404).json({
                msg: 'No existe un token para validar',
                error: true
            });
            return;
        }

        const decodedData = jwt.verify(token.trim(), JWT_SECRET!, (err, user) => {
            
            if (err) {
                res.status(403).json({
                    msg: 'Token JWT Inválido',
                });
            } else {
                (req as any).user = user;
                next();
            }
        });
    }
}