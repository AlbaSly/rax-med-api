import dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";

import { api } from "../common/utils";
import { MODELS } from "../models";

export default class DatabaseServive {
    private static readonly MONGO_URI: string | null = process.env.MONGO_URI ?? null;
    private static IS_DB_READY: boolean = false;

    static async connect(): Promise<void> {
        return new Promise<void>(async (resolve, reject) => {
            if (this.IS_DB_READY) {
                api.error("DATABASE SERVICE ERROR", "DB IS READY");
                return reject();
            }

            if (!this.MONGO_URI) {
                api.error("DATABASE SERVICE ERROR", "MONGO URI IS MISSING");
                return reject();
            }

            mongoose.connect(this.MONGO_URI).then(async db => {
                this.IS_DB_READY = true;
                api.log("DATABASE SERVICE", "CONNECTION SUCCESSFUL");

                const modelsToCreate = MODELS.map(model => model.createCollection());
                await Promise.all(modelsToCreate);
                api.log("DATABASE SERVICE", "MODELS HAVE BEEN CREATED SUCCESSFULLY");
                
                resolve();
            })
            .catch(e => {
                api.error("DATABASE SERVICE ERROR", "CONNECTION FAILED");
                api.error(e);
                reject();
            });
        });
    }
}