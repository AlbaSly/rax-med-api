import { NextFunction, Request, Response, Router } from "express";

import { WEB_SERVER } from "../services/application.service";

import { AuthRouter } from "../modules/auth/routes";
import { MedicosRouter } from "../modules/medicos/routes";
import { PacientesRouter } from "../modules/pacientes/routes";
import { RolesRouter } from "../modules/roles/routes";
import { UsuariosRouter } from "../modules/usuarios/routes";
import { EspecialidadesRouter } from "../modules/especialidades/routes";
import { ConsultoriosRouter } from "../modules/consultorios/routes";

/**
 * Declaraciones de Rutas
 */
const ROUTE_DECLARATIONS: IRouteDeclarations = {
    prefix: '/api',
    nestedRoutes: [
        AuthRouter,
        MedicosRouter,
        PacientesRouter,
        RolesRouter,
        UsuariosRouter,
        EspecialidadesRouter,
        ConsultoriosRouter,
    ]
}

/**
 * Clase RouterManager para la gener
 */
export default class RouterManager {

    /**
     * Método constructor
     */
    constructor() {
        /**Primero Cors, y luego Routers */
        this.enableCors();
        this.buildRouters();
    }
    
    /**
     * Cargar las Rutas
     */
    private buildRouters() {
        const { prefix, nestedRoutes } = ROUTE_DECLARATIONS;

        nestedRoutes.forEach((router) => {
            WEB_SERVER.use(prefix, router);
        });

        /**Ruta NOT FOUND */
        WEB_SERVER.use('*', (req: Request, res: Response) => res.status(404).json({
            isError: true,
            msg: 'Recurso no encontrado',
            data: {
                resourceRequested: req.path
            }
        }));
    }

    /**
     * Cargar CORS
     */
    private enableCors() {
        WEB_SERVER.use('*', (req: Request, res: Response, next: NextFunction) => {
            res.header('Access-Control-Allow-Origin', '*');
            res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE');
            res.header("Access-Control-Allow-Headers", "X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Request-Method");
            res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
            
            next();
        });
    }
}

/**
 * Interface para ROUTE_DECLARATIONS
 */
interface IRouteDeclarations {
    prefix: string;
    nestedRoutes: Array<Router>,
}