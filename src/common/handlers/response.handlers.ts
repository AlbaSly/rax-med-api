import { NextFunction, Response } from "express";

import { IRejectResponse, IResolveResponse } from "../interfaces";

/**
 * Maneja la respuesta correcta enviada por los Servicios hacia el controlador
 * @param responseData Respuesta 
 * @param res Express Response
 * @param next Express NextFunction
 * @returns Express Response con el status code y data estructurada
 */
export const HandleControllerResponse = <T>(responseData: IResolveResponse<T>, res: Response, next?: NextFunction) => {
    const _response = responseData as IResolveResponse<T>;

    return res.status(_response.statusCode).json(_response);
}

/**
 * Maneja los errores devueltos por los Servicios (Providers) hacia el Controlador
 * @param error Error
 * @param res Express Response
 * @returns Express Response con los detalles del error de una manera estructurada
 */
export const HandleControllerError = (error: any, res: Response) => {
    const _error = error as IRejectResponse;

    return res.status(_error.statusCode).json(_error);
}

/**
 * Maneja los errores devueltos por la validación dentro del controlador
 * @param error Error
 * @param res Express Response
 * @returns Express Response con los detalles sobre el error de validación del controlador
 */
export const HandleControllerValidationError = (error: any, res: Response, customMessage?: string) => {
    return res.status(400).json({
        isError: true,
        statusCode: 400,
        msg: customMessage ?? "Compruebe los datos nuevamente",
        error
    });
}