import { Request, Response } from "express";
import { HandleControllerError, HandleControllerResponse, HandleControllerValidationError } from "../../common/handlers";

import MedicosService from "./medicos.service";
import { MongoTypesValidator, UUIDValidator } from "../../common/validators";
import MedicosValidator from "./validators";

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

    export const ObtenerInfo = async (req: Request, res: Response) => {
        const id = req.params.id;

        if (!MongoTypesValidator.isValid(id)) return HandleControllerValidationError(null, res, MongoTypesValidator.INCORRECT_MONGO_ID);
        try {
            const service = new MedicosService();
            const response = await service.ObtenerInfo(id);

            return HandleControllerResponse(response, res);
        } catch (e) {
            return HandleControllerError(e, res);
        }
    }

    export const Editar = async (req: Request, res: Response) => {
        const idMedico = req.params.id;
        const body = req.body;

        if (!MongoTypesValidator.isValid(idMedico)) return HandleControllerValidationError(null, res, MongoTypesValidator.INCORRECT_MONGO_ID);

        const { error, value } = new MedicosValidator(body).Editar();

        if (error) return HandleControllerValidationError(error, res);

        try {
            const service = new MedicosService();
            const response = await service.Editar(idMedico, value);

            return HandleControllerResponse(response, res);
        } catch (e) {
            return HandleControllerError(e, res);
        }
    }

    export const AgregarEspecialidad = async (req: Request, res: Response) => {
        const idMedico = req.params.idMedico;
        const idEspecialidad = req.params.idEspecialidad;
        const idConsultorio = req.params.idConsultorio;
        const body = req.body;

        if (!MongoTypesValidator.isValid(idMedico) || !MongoTypesValidator.isValid(idEspecialidad) || !MongoTypesValidator.isValid(idConsultorio)) return HandleControllerValidationError(null, res, MongoTypesValidator.INCORRECT_MONGO_ID);

        const { error, value } = new MedicosValidator(body).AgregarEspecialidad();
        
        if (error) return HandleControllerValidationError(error, res);

        try {
            const service = new MedicosService();
            const response = await service.AgregarEspecialidad(idMedico, idEspecialidad, idConsultorio, value);

            return HandleControllerResponse(response, res);
        } catch (e) {
            return HandleControllerError(e, res);
        }
    }

    export const ModificarEstadoEspecialidad = async (req: Request, res: Response) => {
        const id = req.params.id;

        if (!MongoTypesValidator.isValid(id)) return HandleControllerValidationError(null, res, MongoTypesValidator.INCORRECT_MONGO_ID);

        try {
            const service = new MedicosService();
            const response = await service.ModificarEstadoEspecialidad(id);

            return HandleControllerError(response, res);
        } catch (e) {
            return HandleControllerError(e, res);
        }
    }

    export const ListadoEspecialidades = async (req: Request, res: Response) => {
        const id = req.params.id;

        if (!MongoTypesValidator.isValid(id)) return HandleControllerValidationError(null, res, MongoTypesValidator.INCORRECT_MONGO_ID);

        try {
            const service = new MedicosService();
            const response = await service.ListadoEspecialidades(id);

            return HandleControllerResponse(response, res);
        } catch (e) {
            return HandleControllerError(e, res);
        }
    }

    export const Catalogo = async (req: Request, res: Response) => {
        const busqueda: string = req.query.busqueda as string ?? undefined;

        try {
            const service = new MedicosService();
            const response = await service.Catalogo(busqueda);

            return HandleControllerError(response, res);
        } catch (e) {
            return HandleControllerError(e, res);
        }
    }
}