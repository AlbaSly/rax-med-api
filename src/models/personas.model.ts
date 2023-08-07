import { Document, model, Schema } from "mongoose";

export interface IPersona extends Document {
    nombre: string,
    apellidoPaterno: string,
    apellidoMaterno: string,
    fechaNacimiento: Date,
    sexo: string,
    curp: string,
    telefono: string,
    activo: boolean,
}

const schema = new Schema<IPersona>({
    nombre: String,
    apellidoPaterno: String,
    apellidoMaterno: String,
    fechaNacimiento: Date,
    sexo: String,
    curp: String,
    telefono: String,
    activo: {
        type: Schema.Types.Boolean,
        default: true,
    }
});

export const PersonasModel = model('personas', schema);