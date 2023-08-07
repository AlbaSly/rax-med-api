import JWTService from "../../services/jwt.service";

export namespace CommonMiddlewares {

    /**Se reemplaza la forma de manejar el middleware por otra */
    export const ValidateRouteAccess = JWTService.ValidarJWTToken;
}