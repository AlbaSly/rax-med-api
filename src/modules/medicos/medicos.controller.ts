import { Request, Response } from "express";
import { HandleControllerError, HandleControllerResponse, HandleControllerValidationError } from "../../common/handlers";

import MedicosService from "./medicos.service";
import { MongoTypesValidator, UUIDValidator } from "../../common/validators";

export namespace MedicosController {
    export const CrearMedico = async (req: Request, res: Response) => {
        const id = req.params.id;

        if (!MongoTypesValidator.isValid(id)) return HandleControllerValidationError(null, res, MongoTypesValidator.INCORRECT_MONGO_ID);

        const body = req.body;

        try {
            const service = new MedicosService();
            const response = await service.CrearMedico(id);

            return HandleControllerResponse(response, res);
        } catch (e) {
            return HandleControllerError(e, res);
        }
    }
}