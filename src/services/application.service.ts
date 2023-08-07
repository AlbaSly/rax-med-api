import dotenv from "dotenv";
dotenv.config();

import express, { Application, NextFunction, Request, Response } from "express";

import colors from "colors";

import bp from "body-parser";
import cors from 'cors';
import cookies from 'cookie-parser';
import useragent from "express-useragent";

import DatabaseServive from "./db.service";
import RouterManager from '../routes';
import { api } from '../common/utils';

/**APLICACIÓN GLOBAL EXPRESS */
export let WEB_SERVER: Application;

/**
 * Clase Server para la creación del WEB_SERVER
 */
export default class ServerService {

    constructor() {
        WEB_SERVER = express();
        this.WebService();
    }

    private async WebService(): Promise<void> {
        try {
            await DatabaseServive.connect();

            this.LoadMiddlewares();
            this.LoadRoutes();
    
            this.SetPortAndRun();
        } catch (e) {
            api.log("An error has been occurred when starting the Web Service");
        } 
    }

    private LoadRoutes(): void {
        const routerManager: RouterManager = new RouterManager();
        
        api.log("Configured Routes");
    }

    private LoadMiddlewares(): void {
        WEB_SERVER.use(cors());
        WEB_SERVER.use(useragent.express());

        WEB_SERVER.use(bp.urlencoded({extended: true}));
        WEB_SERVER.use(bp.json());
        
        WEB_SERVER.use(cookies());
        // WEB_SERVER.use(session({
        //     secret: 'supersecret',
        //     resave: false,
        //     saveUninitialized: false,
        //     cookie: {
        //         maxAge: 6000,
        //     }
        // }));

        /**Algunas funciones extras */
        WEB_SERVER.use((req: Request, res: Response, next: NextFunction) => {
            next();
        });

        api.log("Configured Middlewares");
    }

    private SetPortAndRun(): void {
        const PORT: any = process.env.APP_PORT || 5000;
        const HOST: string = process.env.APP_HOST || '0.0.0.0';

        WEB_SERVER.listen(PORT, HOST, () => {
            api.log("API WebService Running in " + colors.green(HOST + ":" + PORT));
        });
    }
}