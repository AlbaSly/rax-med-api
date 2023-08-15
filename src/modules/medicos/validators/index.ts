import joi from "joi";

export default class MedicosValidator {
    private input: any;

    constructor(input: any = {}) {
        this.input = input;
    }

    Editar(): joi.ValidationResult<IEditarMedico> {
        let schema = joi.object<IEditarMedico>({
            horaEntrada: joi.string().pattern(/^([01]\d|2[0-3]):([0-5]\d)$/).required(),
            horaSalida: joi.string().pattern(/^([01]\d|2[0-3]):([0-5]\d)$/).required(),
        });

        return schema.validate(this.input);
    }

    AgregarEspecialidad(): joi.ValidationResult<IAgregarEspecialidad> {
        let schema = joi.object<IAgregarEspecialidad>({
            cedula: joi.string().trim().uppercase().min(10).max(10).required()
        });

        return schema.validate(this.input);
    }
}

export interface IEditarMedico {
    horaEntrada: string,
    horaSalida: string,
}

export interface IAgregarEspecialidad {
    cedula: string;
}