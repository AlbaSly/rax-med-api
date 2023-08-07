import { Request, Response } from "express";
import RolesService from "./roles.service";
import { HandleControllerError, HandleControllerResponse } from "../../common/handlers";

export namespace RolesController {
    export const Catalogo = async (req: Request, res: Response) => {
        try {
            const service = new RolesService();
            const response = await service.Catalogo();

            return HandleControllerResponse(response, res);
        } catch (e) {
            return HandleControllerError(e, res);
        }
    }
}