import * as fns from "date-fns";
import { DATETIME_FORMAT } from "../constants/";
/**
 * namespace para los logs con etiqueta de la api
 */
export namespace api {
    const name: string = 'API'
    /**
     * Funcion similar a console.log pero con una bandera que permite ver la fecha
     * @param message 
     * @param optionalParams 
     */
    export function log(message?: any, ...optionalParams: any[]) {
        let fecha: string = fns.format(new Date(), DATETIME_FORMAT);
        let flag: string = `[${name}-LOG ${fecha}]: `
        let canLog = true;
        if (canLog && message != '' && message != undefined) {
            if (optionalParams.length > 0) {
                console.log(flag + message);
                optionalParams.forEach(element => {
                    console.log(element);
                });
            } else {
                if (typeof message === 'object') {
                    console.log(flag, message);
                } else {
                    console.log(flag + message);
                }
            }
        }
    }

    export function error(message?: any, ...optionalParams: any[]) {
        let fecha: string = fns.format(new Date(), DATETIME_FORMAT);
        let flag: string = `[${name}-ERROR ${fecha}]: `
        if (message != '' && message != undefined) {
            if (optionalParams.length > 0) {
                console.error(flag + message);
                optionalParams.forEach(element => {
                    console.error(`=> `, element);
                });
            } else {
                if (typeof message === 'object') {
                    console.error(flag, message);
                } else {
                    console.error(flag + message);
                }

            }
        }
    }
}