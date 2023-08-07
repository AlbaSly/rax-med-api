import { Schema, model, Document} from "mongoose";

interface IAplicacion extends Document {
    nombre: string,
    plataforma: string,
    descripcion: string,
    url: string,
    activo: boolean,
}

const schema = new Schema<IAplicacion>({
    nombre: String,
    plataforma: String,
    descripcion: String,
    url: {
        type: Schema.Types.String,
        default: null
    },
    activo: {
        type: Schema.Types.Boolean,
        default: true,
    }
});

export const AplicacionesModel = model('aplicaciones', schema);