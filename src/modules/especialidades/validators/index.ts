import joi from "joi";

export default class EspecialidadesValidator {
    private input: any;

    constructor(input: any = {}) {
        this.input = input;
    }

    Crear(): joi.ValidationResult<ICrearEspecialidad> {
        let schema = joi.object<ICrearEspecialidad>({
            nombre: joi.string().trim().uppercase().min(1).max(50).required(),
            descripcion: joi.string().trim().min(1).required(),
            duracionPorSesion: joi.number().min(1).required(),
        });
        
        return schema.validate(this.input);
    }
}

export interface ICrearEspecialidad {
    nombre: string;
    descripcion: string;
    duracionPorSesion: number;
}