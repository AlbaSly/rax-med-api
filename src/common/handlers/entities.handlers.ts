import { IPersona, IUsuario, IUsuarioPopulated } from "../../models";
import { RemoveDiacritics } from "../utils";

/**
 * Representa la función ILIKE de PostgreSQL para hacer búsquedas que coincidan con un patrón dentro de un array
 * @param array Arreglo de tipo genérico donde se hará la filtración
 * @param pattern Patrón de búsqueda
 * @returns Arreglo con los resultados filtrados
 */
export const SearchByIlikeFunction = <T extends {usuario: IUsuarioPopulated}>(array: Array<T>, pattern: string | null): Array<T> => {
    if (!pattern) return array;
    
    const escapedPattern = RemoveDiacritics(pattern.replace(/([.*+?^=!:${}()|[\]/\\])/g, "\\$1"));

    const regexPattern = escapedPattern
        .replace(/%/g, ".*")
        .replace(/_/g, ".");

    const regex = new RegExp(regexPattern, "i");

    return array.filter(element => {
        const {nombre, apellidoPaterno, apellidoMaterno}: IPersona = element.usuario.persona;
        const fullName: string = RemoveDiacritics(nombre + " " + apellidoPaterno + " " + apellidoMaterno);

        return regex.test(fullName);
    });
}

/**
 * Representa la función ILIKE de PostgreSQL para hacer búsquedas que coincidan con un patrón dentro de un array
 * @param array Arreglo de tipo genérico donde se hará la filtración
 * @param pattern Patrón de búsqueda
 * @returns Arreglo con los resultados filtrados
 */
export const SearchByIlikeFunctionPersonas = <T extends {persona: IPersona}>(array: Array<T>, pattern: string | null): Array<T> => {
    if (!pattern) return array;
    
    const escapedPattern = RemoveDiacritics(pattern.replace(/([.*+?^=!:${}()|[\]/\\])/g, "\\$1"));

    const regexPattern = escapedPattern
        .replace(/%/g, ".*")
        .replace(/_/g, ".");

    const regex = new RegExp(regexPattern, "i");

    return array.filter(element => {
        const {nombre, apellidoPaterno, apellidoMaterno}: IPersona = element.persona;
        const fullName: string = RemoveDiacritics(nombre + " " + apellidoPaterno + " " + apellidoMaterno);

        return regex.test(fullName);
    });
}