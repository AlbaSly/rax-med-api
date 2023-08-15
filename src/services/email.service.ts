import dotev from "dotenv";
dotev.config();

import nodemailer from "nodemailer";

import { api } from "../common/utils";

export default class EmailService {
    /**
    * El transporter es el medio con el que se mandarán los correos
    */
    private static readonly TRANSPORTER = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.NODEMAILER_USER,
            pass: process.env.NODEMAILER_PASS,
        }
    });

    private static readonly TRANSPORTER_DEVELOPMENT = nodemailer.createTransport({
        host: "sandbox.smtp.mailtrap.io",
        port: 2525,
        auth: {
          user: process.env.NODEMAILER_USER_DEVELOPMENT,
          pass: process.env.NODEMAILER_PASS_DEVELOPMENT,
        }
    });

    /**
     * Envía el email por medio del transporter manejando nodemailer
     * @param to Quién recibe
     * @param subject Asunto
     * @param html HTML embebido
     * @returns respuesta
     */
    static SendEmail(to: string, subject: string, html: string) {
        const options = {
            from: process.env.NODE_ENV ? process.env.NODEMAILER_USER : process.env.NODEMAILER_USER_DEVELOPMENT,
            to,
            subject,
            html
        }

        return new Promise<void>(async (resolve, reject) => {
            const currentTransporter = process.env.NODE_ENV ? this.TRANSPORTER : this.TRANSPORTER_DEVELOPMENT;

            currentTransporter.sendMail(options, function (error, info) {
                if (error) {
                    api.error("EMAIL SERVICE ERROR", error.message);
                    reject();
                } else {
                    api.log("EMAIL SERVICE", info.envelope);
                    resolve();
                }
            });
        })
    }
}