import { Request, Response } from "express";
import { HandleControllerError, HandleControllerResponse, HandleControllerValidationError } from "../../common/handlers";
import PacientesService from "./pacientes.service";
import { MongoTypesValidator, UUIDValidator } from "../../common/validators";

export namespace PacientesController {
    export const CrearPaciente = async (req: Request, res: Response) => {
        const id = req.params.id;
        const body = req.body;

        if (!MongoTypesValidator.isValid(id)) return HandleControllerValidationError(null, res, MongoTypesValidator.INCORRECT_MONGO_ID);

        try {
            const service = new PacientesService();
            const response = await service.CrearPaciente(id);

            return HandleControllerError(response, res);
        } catch (e) {
            return HandleControllerError(e, res);
        }
    }

    export const ObtenerInfo = async (req: Request, res: Response) => {
        const id = req.params.id;

        if (!MongoTypesValidator.isValid(id)) return HandleControllerValidationError(null, res, MongoTypesValidator.INCORRECT_MONGO_ID);
        try {
            const service = new PacientesService();
            const response = await service.ObtenerInfo(id);

            return HandleControllerResponse(response, res);
        } catch (e) {
            return HandleControllerError(e, res);
        }
    }

    export const Catalogo = async (req: Request, res: Response) => {
        const busqueda: string = req.query.busqueda as string ?? undefined;

        try {
            const service = new PacientesService();
            const response = await service.Catalogo(busqueda);

            return HandleControllerError(response, res);
        } catch (e) {
            return HandleControllerError(e, res);
        }
    }
}