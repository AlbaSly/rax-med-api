import { Schema, model, Document } from "mongoose";

export interface IMedicoEspecialidad extends Document {
    medico: Schema.Types.ObjectId,
    especialidad: Schema.Types.ObjectId,
    consultorio: Schema.Types.ObjectId,
    cedula: string,
    activo: boolean,
}

const schema = new Schema<IMedicoEspecialidad>({
    medico: {
        type: Schema.Types.ObjectId,
        ref: "medicos"
    },
    especialidad: {
        type: Schema.Types.ObjectId,
        ref: "especialidades"
    },
    consultorio: {
        type: Schema.Types.ObjectId,
        ref: "consultorios"
    },
    cedula: String,
    activo: {
        type: Schema.Types.Boolean,
        default: true,
    }
});

export const MedicosEspecialidadesModel = model('medicos-especialidades', schema);