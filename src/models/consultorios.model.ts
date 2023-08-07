import { Schema, model } from "mongoose";

export interface IConsultorio extends Document {
    nombre: string;
    notas: string;
    activo: boolean;
}

const schema = new Schema<IConsultorio>({
    nombre: String,
    notas: String,
    activo: {
        type: Schema.Types.Boolean,
        default: true,
    }
});

export const ConsultoriosModel = model('consultorios', schema);