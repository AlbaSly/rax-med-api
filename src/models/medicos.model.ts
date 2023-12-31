import { Schema, model, Document } from "mongoose";
import { IUsuarioPopulated } from "./usuarios.model";

export interface IMedico extends Document {
    usuario: Schema.Types.ObjectId;
    horaEntrada: Date;
    horaSalida: Date;
    activo: boolean;
}

export interface IMedicoPopulated extends Document {
    usuario: IUsuarioPopulated;
    horaEntrada: Date;
    horaSalida: Date;
    activo: boolean;
}

const schema = new Schema<IMedico>({
    usuario: {
        type: Schema.Types.ObjectId,
        ref: 'usuarios'
    },
    horaEntrada: {
        type: Schema.Types.Date,
        default: null
    },
    horaSalida: {
        type: Schema.Types.Date,
        default: null
    },
    activo: {
        type: Schema.Types.Boolean,
        default: true
    }
});

export const MedicosModel = model('medicos', schema);