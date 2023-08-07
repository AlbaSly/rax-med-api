import mongoose, { isValidObjectId } from "mongoose";
import * as uuid from "uuid";

export namespace UUIDValidator {
    export const INCORRECT_UUID_PATTERN: string = "El parámetro es incorrecto";

    export const isValid = (value: string) => {
        return uuid.validate(value);
    }
}

export namespace MongoTypesValidator {
    export const INCORRECT_MONGO_ID: string = "El parámetro es incorrecto";

    export const isValid = (value: string) => {
        if(isValidObjectId(value)) return true;

        return false;
    }
}