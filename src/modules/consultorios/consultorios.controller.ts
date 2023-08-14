import { Request, Response } from "express";
import ConsultoriosValidator from "./validators";
import { HandleControllerError, HandleControllerValidationError } from "../../common/handlers";
import ConsultoriosService from "./consultorios.service";

export namespace ConsultoriosController {
    export const Crear = async (req: Request, res: Response) => {
        const body = req.body;

        const { error, value } = new ConsultoriosValidator(body).Crear();

        if (error) return HandleControllerValidationError(error, res);

        try {
            const service = new ConsultoriosService();
            const response = await service.Crear(value);

            return HandleControllerError(response, res);
        } catch (e) {
            return HandleControllerError(e, res);
        }
    }

    export const Catalogo = async (req: Request, res: Response) => {
        const busqueda: string = req.query.busqueda as string ?? undefined;

        try {
            const service = new ConsultoriosService();
            const response = await service.Catalogo(busqueda);

            return HandleControllerError(response, res);
        } catch (e) {
            return HandleControllerError(e, res);
        }
    }
}