import { Schema, model } from "mongoose";

export interface IEspecialidad extends Document {
    nombre: string;
    descripcion: string;
    duracionPorSesion: string;
}

const schema = new Schema<IEspecialidad>({
    nombre: String,
    descripcion: String,
    duracionPorSesion: Number,
});

export const EspecialidadesModel = model('especialidades', schema);