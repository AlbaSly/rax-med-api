import { Request, Response } from "express";
import UsuariosService from "./usuarios.service";
import { HandleControllerError, HandleControllerResponse, HandleControllerValidationError } from "../../common/handlers";
import { MongoTypesValidator, UUIDValidator } from "../../common/validators";

export namespace UsuariosController {
    export const Catalogo = async (req: Request, res: Response) => {
        const busqueda: string = req.query.busqueda as string ?? undefined;

        try {
            const service = new UsuariosService();
            const response = await service.Catalogo(busqueda);

            return HandleControllerError(response, res);
        } catch (e) {
            return HandleControllerError(e, res);
        }
    }
    
    export const ObtenerInfo = async (req: Request, res: Response) => {
        const id = req.params.id;

        if (!MongoTypesValidator.isValid(id)) return HandleControllerValidationError(null, res, MongoTypesValidator.INCORRECT_MONGO_ID);
        try {
            const service = new UsuariosService();
            const response = await service.ObtenerInfo(id);

            return HandleControllerResponse(response, res);
        } catch (e) {
            return HandleControllerError(e, res);
        }
    }
}