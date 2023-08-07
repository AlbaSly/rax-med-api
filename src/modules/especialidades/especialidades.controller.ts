import { Request, Response } from "express";
import { HandleControllerError, HandleControllerResponse, HandleControllerValidationError } from "../../common/handlers";
import EspecialidadesValidator from "./validators";
import EspecialidadesService from "./especialidades.service";

export namespace EspecialidadesController {
    export const Crear = async (req: Request, res: Response) => {
        const body = req.body;

        const { error, value } = new EspecialidadesValidator(body).Crear();

        if (error) return HandleControllerValidationError(error, res);
        
        try {
            const service = new EspecialidadesService();
            const response = await service.Crear(value);

            return HandleControllerError(response, res);
        } catch (e) {
            return HandleControllerError(e, res);
        }
    }

    export const Catalogo = async (req: Request, res: Response) => {
        try {
            const service = new EspecialidadesService();
            const response = await service.Catalogo();

            return HandleControllerResponse(response, res);
        } catch (e) {
            return HandleControllerError(e, res);
        }
    }
}