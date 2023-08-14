import { Schema, model, Document } from "mongoose";
import { IUsuarioPopulated } from "./usuarios.model";

export interface IPaciente extends Document {
    usuario: Schema.Types.ObjectId,
    activo: boolean,
}

export interface IPacientePopulated extends Document {
    usuario: IUsuarioPopulated;
    activo: boolean;
}

const schema = new Schema<IPaciente>({
    usuario: {
        type: Schema.Types.ObjectId,
        ref: 'usuarios'
    },
    activo: {
        type: Schema.Types.Boolean,
        default: true,
    }
});

export const PacientesModel = model('pacientes', schema);