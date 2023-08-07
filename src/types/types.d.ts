/**Agregar user a las peticiones y respuestas */
declare namespace Express {
    export interface Request {
        user: {id: string}
    }
    export interface Response {
        user: {id: string}
    }
}