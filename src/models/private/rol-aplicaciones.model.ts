import { Schema, model, Document } from "mongoose";

interface IRolAplicacion extends Document {
    rol: Schema.Types.ObjectId,
    aplicacion: Schema.Types.ObjectId,
}

const schema = new Schema<IRolAplicacion>({
    rol: {
        type: Schema.Types.ObjectId,
        ref: 'roles',
    },
    aplicacion: {
        type: Schema.Types.ObjectId,
        ref: 'aplicaciones'
    }
});

export const RolAplicacionesModel = model('rol-aplicaciones', schema);