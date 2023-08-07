import joi from "joi";

export default class ConsultoriosValidator {
    private input: any;

    constructor(input: any = {}) {
        this.input = input;
    }

    Crear(): joi.ValidationResult<ICrearConsultorio> {
        let schema = joi.object<ICrearConsultorio>({
            nombre: joi.string().trim().uppercase().min(1).max(80).required(),
            notas: joi.string().trim().min(1).default('Sin notas.').optional(),
        });

        return schema.validate(this.input);
    }
}

export interface ICrearConsultorio {
    nombre: string;
    notas: string;
}