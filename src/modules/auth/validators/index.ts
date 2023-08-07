import joi from "joi";
import { MAX_GENERATED_CODE_LENGTH } from "../../../common/constants";

export default class AuthValidator {
    private input: any;

    constructor(input: any = {}) {
        this.input = input;
    }

    Registrar(): joi.ValidationResult<IRegistrar> {
        let schema = joi.object<IRegistrar>({
            persona: joi.object({
                nombre: joi.string().trim().uppercase().min(1).max(75).required(),
                apellidoPaterno: joi.string().trim().uppercase().min(1).max(75).required(),
                apellidoMaterno: joi.string().trim().uppercase().min(1).max(75).required(),
                sexo: joi.string().trim().uppercase().length(1).valid("H", "M").required(),
                fechaNacimiento: joi.date().required(),
                curp: joi.string().trim().uppercase().length(18).required(),
                telefono: joi.string().trim().length(10).required(),
            }).required(),
            credenciales: joi.object({
                email: joi.string().trim().email().uppercase().max(75).required()
            }).required(),
            rol: joi.object({
                nombre: joi.string().trim().uppercase().min(1).max(75).required(),
                password: joi.string().allow(null).min(1).max(100).default(null).optional(),
            }).required()
        });

        return schema.validate(this.input);
    }

    IniciarSesion(): joi.ValidationResult<IIniciarSesion> {
        let schema = joi.object<IIniciarSesion>({
            email: joi.string().trim().email().uppercase().max(75).required(),
            password: joi.string().min(1).max(100).required(),
        });

        return schema.validate(this.input);
    }

    RecuperarCuenta(): joi.ValidationResult<IRecuperarCuenta> {
        let schema = joi.object<IRecuperarCuenta>({
            email: joi.string().trim().email().uppercase().max(75).required(),
        });

        return schema.validate(this.input);
    }

    NuevaContrasena(): joi.ValidationResult<INuevaContrasena> {
        let schema = joi.object<INuevaContrasena>({
            email: joi.string().trim().email().uppercase().max(75).required(),
            codigo: joi.string().min(MAX_GENERATED_CODE_LENGTH).max(MAX_GENERATED_CODE_LENGTH).required(),
            password: joi.string().min(8).max(100).required(),
        });

        return schema.validate(this.input);
    }
}

export interface IRegistrar {
    persona: {
        nombre: string,
        apellidoPaterno: string,
        apellidoMaterno: string,
        fechaNacimiento: Date,
        curp: string,
        telefono: string,
        activo: boolean,
    };
    credenciales: {
        email: string
    };
    rol: {
        nombre: string,
        password: string | null
    };
}

export interface IIniciarSesion {
    email: string;
    password: string;
}

export interface IRecuperarCuenta {
    email: string;
}

export interface INuevaContrasena {
    email: string;
    codigo: string;
    password: string;
}