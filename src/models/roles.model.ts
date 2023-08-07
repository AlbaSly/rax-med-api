import { Document, model, Schema } from "mongoose";

export interface IRol extends Document {
    nombre: string,
    password: string | null,
}

const schema = new Schema<IRol>({
    nombre: String,
    password: {
        type: Schema.Types.String,
        default: null
    }
});

export const RolesModel = model('roles', schema);