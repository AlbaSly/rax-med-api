import { Request, Response } from "express";
import { HandleControllerError, HandleControllerResponse, HandleControllerValidationError } from "../../common/handlers";
import AuthService from "./auth.service";
import AuthValidator from "./validators";
import { MongoTypesValidator, UUIDValidator } from "../../common/validators";

export namespace AuthController {
    export const Registrar = async (req: Request, res: Response) => {
        const body = req.body;

        const { error, value } = new AuthValidator(body).Registrar();

        if (error) return HandleControllerValidationError(error, res);
        
        try {
            const service = new AuthService();
            const response = await service.Registrar(value);

            return HandleControllerResponse(response, res);
        } catch (e) {
            return HandleControllerError(e, res);
        }
    }

    export const IniciarSesion = async (req: Request, res: Response) => {
        const appID = req.params.id;
        const body = req.body;

        if (!MongoTypesValidator.isValid(appID)) return HandleControllerValidationError(null, res, MongoTypesValidator.INCORRECT_MONGO_ID);

        const { error, value } = new AuthValidator(body).IniciarSesion();

        if (error) return HandleControllerValidationError(error, res);

        try {
            const service = new AuthService();
            const response = await service.IniciarSesion(value, appID);

            return HandleControllerError(response, res);
        } catch (e) {
            return HandleControllerError(e, res);
        }
    }

    export const RecuperarCuenta = async (req: Request, res: Response) => {
        const body = req.body;

        const { error, value } = new AuthValidator(body).RecuperarCuenta();
        
        if (error) return HandleControllerValidationError(error, res);

        try {
            const service = new AuthService();
            const response = await service.RecuperarCuenta(value);

            return HandleControllerResponse(response, res);
        } catch (e) {
            return HandleControllerError(e, res);
        }
    }

    export const NuevaContrasena = async (req: Request, res: Response) => {
        const body = req.body;

        const { error, value } = new AuthValidator(body).NuevaContrasena();

        if (error) return HandleControllerValidationError(error, res);

        try {
            const service = new AuthService();
            const response = await service.NuevaContrasena(value);

            return HandleControllerResponse(response, res);
        } catch (e) {
            return HandleControllerError(e, res);
        }
    }

    export const ObtenerDatos = async (req: Request, res: Response) => {
        const {id} = req.user;
        if (!MongoTypesValidator.isValid(id)) return HandleControllerValidationError(null, res, MongoTypesValidator.INCORRECT_MONGO_ID);

        try {
            const service = new AuthService();
            const response = await service.ObtenerDatos(id);

            return HandleControllerError(response, res);
        } catch (e) {
            return HandleControllerError(e, res);
        }
    };
}