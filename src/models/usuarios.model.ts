import { Document, model, Schema } from "mongoose";

import { IPersona } from "./personas.model";
import { IRol } from "./roles.model";

export interface IUsuario extends Document {
    persona: Schema.Types.ObjectId,
    rol: Schema.Types.ObjectId,
    email: string,
    password: string,
    codigo: string | null,
    expiracionCodigo: Date | null,
    activo: boolean,
}

export interface IUsuarioPopulated extends Document {
    persona: IPersona,
    rol: IRol,
    email: string,
    password: string,
    codigo: string | null,
    expiracionCodigo: Date | null,
    activo: boolean,
}

const schema = new Schema<IUsuario>({
    persona: {
        type: Schema.Types.ObjectId,
        ref: 'personas'
    },
    rol: {
        type: Schema.Types.ObjectId,
        ref: 'roles'
    },
    email: String,
    password: String,
    codigo: {
        type: Schema.Types.String,
        default: null,
    },
    expiracionCodigo: {
        type: Schema.Types.Date,
        default: null
    },
    activo: {
        type: Schema.Types.Boolean,
        default: true,
    }
});

export const UsuariosModel = model('usuarios', schema);