import bcrypt from "bcrypt";
import crypto from "crypto";
import { MAX_GENERATED_CODE_LENGTH, MAX_GENERATED_PASSWORD_LENGTH } from "../common/constants";

/**
 * Servicio relacionado a la encriptación y generación de contraseñas
 * - Es dependiente de las librerías bcrypt y crypto
 * @author Raxel Arias
 */
export default class EncryptionService {
    /**
     * Genera una contraseña de n caracteres, únicamente de mayúsculas y minísculas
     * @param length Longitud de la contraseña a generar
     * @returns Contraseña aleatoria generada
     */
    public static GenerateRandomPassword(length: number = MAX_GENERATED_PASSWORD_LENGTH): string {
        const characters: string = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
        let password: string = '';
        
        for (let i = 0; i < length; i++) {
            const randomIndex = Math.floor(Math.random() * characters.length);
            password += characters.charAt(randomIndex);
        }
        
        return password;
    }

    /**
     * Genera una combinación de n dígitos del 0 al 10
     * @param length Longitud de la combinación a generar
     * @returns Combinación aleatoria generada
     */
    public static GenerateRandomNumbers(length: number = MAX_GENERATED_CODE_LENGTH): string {
        let numbers = '';
        
        for (let i = 0; i < length; i++) {
          const randomDigit = Math.floor(Math.random() * 10); // Genera un número aleatorio entre 0 y 9
          numbers += randomDigit.toString();
        }
        
        return numbers;
    }

    /**
     * Método estático para la generación de un hash
     * @param data la cadena de caracteres a hashear
     * @returns 
     */
    public static GenHash(data: string): Promise<string> {
        /**El proceso puede tardar, por lo que se manda como promesa para que la llamada sea síncrona */
        return new Promise(async (resolve, reject) => {
            try {
                /**Se obtiene el dato hasheado con ayuda de la librería bcrypt y el método hashSync */
                /**el método de bcrypt.genSaltSync manda a hashear x veces, en este caso 10 */
                const hashedData: string = bcrypt.hashSync(data, bcrypt.genSaltSync(10));

                /**Deolver el dato hasheado */
                resolve(hashedData);
            } catch (error) {
                /**Manejo de errores */
                reject(error);
            }
        });
    }

    /**
     * Método estático para comparar el dato original con la versión hasheada
     * @param data cadena a hashear
     * @param hashed cadena hasheada a comparar
     * @returns Un booleano verificando si la valdiación fue exitosa
     */
    public static CompareHash(data: string, hashed: string): Promise<boolean> {
        return new Promise(async (resolve, reject) => {
            try {
                /**Booleano que valida si ambos datos coinciden */
                /**Se usa ayuda de la librería bcrypt con el método compareSync */
                const isValid: boolean = bcrypt.compareSync(data, hashed);
                
                /**Respuesta con el booleano */
                resolve(isValid);
            } catch (error) {
                /**Manejo de errores */
                reject(error);
            }
        });
    }

    /**
     * Método para la generación de un token único
     * @returns Respuesta con el token
     */
    public static GenToken(): Promise<string> {
        return new Promise(async (resolve, reject) => {
            /**Token generado */
            /**Se usa ayuda de la librería crypto con el método randomBytes(tamaño) y se parsea con el método integrado .toString */
            const token = crypto.randomBytes(20).toString('hex');
        
            /**Devolver el token generado */
            resolve(token);
        });
    }
}